import * as THREE from "three";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();

export class Particles {
	private size: number;
	private length: number;
	private position: THREE.Vector3;
	private geometry: THREE.BufferGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Points;
	private rotation: THREE.Euler; // Add rotation property

	constructor() {
		// ランダムな位置とサイズを生成
		this.size = Math.random() * 20 + 5; // サイズを5から25の範囲でランダムに設定
		this.length = 1000; // 長さを1000に設定
		this.position = new THREE.Vector3(
			Math.random() * 2000 - 500, // X座標を-100から100の範囲でランダムに設定
			Math.random() * 2000 - 500, // Y座標を-100から100の範囲でランダムに設定
			Math.random() * 2000 - 500, // Z座標を-100から100の範囲でランダムに設定
		);
		this.rotation = new THREE.Euler(); // Initialize rotation

		this.geometry = new THREE.BufferGeometry();
		const vertices = [];
		for (let i = 0; i < 1000; i++) {
			const x = Math.random() * 2000 - 1000; // X座標を-1000から1000の範囲でランダムに設定
			const y = Math.random() * 2000 - 1000; // Y座標を-1000から1000の範囲でランダムに設定
			const z = Math.random() * 2000 - 1000; // Z座標を-1000から1000の範囲でランダムに設定
			vertices.push(x, y, z);
		}
		this.geometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(vertices, 3),
		);

		// ShaderMaterialを使用してシェーダーを適用
		this.material = new THREE.ShaderMaterial({
			vertexShader: `
                uniform float time;
                varying vec3 vPosition;
                varying float vNoise;
                float random(vec3 scale, float seed) {
                    return fract(sin(dot(scale + seed, scale + seed)) * 43758.5453 + seed);
                }
                void main() {
                    vPosition = position;
                    float noise = sin(position.z * 0.1 + time * 2.0) * 0.5;
                    vec3 newPosition = position + normal * noise;
                    vNoise = noise;
                    float dynamicValue = sin(time / 10.0) * 0.5 + 0.5;

                    gl_PointSize = 10.0;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0)* dynamicValue;
                }
            `,
			fragmentShader: `
                uniform float time;
                varying vec3 vPosition;
                varying float vNoise;
                void main() {
                    float dynamicValue = sin(time / 10000.0) * 0.5 + 0.5;
                    vec3 color = vec3(1.0, 0.5, 0.5); // 白色に設定
                    gl_FragColor = vec4(color,0.5);
                }
            `,
			uniforms: {
				time: { value: 0.0 },
			},
		});

		this.mesh = new THREE.Points(this.geometry, this.material);
	}

	public addToScene(scene: THREE.Scene) {
		scene.add(this.mesh);
	}

	public update(deltaTime: number) {
		this.material.uniforms.time.value += deltaTime;
	}
}
