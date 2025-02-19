import * as three from "three";

export class Circle {
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	private PosNegNumber?: number;
	private _8_Label?: number;
	private Score?: number;
	public content = "";
	public createdAt: Date = new Date();
	public username = "";
	public user_id = 0;
	public ID = 0;
	public charCountResult = 0;
	private radius: number;
	private geometry: three.TorusGeometry;
	private randomNumber = Math.random() * 2 - 1;

	public update(newObjectPos: three.Vector3): void {
		this.material.uniforms.u_time.value += 0.01;

		this.mesh.rotation.x +=
			this.randomNumber *
			0.001 *
			Math.sin(this.material.uniforms.u_time.value * 0.005);
		this.mesh.rotation.y +=
			this.randomNumber *
			0.001 *
			Math.cos(this.material.uniforms.u_time.value * 0.005);
		this.mesh.rotation.z +=
			this.randomNumber *
			0.001 *
			Math.sin(this.material.uniforms.u_time.value * 0.005);

		if (this.mesh.position.y > 500) {
			this.material.dispose();
			this.mesh.geometry.dispose(); //ジオメトリを破棄
			if (this.mesh.parent) {
				// 親オブジェクトから削除
				this.mesh.parent.remove(this.mesh);
			}
		}
	}

	constructor(radius: number, Pos: three.Vector3) {
		this.radius = radius;

		this.geometry = new three.TorusGeometry(
			this.radius,
			this.radius / 100.0,
			10,
			50,
		);

		this.material = new three.RawShaderMaterial({
			glslVersion: three.GLSL3,
			vertexShader: `
				precision mediump float;
				in vec2 uv;
				in vec3 position;
				out vec2 vUv;

				uniform mat4 modelViewMatrix;
				uniform mat4 projectionMatrix;
				uniform float u_time;
				uniform vec2 u_resolution;
				

				void main() {
					vec3 newPosition = position;

					vUv = uv;
					vec2 center = vec2(0.5,0.5);
					vec2 delta = uv - center;
					float len = length(delta);
					float angle = atan(delta.y,delta.x);

					vec3 rotateUV = vec3(
						cos(angle * u_time) * len * 0.01,
						sin(angle * u_time) * len * 0.01,
						cos(angle * u_time) * len * sin(angle * u_time) * 0.01
					);

					newPosition += newPosition * rotateUV * 0.1;

					gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
				}
			`,
			fragmentShader: `
				precision mediump float;
				in vec2 vUv;
			
				uniform bool u_later;
				uniform float u_time;
				uniform vec2 u_resolution;

				out vec4 fragColor;
				void main() {
					vec2 gradient = vUv;
					vec2 Coord = 2.0 * gl_FragCoord.xy / u_resolution.xy;

					vec3 color = vec3(gradient.x,gradient.y,1.0);
					float noise = fract(sin(vUv.x * 10.0 + u_time / 10.0) * sin(vUv.y * 10.0 + u_time / 10.0 ));
					
					vec3 newColor;

					if(u_later == true){
						newColor = mix(color,vec3(1.0, 0.0,0.0),noise);
					}else{
						newColor = mix(color,vec3(0.4,Coord),noise);
					}

					fragColor = vec4(newColor,0.5);
				}
			`,
			uniforms: {
				u_later: { value: false },
				u_time: { value: 0.0 },
				u_resolution: {
					value: new three.Vector2(window.innerWidth, window.innerHeight),
				},
			},
			// 他の必要なユニフォームやプロパティを追加
		});

		this.mesh = new three.Mesh(this.geometry, this.material);
		this.mesh.position.set(Pos.x, Pos.y, Pos.z);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}

	public getMaterial(u_later: boolean): three.ShaderMaterial {
		this.material.uniforms.u_later.value = u_later;
		return this.material;
	}

	public returnCreatedAt(objDate: Date): Date {
		return objDate;
	}
}
