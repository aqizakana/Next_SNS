"use client"
//React機能
import type { NextPage } from 'next'
import { Suspense, useEffect, useRef, useState } from 'react'
import axios from 'axios'  // For making API requests
import styles from './Home.module.css'

//THREE
import { initializeScene } from './objects/initializeScene'
import PostForm from './PostForm/PostForm'
import { AddObject } from './objects/AddObject'
import { Sphere3 } from './objects/Sphere/Sphere3';
//型
import { psqlProps, AnalysisResult } from './objects/Shape/type'
import Loading from '../../../components/Loading'

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Home: NextPage = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const backgroundRef = useRef<any>(null)
  const [loadedPosts, setLoadedPosts] = useState<psqlProps[]>([]);
  const objectsToUpdate = useRef<any[]>([])
  const [isInactive, setIsInactive] = useState(false);
  const [isactive, setIsActive] = useState(false); // New state for tracking inactivity

  useEffect(() => {
    const fetchPosts = async () => {
      axios.get(`${apiBaseUrl}/api/v1/posts/SetGet/`)
        .then(response => {
          setLoadedPosts(response.data);
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });

    };

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
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 100000); // 300000 ms = 5 minutes

    return () => {
      clearInterval(intervalId);

    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const background = initializeScene(canvasRef.current)
      backgroundRef.current = background;
      //background.handleMouseMove(backgroundRef.current);

      background.animate(objectsToUpdate.current);
      loadedPosts.forEach(object => {
        loadPreviousObject(object);
      }
      );



      return () => {
        background.dispose();

      }
    }
  }, [loadedPosts]);



  const loadPreviousObject = (object: psqlProps) => {
    if (!backgroundRef.current) return;

    const analysisResult: AnalysisResult = {
      status: 200,
      username: object.username,
      content: object.content,
      charCount: object.charCount_result,
      bert: {
        result: {
          sentiment: object.analyze_8labels_result.sentiment
        }
      },
      date: new Date(object.created_at),
      koh_sentiment: [{
        label: object.koheiduck_sentiment_label,
        score: object.koheiduck_sentiment_score
      }],
    };

    const addObjectInstance = new AddObject(analysisResult);
    const newObject = addObjectInstance.determineObjectAndMaterial();
    const positionEachObj = newObject.getMesh().position;

    if (newObject) {
      objectsToUpdate.current.push(newObject);
      backgroundRef.current.scene.add(newObject.getMesh());
      if (username === object.username) {

      }
    }
  };




  const addObjectToScene = (analysisResult: AnalysisResult) => {
    if (!backgroundRef.current) return;

    const addObjectInstance = new AddObject({
      ...analysisResult
    })
    const newObject = addObjectInstance.determineObjectAndMaterial()
    if (newObject) {
      objectsToUpdate.current.push(newObject)
      backgroundRef.current.scene.add(newObject.getMesh());

    }

  }

  const handlePostCreated = (newPost: AnalysisResult) => {
    setAnalysisResults(prevResults => [...prevResults, newPost]);
    addObjectToScene(newPost);
  }

  return (

    <div className={styles.container}>
      {isactive && <Loading />}  {/* isActiveがtrueのときのみLoadingを表示 */}
      <canvas ref={canvasRef} className={styles.canvas} id="canvas"></canvas>

      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>

          <PostForm onPostCreated={handlePostCreated} setIsActive={setIsActive} />

        </div>
      </div>

    </div >

  )
}

export default Home