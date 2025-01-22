import * as three from "three";
import type { AnalysisResult } from "../type";
import { Circle } from "./Shape/Circle";
import { createObjectGenerated } from "./Shape/Prototype";
import { mapFunction } from "./mapFunction";

const kohLabelTransform = (kohLabel: string) => {
	console.log(kohLabel);
	switch (kohLabel) {
		case "POSITIVE":
			return 0;
		case "NEGATIVE":
			return 2;
		case "NEUTRAL":
			return 1;
		default:
			return 0;
	}
};
const bertLabelTransform = (bertLabel: string) => {
	switch (bertLabel) {
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
};

export class AddObject {
	private content: string;
	private charCountResult: number;
	private bertLabel: string;
	private date: Date;
	private koh_sentiment_label: string;
	private koh_sentiment_score: number;
	private username: string;
	private user_id: number;
	public PosX: number;
	public PosY: number;
	public PosZ: number;
	public ID: number;

	constructor(analysisResult: AnalysisResult) {
		this.ID = analysisResult.ID;
		this.content = analysisResult.content;
		this.charCountResult = analysisResult.charCountResult;
		this.bertLabel = analysisResult.bert.result.sentiment;
		this.date = new Date(analysisResult.date);
		this.koh_sentiment_label = analysisResult.koh_sentiment[0].label;
		this.koh_sentiment_score = analysisResult.koh_sentiment[0].score;
		this.username = analysisResult.username;
		this.user_id = analysisResult.userID;
		this.PosX = mapFunction({
			value: this.date.getMinutes(),
			inMin: 0,
			inMax: 59,
			outMin: -1500,
			outMax: 1500,
		});

		// Y軸 (秒)
		this.PosY = mapFunction({
			value: this.date.getSeconds(),
			inMin: 0,
			inMax: 59,
			outMin: -400,
			outMax: 70,
		});

		// Z軸 (時)
		this.PosZ = mapFunction({
			value: this.date.getHours(),
			inMin: 0,
			inMax: 23, // 時間は0〜23の範囲です
			outMin: -200,
			outMax: 300,
		});
	}
	public OwnObject() {
		const Pos = new three.Vector3(this.PosX, this.PosY, this.PosZ);
		const Sphere = new Circle(this.charCountResult * 3.5, Pos);
		return Sphere;
	}

	public MeshRotation(group: three.Group, rotationFactor: number) {
		group.children.forEach((mesh, index) => {
			if (mesh instanceof three.Mesh) {
				// グループに追加された順番に応じた回転を設定
				mesh.rotation.y = index * rotationFactor;
			}
		});
	}
	public OnPath(group: three.Group) {
		group.children.forEach((mesh, index) => {
			if (mesh instanceof three.Mesh) {
				mesh.position.set(this.PosX, this.PosY, this.PosZ);
			}
		});
	}

	public determineObjectAndMaterial() {
		const bertLabelNumber = bertLabelTransform(this.bertLabel);

		const kohSentimentLabelNumber = kohLabelTransform(this.koh_sentiment_label);

		const kohSentimentScore = this.koh_sentiment_score;
		const charCountResult = this.charCountResult;
		const content = this.content;
		const createdAt = this.date;
		const username = this.username;
		const user_id = this.user_id;
		const ID = this.ID;

		// Dataの中身のhour,minute,secondを取得
		// X軸 (分)

		const position = new three.Vector3(this.PosX, this.PosY, this.PosZ);

		const generatedObject = createObjectGenerated({
			ID,
			charCountResult,
			user_id,
			koheiduckSentimentScore: kohSentimentScore,
			koheiduckSentimentLabel: kohSentimentLabelNumber,
			bertLabel: bertLabelNumber,
			position,
			content,
			createdAt: createdAt,
			username,
		});

		return generatedObject;
	}
}
