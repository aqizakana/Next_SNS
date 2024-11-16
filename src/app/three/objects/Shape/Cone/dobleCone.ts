import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { Triangle } from "./Triangle"; // 名前を大文字に変更し、一貫性を保ちます

export class DoubleCone {
	private mesh: THREE.Mesh;

	constructor(charCount: number, material: THREE.ShaderMaterial) {
		const geometry1 = this.createTransformedGeometry(
			charCount,
			material,
			0,
			charCount,
			0,
			0,
		);
		const geometry2 = this.createTransformedGeometry(
			charCount,
			material,
			0,
			charCount,
			0,
			Math.PI,
		);

		// 二つのジオメトリを結合し、単一のメッシュを作成
		const combinedGeometry = BufferGeometryUtils.mergeGeometries([
			geometry1,
			geometry2,
		]);
		this.mesh = new THREE.Mesh(combinedGeometry, material);
	}

	private createTransformedGeometry(
		charCount: number,
		material: THREE.ShaderMaterial,
		x: number,
		y: number,
		z: number,
		rotationZ: number,
	): THREE.BufferGeometry {
		const triangle = new Triangle(charCount, material);
		const geometry = triangle.getMesh().geometry.clone(); // clone to avoid modifying the original

		// ジオメトリに位置と回転を適用
		geometry.translate(x, y, z);
		geometry.rotateZ(rotationZ);

		return geometry;
	}

	// 結合された Mesh を取得
	public getMesh(): THREE.Mesh {
		return this.mesh;
	}

	// update メソッドは今後のアニメーションやその他の変更のためのプレースホルダ
	public update() {
		// 必要なアニメーションや処理を追加
	}
}
