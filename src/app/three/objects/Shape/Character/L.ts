import * as THREE from "three";
import { Cylinder } from "../Cylinder/Cylinder";
import type { objectProps } from "../type";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

export class L {
    private mesh: THREE.Mesh;

    constructor(
        charCount: number,
        material: THREE.ShaderMaterial,
    ) {


        const cylinder1 = new Cylinder(charCount, material);
        const cylinder2 = new Cylinder(charCount, material);

        // cylinder1の位置と回転を設定
        cylinder1.getMesh().geometry.translate(-charCount * 0.8, 0, 0);
        cylinder1.getMesh().geometry.rotateZ(0);

        // cylinder2の位置と回転を設定
        cylinder2.getMesh().geometry.translate(-charCount * 1.0, 0, 0);
        cylinder2.getMesh().geometry.rotateZ(Math.PI / 2);

        const combinedGeometry = BufferGeometryUtils.mergeGeometries([cylinder1.getMesh().geometry, cylinder2.getMesh().geometry]);

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
