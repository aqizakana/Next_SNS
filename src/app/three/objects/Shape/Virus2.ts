import * as THREE from 'three';
import * as CANNON from 'cannon-es';

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

    constructor() {
        //物理エンジン
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.physicsBodies = [];

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

        const particleCount = 100;
        for (let i = 0; i < particleCount; i++) {
            const particleMesh = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
            const particleMesh2 = new THREE.Mesh(this.particleGeometry, this.particleMaterial);
            const phi = Math.acos(2 * Math.random() - 1);
            const theta = 2 * Math.PI * Math.random();
            const radius = 300;
            const radius2 = 100;

            // 高さに変動を加える
            const heightVariation = Math.random() * 200; // 0から200の間でランダムな値
            const zVariation = Math.random() * 1000; // 50から200の間でランダムな値

            particleMesh.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                heightVariation,
                radius * Math.cos(phi)
            );

            particleMesh2.position.set(
                radius2 * Math.sin(phi) * Math.cos(theta),
                radius2 * Math.sin(phi) * Math.sin(theta),
                radius2 * Math.cos(phi)
            );
            const shape = new CANNON.Sphere(1);
            const body1 = new CANNON.Body({
                mass: 1,
                shape: shape,
                position: new CANNON.Vec3(particleMesh.position.x, particleMesh.position.y, particleMesh.position.z)
            });
            const body2 = new CANNON.Body({
                mass: 1,
                shape: shape,
                position: new CANNON.Vec3(particleMesh2.position.x, particleMesh2.position.y, particleMesh2.position.z)
            });
            this.world.addBody(body1);
            this.world.addBody(body2);
            this.physicsBodies.push(body1, body2);

            this.particles.add(particleMesh);
            this.particleMeshes.push(particleMesh);
            this.particles.add(particleMesh2);
            this.particleMeshes2.push(particleMesh2);

            
        }
            /// 物理的な地面を追加
        const groundShape = new CANNON.Plane();
        this.groundBody = new CANNON.Body({ mass: 0 });
        this.groundBody.addShape(groundShape);
        this.groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.addBody(this.groundBody);

        // 視覚的な地面を追加
        const groundGeometry = new THREE.PlaneGeometry(5000, 5000);
        const groundMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xcccccc,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });
        this.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        this.groundMesh.position.set(0, 0, 0);
        this.groundMesh.rotation.x = -Math.PI / 2;
        this.particles.add(this.groundMesh);
    }

    public getMesh(): THREE.Group {
        return this.particles;
    }
    public setMousePosition(x: number, y: number) {
        this.particleMaterial.uniforms.mouse.value.set(x, y);

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
        this.world.step(1 / 60, deltaTime, 3);

        this.particleMeshes.forEach((mesh, index) => {
            const body = this.physicsBodies[index * 2];
            if (body) {
                mesh.position.copy(body.position as any);
                mesh.quaternion.copy(body.quaternion as any);
            }
        });

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
