import * as three from "three";

export class Plate {
	private geometry: three.PlaneGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	private count = 0.0;
	constructor(width: number, height: number, material: three.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new three.PlaneGeometry(width, height, 50);
		this.material = material;
		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}
	public update(camera: three.PerspectiveCamera) {
		// GLSL内での時間更新
		this.count += 0.01;
		this.material.uniforms.u_time.value = this.count;
		if (this.mesh.parent) {
			if (camera) {
				this.mesh.lookAt(camera.position);
			}
		}
	}
	public dispose() {
		this.geometry.dispose();
		this.material.dispose();
		this.getMesh().remove();
	}
}
