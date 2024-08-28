import React from 'react';
import styles from './result.module.css';

export default function ResultCard({ text, label, char_count, score, MLAsk }) {
    return (
        <div className={styles.resultCard}>
            <p><strong>テキスト:</strong> {text}</p>
            <p><strong>文字数:</strong> {char_count}</p>
            <p><strong>ラベル:</strong> {label}</p>
            <p><strong>スコア:</strong> {score}</p>
            <p><strong>MLAsk:</strong></p>
            <ul>
                <li>驚き: {MLAsk.emotion?.odoroki?.join(', ') || 'なし'}</li>
                <li>好き: {MLAsk.emotion?.suki?.join(', ') || 'なし'}</li>
                <li>方向性: {MLAsk.orientation || 'なし'}</li>
                <li>活性化: {MLAsk.activation || 'なし'}</li>
                <li>絵文字: {MLAsk.emoticon || 'なし'}</li>
                <li>意図: {MLAsk.intension || 'なし'}</li>
                <li>強調表現:</li>
                <ul>
                    <li>間投詞: {MLAsk.intensifier?.interjections?.join(', ') || 'なし'}</li>
                    <li>擬態語: {MLAsk.intensifier?.gitaigo?.join(', ') || 'なし'}</li>
                </ul>
                <li>代表感情: {MLAsk.representative?.[0] || 'なし'} ({MLAsk.representative?.[1]?.join(', ') || 'なし'})</li>
            </ul>
        </div>
    );
}

export function ResultCardList({ analysisResults }) {
    return (
        <div className={styles.resultCardList}>
            {analysisResults.map((result, index) => (
                <ResultCard
                    key={index}
                    text={result.text}
                    char_count={result.topic.character_count}
                    label={result.sentiment[0].label}
                    score={result.sentiment[0].score.toFixed(2)}
                    MLAsk={result.MLAsk}
                />
            ))}
        </div>
    );
}