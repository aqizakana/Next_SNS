import * as three from "three";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

export class Spehre {
	private geometry: three.SphereGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	constructor(charCount: number, material: three.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new three.SphereGeometry(
			charCount / 2.0,
			charCount / 2.0,
			charCount / 2.0,
		);

		this.material = material;
		this.mesh = new three.Mesh(this.geometry, this.material);
	}

	public getMesh(): three.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
}
