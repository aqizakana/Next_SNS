import React from 'react';
import styles from './result.module.css';

export default function ResultCard({text, label, char_count, score }) {
    return (
        <div className={styles.resultCard}>
            
            <p><strong>Text:</strong> {text}</p>
            <p><strong>Character Count:</strong> {char_count}</p>
            <p><strong>Label:</strong> {label}</p>
            <p><strong>Score:</strong> {score}</p>
        </div>
    );
}
export function ResultCardList({ analysisResults }) {
    return (
        <div className={styles.resultCardList} style={{  }}>
            {analysisResults.map((result, index) => (
                <ResultCard
                    key={index}
                    text={result.text}
                    char_count={result.topic.character_count}
                    label={result.sentiment[0].label}
                    score={result.sentiment[0].score.toFixed(2)} // 小数点2桁まで表示
                />
            ))}
        </div>
    );
}