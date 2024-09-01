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

import { AddObject } from './objects/AddObject';


//カメラコントロール
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Sphere2 from './objects/Shape/Sphere2';
import Link from 'next/link';

interface AnalysisResults {
    status:number,
    text: string;
    topic: any;
    sentiment: any;
    MLAsk: any;
  }

interface AnalysisResult {
status: number;
content: any;
topic: any;
sentiment: any;
MLAsk : (string | number)[];
textBlob: (string | number)[];
cohereParaphrase:string;
}
  


const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedObject, setSelectedObject] = useState('');
    const [inputText, setInputText] = useState('');
    const [takeScreenshot, setTakeScreenshot] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResults[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const sceneRef = useRef<THREE.Scene | null>(null);
    

    const objectsToUpdate: any[] = [];
    
    interface CustomMesh extends THREE.Mesh {
        objectName: string;
        creationTime: number;
      }
      
    //シーンカメラレンダラー
    useEffect(() => {
        if (canvasRef.current) {
          const { scene, camera, renderer, controls,animate } = initializeScene(canvasRef.current)

           const virus = new Virus();
           sceneRef.current = scene;
          
          const sphere = new Sphere2();
          scene.add(sphere.getMesh());
          objectsToUpdate.push(sphere); // 初期オブジェクトを追加
          //夕食がとても美味しく友達も喜んでいました。ありがとうございます！客室担当方はフレンドリーで丁寧に接客してくれました。朝ご飯もちょうどいいくらいの量で満足でした。部屋も予想よりも広くびっくりしました。
          
          objectsToUpdate.forEach((object, index)=>{ // index を追加
            console.log(`"objectsToUpdate"${index}`,object);
            animate(object)
          }
          )
            //animate(sphere);
          
          window.addEventListener('mousemove', (event) => {
            const x = event.clientX / window.innerWidth;
            const y = 1.0 - (event.clientY / window.innerHeight);
        
          });
        }
      }, [])

      const addObjectToScene = (analysisResult: AnalysisResult) => {
        if (!sceneRef.current) return;
      
        // AddObjectインスタンスを作成
        const addObjectInstance = new AddObject({
          text: analysisResult.content, // 入力されたテキスト
          label: analysisResult.sentiment[0].label,
          char_count: analysisResult.topic.character_count,
          score: analysisResult.sentiment[0].score.toFixed(2),
          MLAsk: analysisResult.MLAsk,
          textBlob: analysisResult.textBlob,
          cohereParaphrase: analysisResult.cohereParaphrase
        });
      
        // オブジェクトを決定し、シーンに追加
        const newObject = addObjectInstance.determineObjectAndMaterial();
        
      
        if (newObject) {
          // オブジェクトをランダムな位置に配置（例）
          newObject.getMesh().position.set(
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000,
            Math.random() * 2000 - 1000
          );
          objectsToUpdate.push(newObject); // 新しいオブジェクトを更新対象に追加
        
          console.log("newObject",newObject);
          sceneRef.current.add(newObject.getMesh());
        }
      };

      

    const handleAnalyze = (result: any) => {
        setAnalysisResults(result);
        //addObject(selectedObject, result);
    };

    const handlePostCreated = (newPost: any) => {
      // 新しい投稿を投稿リストに追加する処理
      console.log("analysisResults",newPost)

      addObjectToScene(newPost);
    };



    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} id="canvas"></canvas>
            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>              
                  <PostForm onPostCreated={handlePostCreated} />
                    <Link href="/">
                      HOME
                    </Link>
                </div>
                
            </div>
            
        </div>
    )
}

export default Home
