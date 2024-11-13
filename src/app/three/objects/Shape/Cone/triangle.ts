import * as THREE from "three";

export class Triangle {
	private geometry: THREE.ConeGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;

	constructor(charCount: number, material: THREE.ShaderMaterial) {
		this.geometry = new THREE.ConeGeometry(32, charCount * 2, 32);
		this.material = material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}

	public update() {
		this.material.uniforms.u_time.value += 0.01;
	}
}