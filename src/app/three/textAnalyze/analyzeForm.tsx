import React, { useState, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import styles from './form.module.css';
import { ResultCardList } from '../resultCard/resultCardList';

interface AnalysisResults {
  status:number,
  text: string;
  topic: any;
  sentiment: any;
  MLAsk: any;
}

interface AnalyzeFormProps {
  inputText: string;
  setInputText: Dispatch<SetStateAction<string>>;
  analysisResults: AnalysisResults[];
  setAnalysisResults: Dispatch<SetStateAction<AnalysisResults[]>>;
  onSubmit: (result: any) => void;
}

export default function AnalyzeForm({ inputText, setInputText, onSubmit }: AnalyzeFormProps) {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults[]>([]);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'; // デフォルトのAPIベースURLを設定

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const topicResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/analyze_topics/`, { text: inputText });
      const sentimentResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/analyze_sentiment/`, { text: inputText });
      const MLAskResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/analyze_MLAsk/`, { text: inputText });
  
      if (topicResponse.status !== 200 || sentimentResponse.status !== 200 || MLAskResponse.status !== 200) {
        throw new Error('分析中にエラーが発生しました。');
      }
  
      const newResult: AnalysisResults = {
        status:topicResponse.status + sentimentResponse.status + MLAskResponse.status,
        text: inputText,
        topic: topicResponse.data,
        sentiment: sentimentResponse.data,
        MLAsk: MLAskResponse.data
      };
  
      setAnalysisResults(prevResults => [...prevResults, newResult]);
      setInputText('');
      onSubmit(newResult);
    } catch (error) {
      console.error('分析中にエラーが発生しました:', error);
      //alert('分析中にエラーが発生しました。もう一度お試しください。');
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