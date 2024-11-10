import * as THREE from "three";
import { Background } from "../background";

export class Virus {
	private particles: THREE.Group;
	private particleGeometry: THREE.SphereGeometry;
	private particleMaterial: THREE.ShaderMaterial;
	private particleMeshes: THREE.Mesh[];
	private particleMeshes2: THREE.Mesh[];
	private background: Background;
	private camera: THREE.Camera;

	constructor() {
		this.background = new Background();
		this.camera = new THREE.Camera();
		this.particles = new THREE.Group();
		this.particleGeometry = new THREE.SphereGeometry(20, 200, 200);
		const vertexIndices = new Float32Array(
			this.particleGeometry.attributes.position.count,
		);
		for (let i = 0; i < vertexIndices.length; i++) {
			vertexIndices[i] = i;
		}
		this.particleGeometry.setAttribute(
			"vertexIndex",
			new THREE.BufferAttribute(vertexIndices, 1),
		);
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
            varying vec3 vNormal;
            varying vec3 vPosition;

            attribute float vertexIndex;  // 頂点インデックスを追加

            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
            }
            vec2 random2(vec2 p) {
                return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
            }

            float voronoi(vec2 x) {
                vec2 n = floor(x);
                vec2 f = fract(x);
                float m = 8.0;
                for(int j=-1; j<=1; j++)
                for(int i=-1; i<=1; i++) {
                    vec2 g = vec2(float(i),float(j));
                    vec2 o = random2(n + g);
                    o = 0.5 + 0.5*sin(time + 6.2831*o);
                    vec2 r = g + o - f;
                    float d = dot(r,r);
                    m = min(m, d);
                }
                return sqrt(m);
            }

                vec3 fractalDeform(vec3 p) {
                    float scale = 1.0;
                    for (int i = 0; i < 5; i++) {
                        p = abs(p) / dot(p, p) - 1.0;
                        scale *= 1.5;
                    }
                    return p * scale;
                }

                vec3 curl(float x, float y, float z)
                    {
                        float eps = 0.01;
                        float n1, n2, a, b;

                        n1 = noise(vec3(x, y + eps, z));
                        n2 = noise(vec3(x, y - eps, z));
                        a = (n1 - n2) / (2.0 * eps);

                        n1 = noise(vec3(x, y, z + eps));
                        n2 = noise(vec3(x, y, z - eps));
                        b = (n1 - n2) / (2.0 * eps);

                        return vec3(a - b, 0.0, 0.0);
                    }


