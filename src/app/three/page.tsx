"use client"
//React機能
import type { NextPage } from 'next'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'  // For making API requests
import styles from './Home.module.css'

//THREE
import * as THREE from 'three';
import { initializeScene } from './objects/initializeScene'
import { ObjectData } from './ObjectData';
import PostForm from './PostForm/PostForm'
import { AddObject } from './objects/AddObject'
import { PreviousObject } from './objects/PreviousObject'
import { Prototypes } from './objects/Shape/Prototype'
import { psqlProps, AnalysisResult } from './objects/Shape/type'

import { Sphere3 } from './objects/Sphere/Sphere3';
import vertex from '../glsl/vertex.glsl';
import fragment from '../glsl/fragment.glsl';
import Layout from '../layout'



const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const Home: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([])
  const backgroundRef = useRef<any>(null)
  const [loadedPosts, setLoadedPosts] = useState<psqlProps[]>([]);
  const objectsToUpdate = useRef<any[]>([])
  const [isInactive, setIsInactive] = useState(false); // New state for tracking inactivity
  // Timer reference
  let inactivityTimer: NodeJS.Timeout;

  useEffect(() => {
    // Reset inactivity timer when user interacts
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      setIsInactive(false); // Set form as active

      inactivityTimer = setTimeout(() => {
        setIsInactive(true); // Set form as inactive after 3 seconds of inactivity
      }, 3000000); // 3 seconds
    };

    // Listen for user activity (key presses, mouse movements)
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('mousemove', resetTimer);

    // Cleanup the event listeners on unmount
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('mousemove', resetTimer);
    };
  }, []);

  useEffect(() => {
    const fetchPosts = () => {
      axios.get(`${apiBaseUrl}/api/v1/posts/SetGet/`)
        .then(response => {
          setLoadedPosts(response.data);  // Save the fetched data to state
          //console.log('Posts fetched:', response.data);
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
        });
    };

    // Fetch posts initially
    fetchPosts();

    // Set up the interval to fetch posts every 5 minutes (300000 ms)
    const intervalId = setInterval(fetchPosts, 30000); // 300000 ms = 5 minutes

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const background = initializeScene(canvasRef.current)
      backgroundRef.current = background

      background.animate(objectsToUpdate.current);


      loadedPosts.forEach(object => {

        loadPreviousObject(object);
      }
      )

      return () => {
        // Cleanup
        background.dispose()
      }
    }
  }, [loadedPosts]);

  const loadPreviousObject = (object: psqlProps) => {
    if (!backgroundRef.current) return;


    // Convert psqlProps to AnalysisResult
    const analysisResult: AnalysisResult = {
      status: 200,
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
      count: 1


    };

    // Initialize AddObject with the converted data
    const addObjectInstance = new AddObject(analysisResult);

    // Determine the object and material
    const newObject = addObjectInstance.determineObjectAndMaterial();


    if (newObject) {
      objectsToUpdate.current.push(newObject);
      backgroundRef.current.scene.add(newObject.getMesh());

    }
  };


  const addObjectToScene = (analysisResult: AnalysisResult) => {
    if (!backgroundRef.current) return

    const addObjectInstance = new AddObject({
      status: analysisResult.status,
      content: analysisResult.content,
      charCount: analysisResult.charCount,
      bert: analysisResult.bert,
      date: analysisResult.date,
      koh_sentiment: analysisResult.koh_sentiment
    })

    const newObject = addObjectInstance.determineObjectAndMaterial()


    if (newObject) {
      objectsToUpdate.current.push(newObject)
      backgroundRef.current.scene.add(newObject.getMesh())

      //console.log('position', newObject.getMesh().position); */
    }
  }
  const handlePostCreated = (newPost: AnalysisResult) => {
    setAnalysisResults(prevResults => [...prevResults, newPost])
    addObjectToScene(newPost)
  }

  return (

    <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} id="canvas"></canvas>
      <div className={styles.formContainer}>
        <div className={`${styles.formWrapper}${isInactive ? styles.inactive : ''}`}>
          <PostForm onPostCreated={handlePostCreated} />
        </div>
      </div>
    </div >

  )
}

export default Home