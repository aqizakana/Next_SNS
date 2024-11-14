import * as THREE from "three";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

export class Circle {
	private radius: number;
	private geometry: THREE.TorusGeometry;
	//private material: THREE.MeshBasicMaterial;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	public update(): void {
		this.material.uniforms.u_time.value += 0.01;

	}

	constructor(radius: number) {
		this.radius = radius;

		this.geometry = new THREE.TorusGeometry(this.radius, this.radius / 80.0, 10, 50);
		//this.material = new THREE.MeshBasicMaterial({ color: 0x00ffff });

		this.material = new THREE.ShaderMaterial({
			vertexShader: `
				precision mediump float;
				varying vec2 vUv;
				uniform float u_time;
				void main() {
					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
			`,
			fragmentShader: `
				precision mediump float;
				varying vec2 vUv;
				uniform vec2 mouse; 
				uniform float u_time;
				void main() {
					vec2 gradient = vUv;

					vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
					vec3 color = vec3(gradient.x,gradient.y,1.0);
					float noise = sin(vUv.x * 10.0 + u_time) * sin(vUv.y * 10.0 + u_time) * 0.5 + 0.5;
					vec3 newColor = mix(color,vec3(0.2,0.8,1.0),noise);
					gl_FragColor = vec4(newColor,1.0);
				}
			`,
			uniforms: {
				u_time: { value: 0.0 },
			},
			// 他の必要なユニフォームやプロパティを追加
		});

		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.update();
	}
	public getMesh(): THREE.Mesh {
		return this.mesh;
	}

}