            void main() {
                vUv = uv;
                float v = voronoi(position.xy * 0.1);
                vec3 flow = curl(position.x * 0.1, position.y * 0.1, position.z * 0.2);
                vec3 newPosition = position;
                
                // マウス位置に基づいて頂点を移動
                float distanceToMouse = distance(newPosition.xy, mouse * 2.0 - 1.0);
                float influence = smoothstep(0.2, 0.0, distanceToMouse);
                //float distanceToMouse = distance(worldPosition.xy, mousePos * 600.0);
                //float influence = smoothstep(300.0, 0.0, distanceToMouse);

                // インスタンス固有の変換を適用
                vec4 instancePosition = instanceMatrix * vec4(position, 0.5);

                //法線
                vec3 worldNormal = normalize(normalMatrix * normal);
                vNormal = normalize(normalMatrix * normal);
                vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;

                // 変換された法線を使用して照明計算などを行う
                float lightIntensity = dot(worldNormal, lightDirection);

                // ワールド座標に変換
                vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                vec2 mousePos = mouse * 2.0 - 1.0;
                worldPosition.xy += (mousePos * 600.0 - worldPosition.xy) * influence * 0.1;
                
                // マウスに向かって引き寄せる
                //newPosition.xy += (mouse * 2.0 - 1.0 - newPosition.xy) * influence * 0.1;
                //worldPosition.xy += (mouse * 600.0 - worldPosition.xy) * influence * 1.0;

                // 時間に基づいて揺らぎを追加
                if(mod(vertexIndex,10.0) == 0.0){
                newPosition.x += sin(time  + newPosition.y * 0.5) * 5.0 * (1.0 - influence);
                newPosition.y += cos(time  + newPosition.x * 0.5) * 5.0 * (1.0 - influence);
                newPosition.z += sin(time + newPosition.x * 0.5) * 5.0 * (1.0 - influence);
                
                }
                if(mod(vertexIndex,10.0) == 0.0){
                /* float scale = 1.0 + sin(time * 1.0) * 0.2;
                newPosition *= scale; */
                }

                worldPosition.x += sin(time * 2.0 + worldPosition.y * 0.02) * 10.0 * (1.0 - influence);
                worldPosition.y += cos(time * 2.0 + worldPosition.x * 0.02) * 10.0 * (1.0 - influence);

                //ノイズ効果


                //波紋効果
                /* float wave = sin(distance(newPosition.xy, vec2(0.0)) - time * 2.0) * 10.0;
                newPosition.x += wave; */

                // ねじれ効果
                /* float twist = sin(newPosition.y * 0.1 + time);
                float cosTheta = cos(twist);
                float sinTheta = sin(twist);
                newPosition.x = newPosition.x * cosTheta - newPosition.z * sinTheta;
                newPosition.z = newPosition.x * sinTheta + newPosition.z * cosTheta; */

                // 膨張収縮効果
                /* float scale = 1.0 + sin(time * 1.0) * 0.2;
                newPosition *= scale; */

                // 渦巻き効果
                /* float angle = atan(newPosition.y, newPosition.x);
                float radius = length(newPosition.xy);
                float spiral = sin(10.0 * angle - time * 5.0) * 0.1;
                newPosition.yx = vec2(
                    radius * cos(angle + spiral),
                    radius * sin(angle + spiral)
                ); */

                // ノイズ変形
                 /* vec3 noiseOffset = vec3(
                    noise(newPosition + time/100.0),
                    noise(newPosition + time/100.0),
                    noise(newPosition + time/100.0)
                );
                newPosition += noiseOffset * 10.0;  */
                
                // パルス効果
                if(mod(vertexIndex,9.0) == 0.0){
                /*  float pulse = sin(time * 2.0) * 0.5 + 0.5;
                newPosition *= 1.0 + pulse * 5.0;  */
                 float angle = atan(newPosition.y, newPosition.x);
                float radius = length(newPosition.xy);
                float spiral = sin(10.0 * angle - time * 5.0) * 0.1;
                newPosition.yx = vec2(
                    radius * cos(angle + spiral),
                    radius * sin(angle + spiral)
                );
                
                }
                
                
                // 波状の変形
                /* float waveX = sin(newPosition.y * 0.1 + time) * 10.0;
                float waveY = cos(newPosition.x * 0.1 + time) * 10.0;
                newPosition.x += waveX;
                newPosition.y += waveY; */

                // 球面への投影
                /* float radius = 100.0;
                vec3 spherePos = normalize(newPosition) * radius;
                newPosition = mix(newPosition, spherePos, (sin(time) * 0.5 + 0.5)); */

                vec3 instanceOffset = instanceMatrix[3].xyz;
           /*  float instanceNoise = fract(sin(dot(instanceOffset, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
            newPosition += vec3(
                sin(time * 2.0 + instanceNoise * 10.0),
                cos(time * 2.0 + instanceNoise * 10.0),
                sin(time * 3.0 + instanceNoise * 10.0)
            ) * 5.0; */
        
            
                // カメラ空間に戻す
                vec4 viewPosition = viewMatrix * worldPosition;
                //gl_Position = projectionMatrix * modelViewMatrix * instancePosition;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
                vColor = vec4(lightIntensity, lightIntensity, lightIntensity, 1.0);
                vColor_2 = vec4(instanceMatrix[3].xyz, 1.0); // 位置情報を色として使用
            }
        `,
			fragmentShader: `
    precision mediump float;

