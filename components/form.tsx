import React, { useState } from 'react';
import axios from 'axios';
import styles from './form.module.css';

export default function TextForm() {
  const [inputText, setInputText] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
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
      setAnalysisResult({
        topic: topicResponse.data,
        sentiment: sentimentResponse.data
      });
      
      setInputText(''); // 入力をリセット
    } catch (error) {
      console.error('Error submitting text for analysis:', error);
      alert('Error submitting text for analysis. Please try again.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text for analysis"
      />
      <p>{inputText}</p>
      <button className={styles.button} type="submit">Submit</button>
      {analysisResult && (
        <div className={styles.result}>
          <h3>トピック分析結果:</h3>
          <p>文字数: {analysisResult.topic.character_count}</p>
          <p>{analysisResult.topic.message}</p>
          <h3>感情分析結果:</h3>
          <p>{analysisResult.sentiment[0].label}: {analysisResult.sentiment[0].score}</p>
        </div>
      )}
    </form>
  );
}