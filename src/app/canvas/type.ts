import type * as three from "three";
export type PsqlProps = {
	analyze8labelsResult: {
		sentiment: string;
	};
	charCountResult: number;
	content: string;
	createdAt: Date;
	id: number;
	user_id: number;
	koheiduckSentimentLabel: string;
	koheiduckSentimentScore: number;
	updated_at: string;
	username: string;
	position: three.Vector3;
};

export interface AnalysisResult {
	id: number;
	status: number;
	username: string;
	userID: number;
	content: string;
	charCountResult: number;
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
	ID: number;
	bertLabel: number;
	charCountResult: number;
	koh_sentiment_label_number: number;
	koh_sentiment_score: number;
	position: three.Vector3;
	content: string;
	createdAt: Date;
	username: string;
	user_id: number;
};

export interface MessageRecordItem {
	content: string;
	createdAt: Date;
	username: string;
}
