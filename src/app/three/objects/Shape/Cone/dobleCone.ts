import * as THREE from "three";
import { Triangle } from "./Triangle"; // 名前を大文字に変更し、一貫性を保ちます
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export class DoubleCone {
	private mesh: THREE.Mesh;

	constructor(charCount: number, material: THREE.ShaderMaterial) {
		// 二つのTriangleのジオメトリを結合するための BufferGeometry を作成


		const cone1 = new Triangle(charCount, material);
		const cone2 = new Triangle(charCount, material);

		// cone1の位置と回転を設定
		cone1.getMesh().geometry.translate(0, charCount, 0);
		cone1.getMesh().geometry.rotateZ(0);

		// cone2の位置と回転を設定
		cone2.getMesh().geometry.translate(0, charCount, 0);
		cone2.getMesh().geometry.rotateZ(Math.PI);

		// ジオメトリを結合
		const combinedGeometry = BufferGeometryUtils.mergeGeometries([cone1.getMesh().geometry, cone2.getMesh().geometry]);

		// 結合されたジオメトリから Mesh を作成
		this.mesh = new THREE.Mesh(combinedGeometry, material);
	}

	// 結合された Mesh を取得
	public getMesh(): THREE.Mesh {
		return this.mesh;
	}

	// update メソッドは不要になるか、あるいは全体に適用したい更新をここに記述
	public update() {
		// 必要に応じて、全体に適用するアニメーションや処理をここに追加
	}
}
