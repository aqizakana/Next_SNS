import * as THREE from "three";

export class Circle {
	private radius: number;
	private geometry: THREE.TorusGeometry;
	//private material: THREE.MeshBasicMaterial;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	public update(newObject_pos: THREE.Vector3): void {
		this.material.uniforms.u_time.value += 0.01;
		this.getMesh().position.copy(newObject_pos);
		this.getMesh().rotation.x += 0.001;
		this.getMesh().rotation.y += 0.001;
		this.getMesh().rotation.z += 0.001;
	}

	constructor(radius: number, Pos: THREE.Vector3) {
		this.radius = radius;

		this.geometry = new THREE.TorusGeometry(
			this.radius,
			this.radius / 80.0,
			10,
			50,
		);
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
		this.update(Pos);
	}
	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
}
