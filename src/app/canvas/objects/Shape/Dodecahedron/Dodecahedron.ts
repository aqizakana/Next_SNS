import * as THREE from "three";

export class Dodecahedron {
	private geometry: THREE.DodecahedronGeometry;
	private material: THREE.ShaderMaterial | THREE.MeshBasicMaterial;
	private mesh: THREE.Mesh;
	constructor(
		charCount: number,
		material: THREE.ShaderMaterial | THREE.MeshBasicMaterial,
	) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new THREE.DodecahedronGeometry(charCount / 2);

		this.material = material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
	public dispose() {
		this.geometry.dispose();
		this.material.dispose();
		this.getMesh().remove();
	}
	public backSideRender() {
		this.material.side = THREE.BackSide;
	}
}
