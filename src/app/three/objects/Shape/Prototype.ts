import * as three from "three";
import fragment from "../../../glsl/fragment.glsl";
//import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
import vertex from "../../../glsl/vertex.glsl";
import type { PsqlProps, postedProps } from "../../type";

import { Knot } from "../Shape/Knot/Knot";
import { Box } from "./Box/Box";
import { L } from "./Character/L";
import { DoubleCone } from "./Cone/dobleCone";
import { CrossCylinder } from "./Cylinder/CrossCylinder";
import { Icosahedron } from "./Iconsahedron/Icosahedron";
import { Spehre } from "./Sphere/Sphere";

const materialType = (
	koheiduckScore: number,
	koheiduckNumber: number,
	__8labelLabel: number,
	user_id: number,
	ID: number,
): three.ShaderMaterial => {
	return new three.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment,
		uniforms: {
			u_time: { value: 0.0 },
			u_colorWithScore: { value: Number(koheiduckScore) },
			cutoffX: { value: 0.1 },
			cutoffZ: { value: 0.1 },
			u_PosNegNumber: { value: koheiduckNumber },
			u_mouse: { value: new three.Vector2() },
			u_opacity: { value: 1.0 },
			u_8label: { value: __8labelLabel },
			u_height: { value: 0.0 },
			u_userID: { value: Number(user_id) },
			u_ID: { value: Number(ID) },
		},
	});
};

interface MeshClassInterface {
	getMesh(): three.Mesh;
}
const MeshClasses = [
	Spehre,
	Knot,
	CrossCylinder,
	L,
	DoubleCone,
	Box,
	Icosahedron,
];
const meshType = (
	bertNumber: number,
	charCountResult: number,
	material: three.ShaderMaterial,
): MeshClassInterface => {
	const index = Math.min(bertNumber, MeshClasses.length - 1);
	const MeshClass = MeshClasses[index];
	return new MeshClass(charCountResult * 2, material);
};

// 型ガード関数
function isPsqlProps(props: postedProps | PsqlProps): props is PsqlProps {
	return "analyze8labelsResult" in props;
}

export class Prototypes {
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	private PosNegNumber: number;
	private _8_Label: number;
	private Score: number;
	public content = "";
	public createdAt: Date = new Date();
	public username = "";
	public user_id = 0;
	public ID = 0;

	constructor(props: postedProps | PsqlProps) {
		if (isPsqlProps(props)) {
			// PsqlProps の場合の処理
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
			this.material = materialType(
				this.Score,
				this.PosNegNumber,
				this._8_Label,
				props.user_id,
				this.ID,
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
		} else {
			// PsqlProps の場合の処理
			this.PosNegNumber = props.koh_sentiment_label_number;
			this.Score = props.koh_sentiment_score;
			this._8_Label = props.bertLabel;
			//console.log(this.PosNegNumber, this._8_Label);
			this.material = materialType(
				this.Score,
				this.PosNegNumber,
				this._8_Label,
				props.user_id,
				props.ID,
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
			const height = props.charCountResult * 2;
			this.material.uniforms.u_height.value = height;
			// オブジェクトが生成されたときに初めて UUID を生
			this.content = props.content;
			this.createdAt = props.createdAt;
			this.username = props.username;
			this.user_id = props.user_id;
			this.Score = props.koh_sentiment_score;
			this.ID = props.ID;
		}
		this.GetVertexIndex();
	}

	private GetVertexIndex() {
		const vertexIndices = new Float32Array(
			this.mesh.geometry.attributes.position.count,
		);
		for (let i = 0; i < vertexIndices.length; i++) {
			vertexIndices[i] = i;
		}
		this.mesh.geometry.setAttribute(
			"vertexIndex",
			new three.BufferAttribute(vertexIndices, 1),
		);

		this.mesh.geometry.setAttribute(
			"normal",
			new three.BufferAttribute(
				new Float32Array(this.mesh.geometry.attributes.position.count * 3),
				3,
			),
		);
	}

	private static getSentimentLabelNumber(label: string): number {
		// ラベルを数値に変換するロジック（例）
		switch (label) {
			case "joy、うれしい":
				return 0.0;
			case "sadness、悲しい":
				return 1.0;
			case "anticipation、期待":
				return 2.0;
			case "surprise、驚き":
				return 3.0;
			case "anger、怒り":
				return 4.0;
			case "fear、恐れ":
				return 5.0;
			case "disgust、嫌悪":
				return 6.0;
			case "trust、信頼":
				return 7.0;
			default:
				return 8.0;
		}
	}

	private static getBertLabelFromSentiment(sentiment: string): number {
		// センチメントからBERTラベルを取得するロジック（例）
		const sentimentMap: { [key: string]: number } = {
			POSITIVE: 0,
			NEUTRAL: 1,
			NEGATIVE: 2,

			// 他のセンチメントも必要に応じて追加
		};
		return sentimentMap[sentiment] || 0;
	}

	public getMesh(): three.Object3D {
		return this.mesh;
	}
	public update(): void {
		this.material.uniforms.u_time.value += 0.0001;
		//this.mesh.position.y += 0.01;
		if (this.mesh.position.y > 150) {
			this.material.dispose();
			this.material.uniforms.u_opacity.value -= 0.0001;
		}
	}
	public updateMouse(mouse: three.Vector2): void {
		//マウスの位置を取得・更新するロジック
		this.material.uniforms.u_mouse.value = mouse;
	}

	public contentAndCreated() {
		return { content: this.content, createdAt: this.createdAt };
	}
}

// Usage example
export const createObjectGenerated = (props: postedProps | PsqlProps) => {
	return new Prototypes(props);
};
