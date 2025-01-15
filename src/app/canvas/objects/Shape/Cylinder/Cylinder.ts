import * as three from "three";

export class Cylinder {
	private geometry: three.CylinderGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;

	constructor(charCount: number, material: three.ShaderMaterial) {
		this.geometry = new three.CylinderGeometry(
			charCount / 6,
			charCount / 6,
			charCount * 2,
			charCount / 2,
			charCount / 2,
		);
		const vertexIndices = new Float32Array(
			this.geometry.attributes.position.count,
		);
		this.geometry.setAttribute(
			"vertexIndex",
			new three.BufferAttribute(vertexIndices, 1),
		);
		this.geometry.computeBoundingSphere(); // NaNエラー回避のために追加

		this.material = material;
		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}

	public update(deltaTime: number) {
		this.material.uniforms.u_time.value += 0.01;
	}
}

export default Cylinder;
