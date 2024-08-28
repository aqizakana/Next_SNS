import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import styles from './form.module.css';
import { ResultCardList } from '../resultCard/resultCardList';

interface PostFormProps {
  onPostCreated: () => void;
}

interface AnalysisResults {
  status: number;
  text: string;
  topic: any;
  sentiment: any;
  MLAsk: any;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('認証エラー：ログインしてください。');
        return;
      }

      try {
        const response = await axios.get(`${apiBaseUrl}/api/v1/accounts/userinfo/`, {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setUsername(response.data.username);
        localStorage.setItem('username', response.data.username);
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('認証エラー：ログインしてください。');
      return;
    }

    try {
      // 分析リクエストを送信
      const topicResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/analyze_topics/`, { text: content });
      const sentimentResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/analyze_sentiment/`, { text: content });
      const MLAskResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/analyze_MLAsk/`, { text: content });

      if (topicResponse.status !== 200 || sentimentResponse.status !== 200 || MLAskResponse.status !== 200) {
        throw new Error('分析中にエラーが発生しました。');
      }

      const newResult: AnalysisResults = {
        status: topicResponse.status + sentimentResponse.status + MLAskResponse.status,
        text: content,
        topic: topicResponse.data,
        sentiment: sentimentResponse.data,
        MLAsk: MLAskResponse.data,
      };

      setAnalysisResults((prevResults) => [...prevResults, newResult]);

      // 投稿リクエストを送信
      const response = await axios.post(
        `${apiBaseUrl}/api/v1/posts/create/`,
        { content },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const username = localStorage.setItem('username', response.data.username);
      console.log('Sending token:', token);
      console.log('Sending username:', username);
      console.log('Post created:', response.data);
      setContent('');
      onPostCreated();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // サーバーからのレスポンスがある場合
          setError(`エラー: ${error.response.status} - ${error.response.data.detail || '不明なエラー'}`);
        } else if (error.request) {
          // リクエストは送信されたがレスポンスがない場合
          setError('サーバーからの応答がありません。');
        } else {
          // リクエストの設定中にエラーが発生した場合
          setError(`リクエストエラー: ${error.message}`);
        }
      } else {
        // Axiosエラー以外の場合
        setError('不明なエラーが発生しました。');
      }
      console.error('Error creating post:', error);
    }
  };

  return (
    <div>
      {username && <p>ログイン中のユーザー: {username}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          rows={4}
        />
        <button type="submit">Post</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <ResultCardList analysisResults={analysisResults} />
    </div>
  );
};

export default PostForm;