    varying vec2 vUv;
    varying vec4 vColor;
    varying vec4 vColor_2;
    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec2 mouse;
    uniform float time;
    uniform vec3 cameraPosition;
    uniform vec3 lightPosition;
    uniform vec3 lightColor;
    uniform float intensity;
    uniform vec3 baseColor;
    uniform float glowStrength;

    // ノイズ関数
    float noise(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    void main() {
        // 基本的な照明計算
        vec3 lightDir = normalize(lightPosition - vPosition);
        vec3 normal = normalize(vNormal);
        float diff = max(dot(normal, lightDir), 0.0);
        vec3 diffuse = lightColor * diff;

        // リムライティング
        vec3 viewDir = normalize(cameraPosition - vPosition);
        float rimFactor = 1.0 - max(dot(viewDir, normal), 0.0);
        vec3 rim = vec3(1.0, 0.5, 0.8) * pow(rimFactor, .0) * glowStrength;

        // 時間に基づく動的な効果
        float dynamicEffect = sin( 0.5 + vUv.x * 10.0) * 0.5 + 0.5;
        
        // ノイズを追加
        float noiseValue = noise(vUv * 10.0 + time * 0.1);
        
        // マウス位置に基づく効果
        float mouseEffect = smoothstep(0.0, 0.5, distance(vUv, mouse));
        
        // 最終的な色の計算
        vec3 finalColor = mix(baseColor, vColor.rgb, dynamicEffect);
        finalColor += vec3(noiseValue * 0.1);
        finalColor *= mouseEffect;
        
        // 照明効果を適用
        finalColor = finalColor * (diffuse + 0.5) + rim;  // 0.3はアンビエント光

        // 輝度効果
        float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));
        vec3 glow = vec3(1.0, 0.7, 0.3) * pow(luminance, 2.0);
        
        // 最終出力
        gl_FragColor = vec4(finalColor + glow * 0.5, 1.0);
            }
`,
			uniforms: {
				mouse: { value: new THREE.Vector2() },
				time: { value: 0 },
				cameraPosition: { value: this.camera.position },
				lightPosition: { value: new THREE.Vector3(5, 5, 5) },
				lightColor: { value: new THREE.Color(1, 1, 1) },
				intensity: { value: 1.0 },
				baseColor: { value: new THREE.Color(0.8, 0.8, 0.3) },
				glowStrength: { value: 1.0 },
			},
		});
		this.particleMeshes = [];
		this.particleMeshes2 = [];

		const particleCount = 10;
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
			const radius = 300;
			const radius2 = 100;

			particleMesh.position.set(
				radius * Math.sin(phi) * Math.cos(theta),
				radius * Math.sin(phi) * Math.sin(theta),
				radius * Math.cos(phi),
			);

			particleMesh2.position.set(
				radius2 * Math.sin(phi) * Math.cos(theta),
				radius2 * Math.sin(phi) * Math.sin(theta),
				radius2 * Math.cos(phi),
			);

			this.particles.add(particleMesh);
			this.particleMeshes.push(particleMesh);
			/* this.particles.add(particleMesh2);
            this.particleMeshes2.push(particleMesh2); */
		}
	}

	public getMesh(): THREE.Group {
		return this.particles;
	}
	public setMousePosition(x: number, y: number) {
		this.particleMaterial.uniforms.mouse.value.set(x, y);
	}
	public updateTime(time: number) {
		this.particleMaterial.uniforms.time.value = time;
	}
	public update(deltaTime: number) {
		//this.particles.rotation.y += deltaTime * 0.1;
		/* this.particleMeshes.forEach((mesh, index) => {
            mesh.position.x += Math.sin(deltaTime + index) * 0.1;
            mesh.position.y += Math.cos(deltaTime + index) * 0.1;
            mesh.position.z += Math.sin(deltaTime + index) * 0.1;
        });
        this.particleMeshes2.forEach((mesh, index) => {
            mesh.position.x += Math.sin(deltaTime + index) * 0.5;
            mesh.position.y += Math.cos(deltaTime + index) * 0.5;
            mesh.position.z += Math.sin(deltaTime + index) * 0.5;
        }); */
	}
}

export default Virus;
