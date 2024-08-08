import React from 'react';
import axios from 'axios';
import styles from './form.module.css';

import { ResultCardList } from '../resultCard/resultCardList';

interface AnalyzeFormProps {
  inputText: string;
  setInputText: (text: string) => void;
  analysisResults: any[];
  setAnalysisResults: (results: any[]) => void;
  onSubmit: (result: any) => void;
}

export default function AnalyzeForm({ inputText, setInputText, analysisResults, setAnalysisResults, onSubmit }: AnalyzeFormProps) {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const topicResponse = await axios.post(`${apiBaseUrl}/analyze/analyze_topics/`, { text: inputText });
      const sentimentResponse = await axios.post(`${apiBaseUrl}/analyze/analyze_sentiment/`, { text: inputText });
      
      const newResult = {
        text: inputText,
        topic: topicResponse.data,
        sentiment: sentimentResponse.data
      };

      setAnalysisResults(prevResults => [...prevResults, newResult]);
      setInputText('');
      onSubmit(newResult); // page.tsxの関数に結果を渡す
    } catch (error) {
      console.error('分析中にエラーが発生しました:', error);
      alert('分析中にエラーが発生しました。もう一度お試しください。');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="分析するテキストを入力してください"
        />
        <button className={styles.button} type="submit">送信</button>
      </form>
      <ResultCardList analysisResults={analysisResults} />
    </div>
  );
}