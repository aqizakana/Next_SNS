import * as three from "three";

export class Box {
	private geometry: three.BoxGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	constructor(charCount: number, material: three.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new three.BoxGeometry(charCount, charCount, charCount);

		this.material = material;
		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
}
