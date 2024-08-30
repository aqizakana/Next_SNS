"use client"
//おまじない
import type { NextPage } from 'next'
import * as THREE from 'three'
import { useEffect, useRef ,useState } from 'react'
import styles from './Home.module.css'; // CSSモジュールをインポート


//背景
import { Background } from './objects/background'
import initializeScene from './objects/initializeScene'

//オブジェクトクラス
import { Circle } from './objects/Shape/Circle'
import { Sphere } from './objects/Shape/Sphere'
import { Box } from './objects/Shape/Box'
import { Particles } from './objects/Shape/particles'
import { createGroup,createTorusOnPath,DoubleCone,crossCylinder} from './objects/createGroup'
import { randomCircles } from './objects/randomCircles'
import Virus from './objects/Shape/Virus'
import  Virus2 from './objects/Shape/Virus2'   

//フォーム
import ObjectForm from './textAnalyze/objectForm';
import TextForm from "../../../components/form";
import AnalyzeForm from './textAnalyze/analyzeForm';
import PostForm from './PostForm/PostForm';

import { ResultCardList } from './resultCard/resultCardList';


//カメラコントロール
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Sphere2 from './objects/Shape/Sphere2';

interface AnalysisResults {
    status:number,
    text: string;
    topic: any;
    sentiment: any;
    MLAsk: any;
  }
  


const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedObject, setSelectedObject] = useState('');
    const [inputText, setInputText] = useState('');
    const [takeScreenshot, setTakeScreenshot] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResults[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    
    
    interface CustomMesh extends THREE.Mesh {
        objectName: string;
        creationTime: number;
      }

    const [objectList, setObjectList] = useState<CustomMesh[]>([]); 

    //動的シーンセッティング
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
      
    //シーンカメラレンダラー
    useEffect(() => {
        if (canvasRef.current) {
          const { scene, camera, renderer, controls,animate,takeScreenshot } = initializeScene(canvasRef.current)

           const virus = new Virus();
          /* scene.add(virus.getMesh());
          const virus2 = new Virus2();
          scene.add(virus2.getMesh()); */
          
          const sphere = new Sphere2();
          scene.add(sphere.getMesh());
           animate(virus,sphere) 
          
          window.addEventListener('mousemove', (event) => {
            const x = event.clientX / window.innerWidth;
            const y = 1.0 - (event.clientY / window.innerHeight);
            /* virus.setMousePosition(x, y);
            virus2.setMousePosition(x, y); */
          });
        }
      }, [])


    const handleAnalyze = (result: any) => {
        setAnalysisResults(result);
        //addObject(selectedObject, result);
    };

    const handlePostCreated = (newPost: any) => {
      // 新しい投稿を投稿リストに追加する処理
      setPosts((prevPosts) => [...prevPosts, newPost]);
    };



    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} id="canvas"></canvas>
            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>              
                    <PostForm onPostCreated={handlePostCreated} />
                </div>
                
            </div>
            
        </div>
    )
}

export default Home
