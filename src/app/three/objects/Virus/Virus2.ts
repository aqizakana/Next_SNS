import * as THREE from "three";
import * as CANNON from "cannon-es";

export class Virus2 {
	private particles: THREE.Group;
	private particleGeometry: THREE.SphereGeometry;
	private particleMaterial: THREE.ShaderMaterial;
	private particleMeshes: THREE.Mesh[];
	private particleMeshes2: THREE.Mesh[];
	private world: CANNON.World;
	private physicsBodies: CANNON.Body[];
	private groundBody: CANNON.Body;
	private groundMesh: THREE.Mesh;
	private groundMaterial: CANNON.Material;
	private physicsParticleMaterial: CANNON.Material;

	private currentGravity: CANNON.Vec3;

	constructor() {
		//物理エンジン
		this.world = new CANNON.World();
		this.world.gravity.set(0, -9.82, 0);
		this.physicsBodies = [];
		this.currentGravity = new CANNON.Vec3(0, -9.82, 0);

		// 物理マテリアルを作成
		this.physicsParticleMaterial = new CANNON.Material("particle");
		this.groundMaterial = new CANNON.Material("ground");

		this.particles = new THREE.Group();
		this.particleGeometry = new THREE.SphereGeometry(5, 32, 32);
		this.particleMaterial = new THREE.ShaderMaterial({
			vertexShader: `
            precision mediump float;
            uniform vec2 mouse;
            uniform float time;
            varying vec2 vUv;
        
            void main() {
                vUv = uv;
                
                // ワールド座標に変換
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                
                // マウス位置に基づいて頂点を移動
                vec2 mousePos = mouse * 2.0 - 1.0;
                float distanceToMouse = distance(worldPosition.xy, mousePos * 600.0);
                float influence = smoothstep(300.0, 0.0, distanceToMouse);
                
                // マウスに向かって引き寄せる
                worldPosition.xy += (mousePos * 600.0 - worldPosition.xy) * influence * 0.1;
                
                // 時間に基づいて揺らぎを追加
                worldPosition.x += sin(time * 2.0 + worldPosition.y * 0.02) * 10.0 * (1.0 - influence);
                worldPosition.y += cos(time * 2.0 + worldPosition.x * 0.02) * 10.0 * (1.0 - influence);
                
                // カメラ空間に戻す
                vec4 viewPosition = viewMatrix * worldPosition;
                gl_Position = projectionMatrix * viewPosition;
            }
        `,
			fragmentShader: `
            precision mediump float;
        
            varying vec2 vUv;
            uniform vec2 mouse; 
            uniform float time;
        
            void main() {
                // Convert UV coordinates to a range of [0, 1] for the gradient
                float gradient = vUv.y;
        
                vec2 m = mouse;
        
                // Create the grayscale color based on the gradient value
                vec3 color = vec3(gradient);
                
                // Calculate a dynamic value based on time
                //float dynamicValue = sin(time / 10.0) * 0.5 + 0.5;
        
                // Adjust the color based on mouse position and dynamic value
                gl_FragColor = vec4(1.0, color.y, 0.2, m.x);
            }
        `,
			uniforms: {
				mouse: { value: new THREE.Vector2(0, 0) },
				time: { value: 0 },
			},
		});
		this.particleMeshes = [];
		this.particleMeshes2 = [];

		const particleCount = 200;
		const sphereRadius = 150; // 球体の半径
		const particleRadius = 5; // パーティクルの半径
		const restitution = 1.0; // 反発係数（0.0から1.0の間）
		for (let i = 0; i < particleCount; i++) {
			const particleMesh = new THREE.Mesh(
				this.particleGeometry,
				this.particleMaterial,
			);
			const particleMesh2 = new THREE.Mesh(
				this.particleGeometry,
				this.particleMaterial,
			);

			const phi = Math.acos(2 * Math.random() - 1);
			const theta = 2 * Math.PI * Math.random();
			const r = sphereRadius * Math.pow(Math.random(), 1 / 3); // 均一な分布のための3乗根

			const x = r * Math.sin(phi) * Math.cos(theta);
			const y = r * Math.sin(phi) * Math.sin(theta);
			const z = r * Math.cos(phi);

			const radius = 300;
			const radius2 = 100;

			// 高さに変動を加える
			const heightVariation = Math.random() * 200; // 0から200の間でランダムな値
			const zVariation = Math.random() * 1000; // 50から200の間でランダムな値

			/*  particleMesh.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                heightVariation,
                radius * Math.cos(phi)
            );
            */
			particleMesh2.position.set(
				radius2 * Math.sin(phi) * Math.cos(theta),
				radius2 * Math.sin(phi) * Math.sin(theta),
				radius2 * Math.cos(phi),
			);

			particleMesh.position.set(x, y, z);
			//particleMesh2.position.set(x, y, z);

			const shape = new CANNON.Sphere(5); // パーティクルの半径
			const body = new CANNON.Body({
				mass: 1,
				shape: shape,
				position: new CANNON.Vec3(
					particleMesh.position.x,
					particleMesh.position.y,
					particleMesh.position.z,
				),
				material: this.physicsParticleMaterial,
			});
			this.world.addBody(body);
			this.physicsBodies.push(body);

			this.particles.add(particleMesh);
			this.particleMeshes.push(particleMesh);
			this.particles.add(particleMesh2);
			this.particleMeshes2.push(particleMesh2);
		}
		// 物理的な地面（球体の内側）を追加
		const groundShape = new CANNON.Sphere(sphereRadius);
		this.groundBody = new CANNON.Body({
			mass: 0,
			material: this.groundMaterial,
		});
		this.groundBody.addShape(groundShape);
		this.groundBody.position.set(0, 0, 0);
		this.world.addBody(this.groundBody);

		const particleContactMaterial = new CANNON.ContactMaterial(
			this.physicsParticleMaterial,
			this.physicsParticleMaterial,
			{
				restitution: 1.0, // パーティクル同士の反発係数
				friction: 0.8,
			},
		);
		this.world.addContactMaterial(particleContactMaterial);

		// 視覚的な地面を追加
		const groundGeometry = new THREE.SphereGeometry(380, 64, 64);

		const groundMaterial = new THREE.MeshBasicMaterial({
			color: 0x6699ff,
			side: THREE.BackSide, // 内側から見えるように
			transparent: true,
			opacity: 0.1,
		});
		this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
		this.groundMesh.position.set(0, 0, 0);
		this.particles.add(this.groundMesh);
	}

