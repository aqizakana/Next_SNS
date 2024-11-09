'use client';

import axios from 'axios'; // For making API requests
//React機能
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';
import styles from './Home.module.css';

import Loading from '../../../components/Loading';
import MessagePlate from './MessagePlate/MessagePlate';
import PostForm from './PostForm/PostForm';
import { AddObject } from './objects/AddObject';
//型
import type { AnalysisResult, psqlProps } from './objects/Shape/type';
//THREE
import { initializeScene } from './objects/initializeScene';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface MessageRecordItem {
  content: string;
  created_at: Date;
  username: string;

  geometry: any;
  material: any;
  mesh: any;
}

const Home: NextPage = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
  const backgroundRef = useRef<any>(null);
  const [loadedPosts, setLoadedPosts] = useState<psqlProps[]>([]);
  const objectsToUpdate = useRef<any[]>([]);
  const objectsselect = useRef<any[]>([]);
  const [clickedObjectInfo, setClickedObjectInfo] =
    useState<MessageRecordItem | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false); // New state for tracking inactivity
  const [isFlexVisible, setIsFlexVisible] = useState(true); // State to control flex div visibility

  useEffect(() => {
    const fetchPosts = async () => {
      axios
        .get(`${apiBaseUrl}/api/v1/posts/SetGet/`)
        .then(response => {
          setLoadedPosts(response.data);
          console.log('Posts fetched successfully:', response.data);
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
        const response = await axios.get(
          `${apiBaseUrl}/api/v1/accounts/userinfo/`,
          {
            headers: {
              Authorization: `Token ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        setUsername(response.data.username);
      } catch (error) {
        console.error('ユーザー情報の取得エラー:', error);
        setError('ユーザー情報の取得に失敗しました。');
      }
    };

    fetchUserInfo();
    fetchPosts();
    const intervalId = setInterval(fetchPosts, 1000000); // 300000 ms = 5 minutes

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const background = initializeScene(canvasRef.current);
      backgroundRef.current = background;
      background.animate(objectsToUpdate.current);
      const threeCanvas: HTMLElement | null = document.getElementById('canvas');

      let handleClick: any;
      loadedPosts.forEach(object => {
        loadPreviousObject(object);
        handleClick = () => logClickedObject(object);
        threeCanvas?.addEventListener('click', handleClick);
      });

      return () => {
        background.dispose();
        threeCanvas?.removeEventListener('click', handleClick);
      };
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
          sentiment: object.analyze_8labels_result.sentiment,
        },
      },
      date: new Date(object.created_at),
      koh_sentiment: [
        {
          label: object.koheiduck_sentiment_label,
          score: object.koheiduck_sentiment_score,
        },
      ],
    };

    const addObjectInstance = new AddObject(analysisResult);
    const newObject = addObjectInstance.determineObjectAndMaterial();

    if (newObject) {
      objectsToUpdate.current.push(newObject);
      objectsselect.current.push(newObject);
      backgroundRef.current.scene.add(newObject.getMesh());
      if (username === object.username) {
        const Sphere = addObjectInstance.OwnObject();
        Sphere.position.set(
          -addObjectInstance.PosX,
          addObjectInstance.PosY,
          -addObjectInstance.PosZ,
        );
        backgroundRef.current.scene.add(Sphere);

        // Update Sphere position to follow newObject
        const updateSpherePosition = () => {
          Sphere.position.copy(newObject.getMesh().position);
        };
        objectsToUpdate.current.push({ update: updateSpherePosition });
      }
    }
  };

  const addObjectToScene = (analysisResult: AnalysisResult) => {
    if (!backgroundRef.current) return;

    const addObjectInstance = new AddObject({
      ...analysisResult,
    });
    const newObject = addObjectInstance.determineObjectAndMaterial();
    if (newObject) {
      objectsToUpdate.current.push(newObject);
      backgroundRef.current.scene.add(newObject.getMesh());
      backgroundRef.current.cameraZoom(newObject.getMesh().position);
      if (username === analysisResult.username) {
        const Sphere = addObjectInstance.OwnObject();
        Sphere.position.set(
          -addObjectInstance.PosX,
          addObjectInstance.PosY,
          -addObjectInstance.PosZ,
        );
        backgroundRef.current.scene.add(Sphere);
      }
    }
  };

  //THREEのオブジェクトの情報と、psqlの情報を比較して、同じものを探す。
  // ...

  const logClickedObject = (otherInfo: any) => {
    if (!backgroundRef.current) return;
    const clickedObject = backgroundRef.current.clickObject();
    const addObjectInstance = objectsselect.current.find(
      obj => obj.getMesh() === clickedObject,
    );
    if (addObjectInstance) {
      setClickedObjectInfo(addObjectInstance);
    }

    return clickedObject;
  };

  const SetActivate = (isActive: any) => {
    setIsActive(isActive);
  };

  const handlePostCreated = (newPost: AnalysisResult) => {
    setAnalysisResults(prevResults => [...prevResults, newPost]);
    addObjectToScene(newPost);
    setIsActive(isActive);
  };

  const toggleFlexVisibility = () => {
    setIsFlexVisible(prev => !prev);
  };
  return (
    <div className={styles.container}>
      {isActive ? <Loading /> : null}

      <canvas ref={canvasRef} className={styles.canvas} id='canvas'></canvas>
      <MessagePlate MessageRecord={clickedObjectInfo} />

      <div className={styles.formContainer}>
        <div
          className={styles.formWrapper}
          style={{ opacity: isFlexVisible ? 1.0 : 0.0 }}
        >
          <PostForm onPostCreated={handlePostCreated} SetActive={SetActivate} />
        </div>
        <button
          className={styles.button}
          onClick={toggleFlexVisibility}
          style={{ opacity: isFlexVisible ? 1.0 : 0.5 }}
        >
          {isFlexVisible ? 'Close' : 'Open'}
        </button>
      </div>
    </div>
  );
};
export default Home;
