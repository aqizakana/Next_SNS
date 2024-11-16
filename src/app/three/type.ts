import type * as THREE from "three";
export type psqlProps = {
	analyze_8labels_result: {
		sentiment: string;
	};
	charCount_result: number;
	content: string;
	created_at: Date;
	id: number;
	koheiduck_sentiment_label: string;
	koheiduck_sentiment_score: number;
	updated_at: string;
	username: string;
	position: THREE.Vector3;
};

export interface AnalysisResult {
	status: number;
	username: string;
	content: string;
	charCount: number;
	bert: {
		result: {
			sentiment: string;
		};
	};
	date: Date;
	koh_sentiment: Array<{
		label: string;
		score: number;
	}>;
	count?: number;
}

export type postedProps = {
	bertLabel: number;
	charCount: number;
	koh_sentiment_label_number: number;
	koh_sentiment_score: number;
	position: THREE.Vector3;
	content: string;
	created_at: Date;
	username: string;
};

export interface MessageRecordItem {
	content: string;
	created_at: Date;
	username: string;
}
