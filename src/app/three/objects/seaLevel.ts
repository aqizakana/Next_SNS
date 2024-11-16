import * as THREE from "three";
import waveFragment from "../../glsl/waveFragment.glsl";
import waveVertex from "../../glsl/waveVertex.glsl";

export class Wave {
	private geometry: THREE.BufferGeometry;
	private material: THREE.ShaderMaterial;
	private particles: THREE.Points = new THREE.Points();
	private count = 0.0;
	private light: THREE.DirectionalLight;

	constructor() {
		this.geometry = new THREE.BufferGeometry();
		this.material = new THREE.ShaderMaterial({
			vertexShader: waveVertex,
			fragmentShader: waveFragment,
			uniforms: {
				color: { value: new THREE.Color(0xafffff) },
				u_time: { value: 0.0 },
				size: { value: 5.0 },
			},
		});

		this.light = new THREE.DirectionalLight(0xffffff, 1);
		this.generateWave();
	}

	private generateWave() {
		const SEPARATION = 20;
		const AMOUNTX = 300;
		const AMOUNTY = 300;
		const numParticles = AMOUNTX * AMOUNTY;
		const positions = new Float32Array(numParticles * 3);

		let i = 0;
		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
				positions[i + 1] = 0.0; // y
				positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z
				i += 3;
			}
		}

		this.geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);
		this.particles = new THREE.Points(this.geometry, this.material);
		this.particles.position.y = 100;
	}

	public generateLight() {
		this.light.position.set(0, 300, 0);
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
