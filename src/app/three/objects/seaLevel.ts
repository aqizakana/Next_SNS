import * as THREE from "three";
import waveVertex from "../../glsl/waveVertex.glsl";
import waveFragment from "../../glsl/waveFragment.glsl";

export class Wave {
	private geometry: THREE.BufferGeometry;
	private material: THREE.ShaderMaterial;
	private particles: THREE.Points = new THREE.Points();
	private count = 0.0;
	private light: THREE.DirectionalLight = new THREE.DirectionalLight(
		0xffffff,
		1,
	);

	constructor() {
		this.geometry = new THREE.BufferGeometry();
		this.material = new THREE.ShaderMaterial({
			vertexShader: waveVertex,
			fragmentShader: waveFragment,
			uniforms: {
				color: { value: new THREE.Color(0xafffff) },
				u_time: { value: 0.0 }, // サイズを変更したい値にセット
			},
		});
	}

	private generateWave() {
		const SEPARATION = 5,
			AMOUNTX = 400,
			AMOUNTY = 200;
		const numParticles = AMOUNTX * AMOUNTY;
		const positions = new Float32Array(numParticles * 3);
		const scales = new Float32Array(numParticles);

		let i = 0,
			j = 0;

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2; // x
				positions[i + 1] = 0.0; // y
				positions[i + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2; // z

				scales[j] = 1;

				i += 3;
				j++;
			}
		}
		this.geometry.setAttribute(
			"position",
			new THREE.BufferAttribute(positions, 3),
		);
		this.geometry.setAttribute("scale", new THREE.BufferAttribute(scales, 1));
		this.particles = new THREE.Points(this.geometry, this.material);
		this.particles.position.set(0, 100, 0);
	}

	public generateLight() {
		this.light.position.set(0, 100, 0);
		this.light.target.position.set(0, 0, 0);
		return this.light;
	}

	public updateWave() {
		const AMOUNTX = 400,
			AMOUNTY = 200;
		const positions = this.particles.geometry.attributes.position.array;
		const scales = this.particles.geometry.attributes.scale.array;

		let i = 0,
			j = 0;

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				positions[i + 1] =
					Math.cos((ix + this.count) * 0.3 + Math.random() * 0.01) * 10.0 +
					Math.sin((iy + this.count) * 0.1) * 10;

				scales[j] =
					(Math.sin((ix + this.count) * 0.3) + 1) * 20 +
					(Math.sin((iy + this.count) * 0.5) + 1) * 20 * Math.random();

				i += 3;
				j++;
			}
		}

		this.particles.geometry.attributes.position.needsUpdate = true;
		this.particles.geometry.attributes.scale.needsUpdate = true;
		//this.material.uniforms.size.value = 100 + Math.sin(this.count) * 10;
		this.count += 0.05;
		this.material.uniforms.u_time.value += 0.01;
		this.light = this.generateLight();
	}

	public getMesh() {
		this.generateWave();
		return this.particles;
	}
}
