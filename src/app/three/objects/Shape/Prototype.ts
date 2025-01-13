import * as THREE from "three";
import fragment from "../../../glsl/fragment.glsl";
import vertex from "../../../glsl/vertex.glsl";
import type { PsqlProps, postedProps } from "../../type";

import { Knot } from "../Shape/Knot/Knot";
import { Box } from "./Box/Box";
import { L } from "./Character/L";
import { DoubleCone } from "./Cone/dobleCone";
import { CrossCylinder } from "./Cylinder/CrossCylinder";
import { Icosahedron } from "./Iconsahedron/Icosahedron";
import { Cone } from "./Cone/Cone";
import { Sphere } from "./Sphere/Sphere";
import { Plus } from "./Character/plus";

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
			// uniformの定義のみ
			u_time: { value: 0.0 },
			u_colorWithScore: { value: 0.0 }, // 初期値を設定 (後でupdateで更新)
			u_PosNegNumber: { value: 0.0 },
			u_mouse: { value: new THREE.Vector2() },
			u_opacity: { value: 1.0 },
			u_8label: { value: 0.0 },
			u_height: { value: 0.0 },
			u_userID: { value: 0 },
			u_ID: { value: 0 },
			u_cameraPos: { value: new THREE.Vector3(0.0, 0.0, 700.0) },
			u_charCount: { value: 0 },
			u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
		},
	});
};

interface MeshClassInterface {
	getMesh(): THREE.Mesh;
}
const MeshClasses = [Sphere, CrossCylinder, Knot, Cone, DoubleCone, L, Box, Plus];
const meshType = (
	bertNumber: number,
	charCountResult: number,
	material: THREE.ShaderMaterial,
): MeshClassInterface => {
	const index = Math.min(bertNumber, MeshClasses.length - 1);
	const MeshClass = MeshClasses[index];
	return new MeshClass(Math.min(charCountResult * 3.0, 400), material);
};

// 型ガード関数
function isPsqlProps(props: postedProps | PsqlProps): props is PsqlProps {
	return "analyze8labelsResult" in props;
}

export class Prototypes {
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	private PosNegNumber: number;
	private _8_Label: number;
	private Score: number;
	public content = "";
	public createdAt: Date = new Date();
	public username = "";
	public user_id = 0;
	public ID = 0;
	public charCountResult = 0;

	constructor(props: postedProps | PsqlProps) {
		if (isPsqlProps(props)) {
			console.log(props);
			this.PosNegNumber = Prototypes.getBertLabelFromSentiment(
				props.koheiduckSentimentLabel,
			);
			this.Score = props.koheiduckSentimentScore;
			this._8_Label = Prototypes.getSentimentLabelNumber(
				props.analyze8labelsResult.sentiment,
			);
			this.content = props.content;
			this.createdAt = props.createdAt;
			this.username = props.username;
			this.user_id = props.user_id;
			this.ID = props.id;
			this.charCountResult = props.charCountResult;

			this.material = materialType(
				this.Score,
				this.PosNegNumber,
				this._8_Label,
				props.user_id,
				this.ID,
				this.charCountResult * 2,
			);

			this.mesh = meshType(
				this._8_Label,
				props.charCountResult * 2,
				this.material,
			).getMesh();

			this.mesh.position.set(
				props.position.x,
				props.position.y,
				props.position.z,
			);
		} else {
			// PsqlProps の場合の処理
			console.log(props.koh_sentiment_label_number);
			this.PosNegNumber = props.koh_sentiment_label_number;
			this.Score = props.koh_sentiment_score;
			this._8_Label = props.bertLabel;
			this.charCountResult = props.charCountResult;
			this.material = materialType(
				this.Score,
				this.PosNegNumber,
				this._8_Label,
				props.user_id,
				props.ID,
				this.charCountResult * 2,
			);
			this.mesh = meshType(
				this._8_Label,
				props.charCountResult,
				this.material,
			).getMesh();
			this.mesh.position.set(
				props.position.x,
				props.position.y,
				props.position.z,
			);

			// オブジェクトが生成されたときに初めて UUID を生
			this.content = props.content;
			this.createdAt = props.createdAt;
			this.username = props.username;
			this.user_id = props.user_id;
			this.Score = props.koh_sentiment_score;
			this.ID = props.ID;
		}
		const vertexIndices = new Float32Array(this.mesh.geometry.attributes.position.count);
		for (let i = 0; i < vertexIndices.length; i++) {
			vertexIndices[i] = i;
		}
		this.mesh.geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndices, 1));


		this.mesh.geometry.setAttribute(
			"normal",
			new THREE.BufferAttribute(
				new Float32Array(this.mesh.geometry.attributes.position.count * 3),
				3,
			),
		);
	}

	private static getSentimentLabelNumber(label: string): number {
		console.log(label);
		// ラベルを数値に変換するロジック（例）
		switch (label) {
			case "joy、うれしい":
				return 0.0;
			case "trust、信頼":
				return 1.0;
			case "anticipation、期待":
				return 2.0;
			case "surprise、驚き":
				return 3.0;
			case "sadness、悲しい":
				return 4.0;
			case "anger、怒り":
				return 5.0;
			case "fear、恐れ":
				return 6.0;
			case "disgust、嫌悪":
				return 7.0;
			default:
				return 8.0;
		}
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
	public update(): void {
		this.material.uniforms.u_time.value += 0.01;

		this.material.uniforms.u_colorWithScore.value = this.Score;
		this.material.uniforms.u_PosNegNumber.value = this.PosNegNumber;
		this.material.uniforms.u_8label.value = this._8_Label;
		this.material.uniforms.u_height.value = this.charCountResult * 2;
		this.material.uniforms.u_userID.value = this.user_id;
		this.material.uniforms.u_ID.value = this.ID;

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

// Usage example
export const createObjectGenerated = (props: postedProps | PsqlProps) => {
	return new Prototypes(props);
};
