import * as THREE from "three";
import fragment from "../../../glsl/fragment.glsl";
import vertex from "../../../glsl/vertex.glsl";
import type { PsqlProps, postedProps } from "../../type";

import { Knot } from "./Knot/Knot";
import { Box } from "./Box/Box";
import { L } from "./Character/L";
import { DoubleCone } from "./Cone/dobleCone";
import { Capsule } from "./Capsule/Capsule";
import { Cone } from "./Cone/Cone";
import { Sphere } from "./Sphere/Sphere";
import { Dodecahedron } from "./Dodecahedron/Dodecahedron";
import { Plus } from "./Character/plus";
import { Cylinder } from "./Cylinder/Cylinder";

const materialType = (
	koheiduckScore: number,
	koheiduckNumber: number,
	__8labelLabel: number,
	user_id: number,
	ID: number,
	charCountResult: number,
): THREE.ShaderMaterial => {
	return new THREE.ShaderMaterial({
		glslVersion: THREE.GLSL3,
		vertexShader: vertex,
		fragmentShader: fragment,
		uniforms: {
			u_time: { value: 0.0 },
			u_colorWithScore: { value: koheiduckScore },
			u_PosNegNumber: { value: koheiduckNumber },
			u_mouse: { value: new THREE.Vector2() },
			u_opacity: { value: 1.0 },
			u_8label: { value: __8labelLabel },
			u_height: { value: charCountResult * 2 },
			u_userID: { value: user_id },
			u_ID: { value: ID },
			u_cameraPos: { value: new THREE.Vector3(0.0, 0.0, 700.0) },
			u_charCount: { value: charCountResult },
			u_resolution: {
				value: new THREE.Vector2(window.innerWidth, window.innerHeight),
			},
		},
	});
};

interface MeshClassInterface {
	getMesh(): THREE.Mesh;
}
const MeshClasses = [
	Sphere,
	Cone,
	Cylinder,
	Cylinder,
	DoubleCone,
	L,
	Dodecahedron,
	Capsule,
];
const meshType = (
	bertNumber: number,
	charCountResult: number,
	material: THREE.ShaderMaterial,
): MeshClassInterface => {
	const index = Math.min(bertNumber, MeshClasses.length - 1);
	const MeshClass = MeshClasses[index];
	return new MeshClass(charCountResult, material);
};

// 型ガード関数
function isPsqlProps(props: postedProps | PsqlProps): props is PsqlProps {
	return "analyze8labelsResult" in props;
}

export class Prototypes {
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	private initialX: number;
	private initialY: number;
	private initialZ: number;
	private PosNegNumber: number;
	private _8_Label: number;
	private Score: number;
	public content = "";
	public createdAt: Date = new Date();
	public username = "";
	public user_id = 0;
	public ID = 0;
	public charCountResult = 0;
	public meshHeight = 0;
	public randomDirection = 0;

	constructor(props: postedProps | PsqlProps) {
		if (isPsqlProps(props)) {
			this.PosNegNumber = Prototypes.getBertLabelFromSentiment(
				props.koheiduckSentimentLabel,
			);

			this._8_Label = Prototypes.getSentimentLabelNumber(
				props.analyze8labelsResult.sentiment,
			);
		} else {
			this.PosNegNumber = props.koheiduckSentimentLabel;
			//console.log("PosNegNumber", this.PosNegNumber);
			this._8_Label = props.bertLabel;
		}

		this.Score = props.koheiduckSentimentScore;
		this.content = props.content;
		this.createdAt = props.createdAt;
		this.username = props.username;
		this.user_id = props.user_id;
		this.ID = props.ID;
		this.charCountResult = props.charCountResult;

		this.material = materialType(
			this.Score,
			this.PosNegNumber,
			this._8_Label,
			this.user_id,
			this.ID,
			this.charCountResult * 2,
		);

		this.mesh = meshType(
			this._8_Label,
			this.charCountResult * 2,
			this.material,
		).getMesh();

		this.mesh.position.set(
			props.position.x,
			props.position.y,
			props.position.z,
		);

		const vertexIndices = new Float32Array(
			this.mesh.geometry.attributes.position.count,
		);
		for (let i = 0; i < vertexIndices.length; i++) {
			vertexIndices[i] = i;
		}
		this.mesh.geometry.setAttribute(
			"vertexIndex",
			new THREE.BufferAttribute(vertexIndices, 1),
		);
		this.initialX = this.mesh.position.x;
		this.initialY = this.mesh.position.y;
		this.initialZ = this.mesh.position.z;

		this.mesh.geometry.computeBoundingBox();
		const boundingBox = this.mesh.geometry.boundingBox;
		if (boundingBox) {
			this.meshHeight = boundingBox.max.y - boundingBox.min.y;
		}

		this.randomDirection = Math.random() < 0.5 ? -1 : 1;
		this.mesh.geometry.setAttribute(
			"normal",
			new THREE.BufferAttribute(
				new Float32Array(this.mesh.geometry.attributes.position.count * 3),
				3,
			),
		);
	}

