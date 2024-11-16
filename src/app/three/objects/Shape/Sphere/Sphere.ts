import * as THREE from "three";
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

export class Spehre {
	private geometry: THREE.SphereGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	constructor(charCount: number, material: THREE.ShaderMaterial) {
		//感情ラベルナンバーなので、使わない。
		this.geometry = new THREE.SphereGeometry(
			charCount / 2.0,
			charCount / 2.0,
			charCount / 2.0,
		);

		this.material = material;
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
	public update(deltaTime: number) {}
}
