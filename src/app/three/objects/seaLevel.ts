import * as three from "three";
import waveFragment from "../../glsl/waveFragment.glsl";
import waveVertex from "../../glsl/waveVertex.glsl";

export class Wave {
	private geometry: three.BufferGeometry;
	private material: three.ShaderMaterial;
	private particles: three.Points = new three.Points();
	private count = 0.0;
	private light: three.DirectionalLight;

	constructor() {
		this.geometry = new three.BufferGeometry();
		this.material = new three.ShaderMaterial({
			vertexShader: waveVertex,
			fragmentShader: waveFragment,
			uniforms: {
				color: { value: new three.Color(0xafffff) },
				u_time: { value: 0.0 },
				size: { value: 8.0 },
			},
		});

		this.light = new three.DirectionalLight(0xffffff, 1);
		this.generateWave();
	}

	private generateWave() {
		const separation = 20;
		const amountx = 400;
		const amounty = 400;
		const numParticles = amountx * amounty;
		const positions = new Float32Array(numParticles * 3);

		let i = 0;
		for (let ix = 0; ix < amountx; ix++) {
			for (let iy = 0; iy < amounty; iy++) {
				positions[i] = ix * separation - (amountx * separation) / 2; // x
				positions[i + 1] = 0.0; // y
				positions[i + 2] = iy * separation - (amounty * separation) / 2; // z
				i += 3;
			}
		}

		this.geometry.setAttribute(
			"position",
			new three.BufferAttribute(positions, 3),
		);
		this.particles = new three.Points(this.geometry, this.material);
		this.particles.position.y = 200;
	}

	public generateLight() {
		this.light.position.set(0, 400, 0);
		this.light.target.position.set(0, 0, 0);
		return this.light;
	}

	public updateWave() {
		// GLSL内での時間更新
		this.count += 0.01;
		this.material.uniforms.u_time.value = this.count;
	}

	public getMesh() {
		return this.particles;
	}
}
