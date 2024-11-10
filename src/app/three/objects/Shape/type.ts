/*オブジェクトの引数一覧
    label_numberは+2してオブジェクトの頂点数と捉える
    topicは文字数なので、そのままオブジェクトの大きさと捉える
    scoreは感情のスコアなので、そのままオブジェクトの色と捉える
    noun_numberは名詞の数なので、そのまま集合内のオブジェクトの数と捉える
    ML-Askは一旦保留
    hour,minute,secondは時間なので、そのままオブジェクトの位置と捉える
    */

//psqlから取得したデータの型
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
	position: any;
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

export type objectProps = {
	id?: number;
	content: string;
	created_at: Date;
	bertLabel: number;
	charCount: number;
	//position3次元空間での位置
	position: any;
	vertexShader: string;
	fragmentShader: string;
	///vertexNumberwithTopic: number;
	koh_sentiment_label_number: number;
	koh_sentiment_score: number;
	count?: number;
};

export type objectProps2 = {
	bertLabel: number;
	charCount: number;
	koh_sentiment_label_number: number;
	koh_sentiment_score: number;
	position: any;
	content: string;
	created_at: Date;
	username: string;
};
