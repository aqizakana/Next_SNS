import type * as three from "three";
export type PsqlProps = {
	analyze8labelsResult: {
		sentiment: string;
	};
	charCountResult: number;
	content: string;
	created_at: Date;
	id: number;
	koheiduck_sentiment_label: string;
	koheiduck_sentiment_score: number;
	updated_at: string;
	username: string;
	position: three.Vector3;
};

export interface AnalysisResult {
	id: number;
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
	position: three.Vector3;
	content: string;
	created_at: Date;
	username: string;
};

export interface MessageRecordItem {
	content: string;
	created_at: Date;
	username: string;
}
