import styles from "./result.module.css";

import type { AnalysisResult } from "../../src/app/three/type";

export function ResultCard({
	content,
	date,
	charCountResult,
	bert,
	status,
	koh_sentiment,
}: AnalysisResult) {
	const dateStr = date.toLocaleString("ja-JP"); // 日本語フォーマットで日付を文字列に変換

	return (
		<div className={styles.result__card}>
			<p>
				<strong>変換後テキスト:</strong> {content}
			</p>
			<p>
				<strong>日付:</strong> {dateStr}
			</p>
			<p>
				<strong>文字数:</strong> {charCountResult}
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