	private static getSentimentLabelNumber(label: string): number {
		const labelMap: { [key: string]: number } = {
			"joy、うれしい": 0.0,
			"trust、信頼": 1.0,
			"anticipation、期待": 2.0,
			"surprise、驚き": 3.0,
			"sadness、悲しい": 4.0,
			"anger、怒り": 5.0,
			"fear、恐れ": 6.0,
			"disgust、嫌悪": 7.0,
		};
		//console.log(labelMap[label] || 8.0);
		return labelMap[label] || 8.0;
	}

	private static getBertLabelFromSentiment(sentiment: string): number {
		// センチメントからBERTラベルを取得するロジック（例）
		const sentimentMap: { [key: string]: number } = {
			NEGATIVE: 2.0,
			NEUTRAL: 1.0,
			POSITIVE: 0.0,

			// 他のセンチメントも必要に応じて追加
		};
		return sentimentMap[sentiment] || 0;
	}

	public getMesh(): THREE.Object3D {
		return this.mesh;
	}

	private easeInQuint(x: number): number {
		return x * x * x * x * x;
	}

	public update(): void {
		this.material.uniforms.u_colorWithScore.value = this.Score;
		this.material.uniforms.u_PosNegNumber.value = this.PosNegNumber;
		this.material.uniforms.u_8label.value = this._8_Label;
		this.material.uniforms.u_height.value = this.charCountResult * 2;
		this.material.uniforms.u_userID.value = this.user_id;
		this.material.uniforms.u_ID.value = this.ID;

		// 時間を更新
		this.material.uniforms.u_time.value += 0.005; // 時間の進行速度
		const time = this.material.uniforms.u_time.value;

		// 揺れのパラメータ
		const amplitude = 5; // 揺れの幅（原点から上下に移動する距離）

		// 揺れの計算
		const sinWave = Math.sin(time * 0.1); // -1 から 1 の間で周期的に変化
		const cosWave = Math.cos(time * 0.1); // -1 から 1 の間で周期的に変化
		const offsetY = sinWave * amplitude; // 揺れの幅を適用
		const offsetX = 3.0 * cosWave * amplitude; // 揺れの幅を適用

		// メッシュの位置を更新
		this.mesh.position.x = this.initialX + offsetX * this.randomDirection; // X軸の位置を更新
		this.mesh.position.y = this.initialY + offsetY; // Y軸の位置を更新
		//this.mesh.position.z = this.initialZ + offsetY * this.randomDirection; // X軸の位置を更新

		if (this.mesh.position.y > 500) {
			this.material.dispose();
			this.mesh.geometry.dispose(); //ジオメトリを破棄
			if (this.mesh.parent) {
				// 親オブジェクトから削除
				this.mesh.parent.remove(this.mesh);
			}
		}
	}

	public returnCreatedAt(): Date {
		return this.createdAt;
	}
}

export const createObjectGenerated = (props: postedProps | PsqlProps) => {
	return new Prototypes(props);
};
