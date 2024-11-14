import * as THREE from "three";
//import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
import vertex from "../../../glsl/vertex.glsl";
import fragment from "../../../glsl/fragment.glsl";
import type { objectProps2, psqlProps } from "./type";


import { DoubleCone } from "./Cone/dobleCone";
import { CrossCylinder } from "./Cylinder/CrossCylinder";
import { Box } from "./Box/Box";
import { L } from "./Character/L";

const geometryClasses = [
	THREE.SphereGeometry,
	THREE.BoxGeometry,
	THREE.CylinderGeometry,
	THREE.TorusGeometry,
	THREE.ConeGeometry,
] as const;

const geometryType = (
	bertNumber: number,
	charCount: number,
): THREE.BufferGeometry => {
	const index = Math.min(Math.max(bertNumber, 0), geometryClasses.length - 1);
	const GeometryClass = geometryClasses[index];

	return new GeometryClass(charCount * 2, charCount * 2, charCount * 2);
};


const materialType = (
	_8labelScore: number,
	__8labelNumber: number,
): THREE.ShaderMaterial => {
	return new THREE.ShaderMaterial({
		vertexShader: vertex,
		fragmentShader: fragment,
		uniforms: {
			u_time: { value: 0.0 },
			u_colorWithScore: { value: _8labelScore },
			cutoffX: { value: 0.1 },
			cutoffZ: { value: 0.1 },
			u_8label: { value: __8labelNumber },
		},
	});
};



interface MeshClassInterface {
	getMesh(): THREE.Mesh;
}
const MeshClasses = [
	Box,
	DoubleCone,
	L,
	CrossCylinder,

]

const meshType = (
	bertNumber: number,
	charCount: number,
	material: THREE.ShaderMaterial,
): MeshClassInterface => {
	const index = Math.min(Math.min(bertNumber, 2), geometryClasses.length - 1);
	const MeshClass = MeshClasses[index];
	return new MeshClass(charCount * 2, material);
};

// 型ガード関数
function isPsqlProps(props: objectProps2 | psqlProps): props is psqlProps {
	return "analyze_8labels_result" in props;
}

export class Prototypes {
	private geometry: THREE.BufferGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Object3D;
	private nounNumber: number;
	private bertLabel: any;
	private static objectUuid = ""; // 静的変数として定義
	public content = "";
	public created_at: Date = new Date();
	public username = "";

	constructor(props: objectProps2 | psqlProps) {
		if (isPsqlProps(props)) {
			// psqlProps の場合の処理
			this.bertLabel = Prototypes.getBertLabelFromSentiment(
				props.koheiduck_sentiment_label,
			);
			this.nounNumber = Prototypes.getSentimentLabelNumber(
				props.analyze_8labels_result.sentiment,
			);
			this.geometry = geometryType(this.bertLabel, props.charCount_result);
			this.material = materialType(
				props.koheiduck_sentiment_score,
				this.nounNumber,
			);
			this.mesh = new THREE.Mesh(this.geometry, this.material);
			this.content = props.content;
			this.created_at = props.created_at;
			this.username = props.username;
		} else {
			// objectProps2 の場合の処理
			this.nounNumber = props.koh_sentiment_label_number;
			this.bertLabel = props.bertLabel;
			this.geometry = geometryType(props.bertLabel, props.charCount);
			this.material = materialType(props.koh_sentiment_score, this.nounNumber);
			this.mesh = meshType(this.bertLabel, props.charCount, this.material).getMesh();
			this.mesh.position.set(
				props.position.x,
				props.position.y,
				props.position.z,
			);
			// オブジェクトが生成されたときに初めて UUID を生
			this.content = props.content;
			this.created_at = props.created_at;
			this.username = props.username;

		}
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
			NEGATIVE: 1,
			NEUTRAL: 2,
			// 他のセンチメントも必要に応じて追加
		};
		return sentimentMap[sentiment] || 0;
	}



	public getMesh(): THREE.Object3D {
		return this.mesh;
	}
	public update() {
		this.material.uniforms.u_time.value += 0.01;
		//this.mesh.position.y += 0.1;
	}
	public contentAndCreated() {
		return { content: this.content, created_at: this.created_at };
	}
}

// Usage example
export const createObjectGenerated = (props: objectProps2 | psqlProps) => {
	return new Prototypes(props);
};
