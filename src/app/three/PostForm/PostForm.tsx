import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import styles from './PostForm.module.css';
import { ResultCardList } from '../resultCard/resultCardList';

interface PostFormProps {
  onPostCreated: (newPost: any) => void;
}

interface AnalysisResult {
  status: number;
  text: string;
  topic: any;
  sentiment: any;
  MLAsk: any;
  textBlob: any;
  cohereParaphrase:any;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);

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
      
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error);
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
      const textBlobResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/textBlob/`, { text: content });
      const cohereParaphraseResponse = await axios.post(`${apiBaseUrl}/api/v1/analyze/cohereChat/`, { text: content });
      

      if (topicResponse.status !== 200 || sentimentResponse.status !== 200 || MLAskResponse.status !== 200 || textBlobResponse.status !== 200) {
        throw new Error('分析中にエラーが発生しました。');
      }

      const newResult: AnalysisResult = {
        status: topicResponse.status + sentimentResponse.status + MLAskResponse.status + textBlobResponse.status,
        text: content,
        topic: topicResponse.data,
        sentiment: sentimentResponse.data,
        MLAsk: MLAskResponse.data,
        textBlob: textBlobResponse.data,
        cohereParaphrase:cohereParaphraseResponse.data
      };
     

      setAnalysisResults((prevResults) => [...prevResults, newResult]);

      // 投稿リクエストを送信
      const response = await axios.post(
        `${apiBaseUrl}/api/v1/posts/create/`,
        { content, textblob: textBlobResponse.data},
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      //console.log('送信トークン:', token);
      //console.log('投稿作成:', response.data);
      setContent('');
      const newPost ={
        ...response.data,
        newResult
      }
      onPostCreated(newPost.newResult); // 新しい投稿をコールバック関数に渡す
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setError(`エラー: ${error.response.status} - ${error.response.data.detail || '不明なエラー'}`);
        } else if (error.request) {
          setError('サーバーからの応答がありません。');
        } else {
          setError(`リクエストエラー: ${error.message}`);
        }
      } else {
        setError('不明なエラーが発生しました。');
      }
      console.error('投稿作成エラー:', error);
    }
  };

  return (
    <div>
      {username && <p>ログイン中のユーザー: {username}</p>}
      <div className={styles.flex} >
          <form onSubmit={handleSubmit}
                className={styles.form}  >
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="何を考えていますか？"
              rows={4}
              className={styles.textarea} // 余白を追加
            />
            <button className={styles.button} type="submit">投稿</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
</div>
      <ResultCardList analysisResults={analysisResults} />
    </div>
  );
};

export default PostForm;