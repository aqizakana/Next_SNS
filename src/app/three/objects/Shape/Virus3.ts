import * as THREE from 'three';

export class Virus {
    private particles: THREE.Group;
    private particleGeometry: THREE.SphereGeometry;
    private particleMaterial: THREE.ShaderMaterial;
    private particleMeshes: THREE.Mesh[];
    private particleMeshes2: THREE.Mesh[];

    constructor() {
        this.particles = new THREE.Group();
        this.particleGeometry = new THREE.SphereGeometry(5, 32, 32);
        this.particleMaterial = new THREE.ShaderMaterial({
            vertexShader: `
            precision mediump float;
            //Uv座標
            varying vec2 vUv;

            //マウス位置
            uniform vec2 mouse;
            //時間
            uniform float time;

            //インスタンス行列
            attribute mat4 instanceMatrix;
            //ライト方向
            uniform vec3 lightDirection;
            //ライト強度
            varying vec4 vColor; 
            //インスタンス位置
            varying vec4 vColor_2;

            void main() {
                vUv = uv;
                vec3 newPosition = position;
                
                // マウス位置に基づいて頂点を移動
                float distanceToMouse = distance(newPosition.xy, mouse * 2.0 - 1.0);
                float influence = smoothstep(0.2, 0.0, distanceToMouse);

                // インスタンス固有の変換を適用
                vec4 instancePosition = instanceMatrix * vec4(position, 1.0);

                //法線
                vec3 worldNormal = normalize(normalMatrix * normal);
                
                // 変換された法線を使用して照明計算などを行う
                float lightIntensity = dot(worldNormal, lightDirection);

                // ワールド座標に変換
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                
                // マウスに向かって引き寄せる
                newPosition.xy += (mouse * 2.0 - 1.0 - newPosition.xy) * influence * 0.1;
                worldPosition.xy += (mouse * 600.0 - worldPosition.xy) * influence * 1.0;

                // 時間に基づいて揺らぎを追加
                newPosition.x += sin(time * 2.0 + newPosition.y * 0.5) * 5.0 * (1.0 - influence);
                newPosition.y += cos(time * 2.0 + newPosition.x * 0.5) * 5.0 * (1.0 - influence);
                worldPosition.x += sin(time * 2.0 + worldPosition.y * 0.02) * 10.0 * (1.0 - influence);
                worldPosition.y += cos(time * 2.0 + worldPosition.x * 0.02) * 10.0 * (1.0 - influence);

                // カメラ空間に戻す
                vec4 viewPosition = viewMatrix * worldPosition;
                //gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0)  ;
                vColor = vec4(lightIntensity, lightIntensity, lightIntensity, 1.0);
                vColor_2 = vec4(instanceMatrix[3].xyz, 1.0); // 位置情報を色として使用
            }
        `,
            fragmentShader: `
                precision mediump float;

                varying vec2 vUv;
                uniform vec2 mouse;
                uniform float time;
                varying vec4 vColor;
                void main() {
                    // Convert UV coordinates to a range of [0, 1] for the gradient
                    float gradient = vUv.y;

                    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);

                    // Create the grayscale color based on the gradient value
                    vec3 color = vec3(gradient);
                    
                    // Calculate a dynamic value based on time
                    //float dynamicValue = sin(time / 10.0) * 0.5 + 0.5;
                    vec3 finalColor = mix(vec3(1.0, gradient, 0.2), vColor.rgb,0.5);
                    // Adjust the color based on mouse position and dynamic value
                    gl_FragColor = vec4(finalColor, 1.0);
                }
            `,
            uniforms: {
                mouse: { value: new THREE.Vector2(0, 0) },
                time: { value: 0 },
                lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
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

            particleMesh.position.set(
                radius * Math.sin(phi) * Math.cos(theta),
                radius * Math.sin(phi) * Math.sin(theta),
                radius * Math.cos(phi)
            );

            particleMesh2.position.set(
                radius2 * Math.sin(phi) * Math.cos(theta),
                radius2 * Math.sin(phi) * Math.sin(theta),
                radius2 * Math.cos(phi)
            );

            this.particles.add(particleMesh);
            this.particleMeshes.push(particleMesh);
            this.particles.add(particleMesh2);
            this.particleMeshes2.push(particleMesh2);
        }

    }

    public getMesh(): THREE.Group {
        return this.particles;
    }
    public setMousePosition(x: number, y: number) {
        this.particleMaterial.uniforms.mouse.value.set(x, y);
    }

    public update(deltaTime: number) {
        //this.particles.rotation.y += deltaTime * 0.1;
        this.particleMeshes.forEach((mesh, index) => {
            mesh.position.x += Math.sin(deltaTime + index) * 0.5;
            mesh.position.y += Math.cos(deltaTime + index) * 0.5;
            mesh.position.z += Math.sin(deltaTime + index) * 0.5;
        });
        this.particleMeshes2.forEach((mesh, index) => {
            mesh.position.x += Math.sin(deltaTime + index) * 0.5;
            mesh.position.y += Math.cos(deltaTime + index) * 0.5;
            mesh.position.z += Math.sin(deltaTime + index) * 0.5;
        });
    }
}

export default Virus;
