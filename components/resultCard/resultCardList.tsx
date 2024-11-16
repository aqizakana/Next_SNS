import React from "react";
import styles from "./result.module.css";

type AnalysisResult = {
	id: number; // ユニークIDを追加
	status: number;
	content: string;
	charCount: number;
	koh_sentiment: Array<{
		label: string;
		score: number;
	}>;
	bert: {
		result: {
			sentiment: string;
		};
	};
	date: Date;
};

export function ResultCard({
	content,
	date,
	charCount,
	bert,
	status,
	koh_sentiment,
}: AnalysisResult) {
	const date_str = date.toLocaleString("ja-JP"); // 日本語フォーマットで日付を文字列に変換

	return (
		<div className={styles.resultCard}>
			<p>
				<strong>変換後テキスト:</strong> {content}
			</p>
			<p>
				<strong>日付:</strong> {date_str}
			</p>
			<p>
				<strong>文字数:</strong> {charCount}
			</p>
			<p>
				<strong>感情 (BERT):</strong> {bert.result.sentiment}
			</p>

			{koh_sentiment[0] && (
				<>
					<p>
						<strong>ラベル (Koheiduck):</strong> {koh_sentiment[0].label}
					</p>
					<p>
						<strong>スコア (Koheiduck):</strong>{" "}
						{koh_sentiment[0].score.toFixed(4)}
					</p>
				</>
			)}
		</div>
	);
}

export function ResultCardList({
	analysisResults,
}: { analysisResults: AnalysisResult[] }) {
	return (
		<div className={styles.resultCardList}>
			{analysisResults.map((result, key) => (
				<ResultCard key={result.id} {...result} />
			))}
		</div>
	);
}
