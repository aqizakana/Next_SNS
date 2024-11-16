import * as THREE from "three";

export class Knot {
	private geometry: THREE.TorusKnotGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	constructor(charCount: number, material: THREE.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new THREE.TorusKnotGeometry(
			charCount / 2.0,
			charCount / 10.0,
			charCount,
			64,
		);

		this.material = material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
}
