import * as THREE from 'three';
import { Cylinder } from '../Cylinder/Cylinder';
import type { objectProps } from '../type';

export class CrossCylinder {
    private group: THREE.Group;
    private cylinders: [Cylinder, Cylinder];

    constructor({
        content,
        created_at,
        charCount,
        position,
        vertexShader,
        fragmentShader,
        analyze_8labels_result,
        koh_sentiment_label_number,
        koh_sentiment_score,
    }: objectProps) {
        // 円柱のサイズやセグメント数を定義
        const radius = charCount;
        const height = charCount;
        const segments = charCount;

        // nounNumberを元に高さ調整
        const heightNonNumber = koh_sentiment_label_number + 1.0;

        // Cylinderのプロパティを作成
        const cylinderProps: objectProps = {
            content,
            created_at,
            charCount,
            position,
            vertexShader,
            fragmentShader,
            analyze_8labels_result,
            koh_sentiment_label_number,
            koh_sentiment_score,
        };

        // 2つのCylinderを生成
        const cylinder1 = new Cylinder(cylinderProps);
        const cylinder2 = new Cylinder(cylinderProps);

        // Cylinder1の位置と回転を設定
        cylinder1.getMesh().position.set(0, -height / heightNonNumber, 0);
        cylinder1.getMesh().rotation.z = Math.PI / 2;  // X軸方向に90度回転

        // Cylinder2の位置と回転を設定
        cylinder2.getMesh().position.set(0, height / heightNonNumber, 0);
        cylinder2.getMesh().rotation.x = Math.PI / 2;  // Y軸方向に90度回転

        // グループにCylinderを追加
        this.group = new THREE.Group();
        this.group.add(cylinder1.getMesh());
        this.group.add(cylinder2.getMesh());

        // Cylinder配列に保存
        this.cylinders = [cylinder1, cylinder2];

        // 初期位置を設定
        if (position) {
            this.group.position.set(position.x, position.y, position.z);
        }
    }

    // グループを返すメソッド
    public getMesh(): THREE.Group {
        return this.group;
    }

    // アニメーションや更新用のメソッド
    public update(deltaTime: number) {
        this.cylinders.forEach(cylinder => cylinder.update(deltaTime));
    }
}
