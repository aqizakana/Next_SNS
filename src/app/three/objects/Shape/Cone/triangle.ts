import * as three from "three";

export class RoundedCone {
	private geometry: three.ConeGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;

	constructor(charCount: number, material: three.ShaderMaterial) {
		const height = charCount * 2;

		// ConeGeometryを作成
		this.geometry = new three.ConeGeometry(32, height, 32);

		this.material = material;
		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}

	public update() {
		this.material.uniforms.u_time.value += 0.01;
	}
}
