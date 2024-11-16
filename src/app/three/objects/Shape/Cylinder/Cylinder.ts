import * as THREE from "three";

export class Cylinder {
	private geometry: THREE.CylinderGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;

	constructor(charCount: number, material: THREE.ShaderMaterial) {
		this.geometry = new THREE.CylinderGeometry(
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
			new THREE.BufferAttribute(vertexIndices, 1),
		);
		this.geometry.computeBoundingSphere(); // NaNエラー回避のために追加

		this.material = material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}

	public update(deltaTime: number) {
		this.material.uniforms.u_time.value += 0.01;
	}
}

export default Cylinder;
