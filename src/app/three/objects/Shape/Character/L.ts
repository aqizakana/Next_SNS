import * as THREE from "three";
import * as BufferGeometryUtils from "three/addons/utils/BufferGeometryUtils.js";
import { Cylinder } from "../Cylinder/Cylinder";

export class L {
	private mesh: THREE.Mesh;

	constructor(charCount: number, material: THREE.ShaderMaterial) {
		// 必要なシリンダージオメトリを設定し、二つの異なる位置と回転を指定
		const geometry1 = this.createCylinderGeometry(
			charCount,
			material,
			-charCount * 0.8,
			0,
			0,
			0,
		);
		const geometry2 = this.createCylinderGeometry(
			charCount,
			material,
			-charCount * 1.0,
			0,
			0,
			Math.PI / 2,
		);

		// ジオメトリをマージし、単一のメッシュとして作成
		const combinedGeometry = BufferGeometryUtils.mergeGeometries([
			geometry1,
			geometry2,
		]);
		this.mesh = new THREE.Mesh(combinedGeometry, material);
	}

	// 単一のジオメトリ作成メソッド
	private createCylinderGeometry(
		charCount: number,
		material: THREE.ShaderMaterial,
		x: number,
		y: number,
		z: number,
		rotationZ: number,
	): THREE.BufferGeometry {
		const cylinder = new Cylinder(charCount, material);
		const geometry = cylinder.getMesh().geometry.clone(); // clone to avoid modifying the original

		// 各ジオメトリに対して位置と回転を設定
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
