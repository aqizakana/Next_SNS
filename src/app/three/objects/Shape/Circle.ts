import * as three from "three";

export class Circle {
	private radius: number;
	private geometry: three.TorusGeometry;
	//private material: THREE.MeshBasicMaterial;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	private mouse: three.Vector2 = new three.Vector2(0.0, 0.0);
	public update(newObjectPos: three.Vector3): void {
		this.material.uniforms.u_time.value += 0.01;
		this.getMesh().position.set(newObjectPos.x, newObjectPos.y, newObjectPos.z);
		this.getMesh().rotation.x += 0.001;
		this.getMesh().rotation.y += 0.001;
		this.getMesh().rotation.z += 0.001;
	}

	constructor(radius: number, Pos: three.Vector3) {
		this.radius = radius;

		this.geometry = new three.TorusGeometry(
			this.radius,
			this.radius / 20.0,
			10,
			50,
		);
		//this.material = new THREE.MeshBasicMaterial({ color: 0x00ffff });

		this.material = new three.ShaderMaterial({
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
				
				uniform float u_time;
				void main() {
					vec2 gradient = vUv;

					vec3 color = vec3(gradient.x,gradient.y,1.0);
					float noise = sin(vUv.x * 10.0 + u_time) * sin(vUv.y * 10.0 + u_time) * 0.5 + 0.5;
					vec3 newColor = mix(color,vec3(0.2,0.8,1.0),noise);
					gl_FragColor = vec4(newColor,0.5);
				}
			`,
			uniforms: {
				u_time: { value: 0.0 },
			},
			// 他の必要なユニフォームやプロパティを追加
		});

		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}
}
