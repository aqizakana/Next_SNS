import React from 'react';
import styles from './resultCard.module.css';

export default function ResultCard({key, text, label, char_count, score }) {
    return (
        <div className={styles.resultCard}>
            <p><strong>Key:</strong> {key}</p>
            <p><strong>Text:</strong> {text}</p>
            <p><strong>Label:</strong> {label}</p>
            <p><strong>Character Count:</strong> {char_count}</p>
            <p><strong>Score:</strong> {score}</p>
        </div>
    );
}