	public getMesh(): THREE.Group {
		return this.particles;
	}
	public setMousePosition(x: number, y: number) {
		this.particleMaterial.uniforms.mouse.value.set(x, y);
		/*const mouseX = (x - 0.5) * 2;
    const mouseY = (y - 0.5) * 2;

    const theta = Math.atan2(mouseY, mouseX);
    const phi = Math.PI / 2 - Math.sqrt(mouseX * mouseX + mouseY * mouseY) * Math.PI / 2;


    // マウス位置に基づいて球体を回転
    const rotationSpeed = 0.1; // 回転速度を増加
    const rotationX = new CANNON.Quaternion();
    rotationX.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), (x - 0.5) * rotationSpeed);

    const rotationY = new CANNON.Quaternion();
    rotationY.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), (y - 0.5) * rotationSpeed);

    const newRotation = rotationX.mult(rotationY);
    this.groundBody.quaternion = newRotation;
    this.groundMesh.quaternion.copy(this.groundBody.quaternion as any);

    // 重力の方向を更新
    const baseGravity = new CANNON.Vec3(0, -9.82, 0);
    this.currentGravity = newRotation.vmult(baseGravity);
    
    // 重力の x と z 成分を強調
    const gravityMultiplier = 100.0; // この値を調整して効果を強めたり弱めたりできます
    this.currentGravity.x *= gravityMultiplier;
    this.currentGravity.z *= gravityMultiplier;

    console.log("Current Gravity:", this.currentGravity); */

		/* // マウス位置に基づいてPlaneを傾ける
        const maxTiltAngle = Math.PI / 6; // 最大傾斜角（30度）
        const tiltX = (x - 0.5) * maxTiltAngle;
        const tiltZ = (y - 0.5) * maxTiltAngle;

        // 回転を計算
        const rotationX = new CANNON.Quaternion();
        rotationX.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2 + tiltZ);

        const rotationZ = new CANNON.Quaternion();
        rotationZ.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), tiltX);

        // 回転を組み合わせる
        this.groundBody.quaternion = rotationX.mult(rotationZ);
        this.groundMesh.quaternion.copy(this.groundBody.quaternion as any); */
	}
	public updateTime(time: number) {
		this.particleMaterial.uniforms.time.value = time;
	}

	public update(deltaTime: number) {
		// 重力の方向を適用
		/* this.particles.rotation.y += Math.cos(deltaTime) * 0.1;
        this.particles.rotation.x += Math.sin(deltaTime) * 0.1; */
		this.world.gravity.copy(this.currentGravity);
		//console.log("Applied Gravity:", this.world.gravity);

		this.world.step(1 / 60, deltaTime, 3);
		this.groundMesh.quaternion.copy(this.groundBody.quaternion as any);

		this.particleMeshes.forEach((mesh, index) => {
			const body = this.physicsBodies[index];
			mesh.position.copy(body.position as any);
			mesh.quaternion.copy(body.quaternion as any);

			// 球体の中心からの距離を計算
			const distance = mesh.position.length();
			if (distance > 295) {
				// 球体の内側に留まるように（半径から少し余裕を持たせる）
				const direction = new CANNON.Vec3(
					mesh.position.x / distance,
					mesh.position.y / distance,
					mesh.position.z / distance,
				);
				body.position.set(
					direction.x * 295,
					direction.y * 295,
					direction.z * 295,
				);

				// 速度を反射
				const dot = body.velocity.dot(direction);
				body.velocity.set(
					body.velocity.x - 2 * dot * direction.x,
					body.velocity.y - 2 * dot * direction.y,
					body.velocity.z - 2 * dot * direction.z,
				);
			}
		});

		// particleMeshes2の更新も同様に行う

		/* this.world.step(1 / 60, deltaTime, 3);

        this.particleMeshes.forEach((mesh, index) => {
            const body = this.physicsBodies[index * 2];
            if (body) {
                mesh.position.copy(body.position as any);
                mesh.quaternion.copy(body.quaternion as any);
            }
        }); */

		/* this.particleMeshes2.forEach((mesh, index) => {
            const body = this.physicsBodies[index * 2 + 1];
            if (body) {
                mesh.position.copy(body.position as any);
                mesh.quaternion.copy(body.quaternion as any);
            }
        }); */

		//this.particles.rotation.y += deltaTime * 0.1;
		/* this.particleMeshes.forEach((mesh, index) => {
            mesh.position.x += Math.sin(deltaTime + index) * 0.5;
            mesh.position.y += Math.cos(deltaTime + index) * 0.5;
            mesh.position.z += Math.sin(deltaTime + index) * 0.5;
        });
        this.particleMeshes2.forEach((mesh, index) => {
            mesh.position.x += Math.sin(deltaTime + index) * 0.5;
            mesh.position.y += Math.cos(deltaTime + index) * 0.5;
            mesh.position.z += Math.sin(deltaTime + index) * 0.5;
        }); */
	}
}

export default Virus2;
