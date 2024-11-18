import * as three from "three";

export class Icosahedron {
	private geometry: three.IcosahedronGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	constructor(charCount: number, material: three.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new three.IcosahedronGeometry(charCount / 2.0, 5);

		this.material = material;
		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
}
