import * as THREE from "three";

export class Icosahedron {
	private geometry: THREE.IcosahedronGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	constructor(charCount: number, material: THREE.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new THREE.IcosahedronGeometry(charCount / 2.0, 5);

		this.material = material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
}
