import React, { useState } from 'react';
import axios from 'axios';
import styles from './form.module.css';

import { ResultCardList } from '../resultCard/resultCardList';

export default function AnalyzeForm() {
  const [inputText, setInputText] = useState('');
  const [analysisResults, setAnalysisResults] = useState([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  console.log('API Base URL:', apiBaseUrl);  // 確認用ログ

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const topicResponse = await axios.post(`${apiBaseUrl}/analyze/analyze_topics/`, { text: inputText });
      const sentimentResponse = await axios.post(`${apiBaseUrl}/analyze/analyze_sentiment/`, { text: inputText });
      console.log('Topic Analysis:', topicResponse.data);
      console.log('Sentiment Analysis:', sentimentResponse.data);
      setAnalysisResults(prevResults => [
        ...prevResults,
        {
          text: inputText,
          topic: topicResponse.data,
          sentiment: sentimentResponse.data
        }
      ]);
      
      setInputText(''); // 入力をリセット
    } catch (error) {
      console.error('Error submitting text for analysis:', error);
      alert('Error submitting text for analysis. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter text for analysis"
          className={styles.input}
        />
        <button className={styles.button} type="submit">Submit</button>
      </form>
      <ResultCardList analysisResults={analysisResults} />
    </div>
  );
}