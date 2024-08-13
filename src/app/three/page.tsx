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


//カメラコントロール
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'


const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedObject, setSelectedObject] = useState('');
    const [inputText, setInputText] = useState('');
    const [analysisResults, setAnalysisResults] = useState<any[]>([]);

    const [analysisResult, setAnalysisResult] = useState<any>(null);
    
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
          const { scene, camera, renderer, controls,animate } = initializeScene(canvasRef.current)
          const virus = new Virus();
          //scene.add(virus.getMesh());
          const virus2 = new Virus2();
          scene.add(virus2.getMesh());
          
          animate(virus,virus2)
          
          window.addEventListener('mousemove', (event) => {
            const x = event.clientX / window.innerWidth;
            const y = 1.0 - (event.clientY / window.innerHeight);
            virus.setMousePosition(x, y);
            virus2.setMousePosition(x, y);
          });
        }
      }, [])

    // addObject関数をコンポーネントのトップレベルで定義
    const addObject = (selectedObject: string, analysisResult: any) => {
        if (!sceneRef.current) return;

        let newObject: CustomMesh | null = null;
        console.log("selectedObject", selectedObject);
        console.log("analysisResult", analysisResult);

        const Objects = ['Sphere', 'Box', 'Circle', 'DoubleCone', 'crossCylinder', 'PathCircle'];

        if (analysisResult.topic.character_count === 98) {
            newObject = new Sphere().getMesh() as CustomMesh;
            newObject.objectName = Objects[0];
        } else if (analysisResult.topic.character_count === 6) {
            newObject = new Box(300, new THREE.Vector3(0, 0, 0)).getMesh() as CustomMesh;
            newObject.objectName = Objects[1];
        } else if (analysisResult.topic.character_count === 7) {
            newObject = new Circle(150, new THREE.Vector3(0, 0, 0)).getMesh() as CustomMesh;
            newObject.objectName = Objects[2];
        }else if (analysisResult.topic.character_count === 8) {
            newObject = DoubleCone(200, 200, 50).mesh as CustomMesh;
            newObject = newObject as CustomMesh;
            newObject.objectName = Objects[3];
        } else if (analysisResult.topic.character_count === 9) {
            newObject = crossCylinder(50, 50, 200, 50).mesh as CustomMesh;
            newObject.objectName = Objects[4];
        }else if (analysisResult.topic.character_count === 10){
            for (let i = 0; i < 8; i++) {
                let  {TorusSet,BBB} = createTorusOnPath(150, 20);
                TorusSet.rotation.set(0,i * 10,i * 10);
                //TorusSet.rotation.set(0,0,0);
                //Box_list.push(...BBB);
                sceneRef.current!.add(TorusSet);
            }
        }

        if (newObject) {
            newObject.position.set(Math.random() * 2000 - 2000, 0, Math.random() * 2000 - 2000);
            setObjectList(prevList => {
                const updatedList = [...prevList, newObject];
                sceneRef.current!.add(newObject);
                
                if (updatedList.length > 10) {
                    const firstObject = updatedList.shift();
                    if (firstObject) {
                        sceneRef.current!.remove(firstObject);
                    }
                }
                return updatedList;
            });
        }
    };

    const handleAnalyze = (result: any) => {
        setAnalysisResult(result);
        addObject(selectedObject, result);
    };



    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} className={styles.canvas} id="canvas"></canvas>
            
            <div className={styles.formContainer}>
                <div className={styles.formWrapper}>
                    <ObjectForm selectedObject_1={selectedObject} onChange={setSelectedObject} />
                    <AnalyzeForm 
                        inputText={inputText}
                        setInputText={setInputText}
                        analysisResults={analysisResults}
                        setAnalysisResults={setAnalysisResults}
                        onSubmit={handleAnalyze}
                    />
                </div>
            </div>
        </div>
    )
}

export default Home
