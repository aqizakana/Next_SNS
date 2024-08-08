"use client"
//おまじない
import type { NextPage } from 'next'
import * as THREE from 'three'
import { useEffect, useRef ,useState } from 'react'
import styles from './Home.module.css'; // CSSモジュールをインポート
import { createSeededRandom } from './objects/seed'

import { Background } from './objects/background'

//オブジェクトクラス
import { Circle } from './objects/Shape/Circle'
import { Sphere } from './objects/Shape/Sphere'
import { Box } from './objects/Shape/Box'
import { Particles } from './objects/Shape/particles'
import { createGroup,createTorusOnPath,DoubleCone,crossCylinder} from './objects/createGroup'
import { randomCircles } from './objects/randomCircles'

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
    const [analysisResult, setAnalysisResult] = useState(null);
    
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
        if (!canvasRef.current) return

        //背景
        const back  = new Background();
        const scene  = back.scene;
        sceneRef.current = scene;
        const sizes = back.sizes;
        
        //カメラ
        const camera = back.camera;
        camera.position.set(0, 0, 500); // カメラの初期座標を設定
        cameraRef.current = camera;

        //コントロール
        const controls = new OrbitControls(camera, canvasRef.current)
        controls.enableDamping = true
        controls.dampingFactor = 0.2
        controlsRef.current = controls;

        //レンダラー
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: false,
        })
        renderer.setSize(sizes.width*0.9, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        rendererRef.current = renderer;


        // ライト
        const amibientLight = new THREE.AmbientLight(0xffffff, 0.2)
        scene.add(amibientLight)
        const pointLight = new THREE.PointLight(0xffffff, 0.2)
        pointLight.position.set(0, 0, 0)
        scene.add(pointLight)

            
        // アニメーション
        const clock = new THREE.Clock()

        const tick = () => {
            const elapsedTime = clock.getElapsedTime()
            
            /* Box_list.forEach((box, index) => {
                box.rotation.x = elapsedTime;
                box.rotation.y = elapsedTime;
            }); */

            //particles.update(elapsedTime);
            controls.update()
            window.requestAnimationFrame(tick)
            renderer.render(scene, camera)
        }
        tick()

        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth*0.8
            sizes.height = window.innerHeight
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
            renderer.setSize(sizes.width*0.8, sizes.height)
            renderer.setPixelRatio(window.devicePixelRatio)
        })
        
        return () => {

        };
    }, [])

    //オブジェクト生成
    useEffect(() => {
        if (!sceneRef.current) return;

        const Objects = ['Sphere', 'Box', 'Circle', 'DoubleCone', 'crossCylinder','PathCircle'];
        let newObject_List = [];
        function addObject(selectedObject: string) {
            let newObject: CustomMesh | null = null;

            if (selectedObject === Objects[0]) {
                newObject = new Sphere().mesh as CustomMesh;
                newObject.objectName = Objects[0];
            } else if (selectedObject === Objects[1]) {
                newObject = new Box(300, new THREE.Vector3(0, 0, 0)).mesh as CustomMesh;
                newObject.objectName = Objects[1];
            } else if (selectedObject === Objects[2]) {
                newObject = new Circle(150, new THREE.Vector3(0, 0, 0)).mesh as CustomMesh;
                newObject.objectName = Objects[2];
            }else if (selectedObject === Objects[3]) {
                newObject = DoubleCone(200, 200, 50).mesh;
                
                newObject = newObject as CustomMesh;
                newObject.objectName = Objects[3];
            } else if (selectedObject === Objects[4]) {
                newObject = crossCylinder(50, 50, 200, 50).mesh;
                newObject = newObject as CustomMesh;
                newObject.objectName = Objects[4];
            }else if (selectedObject === Objects[5]){
                for (let i = 0; i < 8; i++) {
                    let  {TorusSet,BBB} = createTorusOnPath(150, 20);
                    TorusSet.rotation.set(0,i * 10,i * 10);
                    //TorusSet.rotation.set(0,0,0);
                    //Box_list.push(...BBB);
                    sceneRef.current!.add(TorusSet);
                }
            }
            

            if (newObject) {
                newObject.position.set(Math.random() * 2000 - 2000,0, Math.random() * 2000 - 2000);
                setObjectList(prevList => {
                    const updatedList = [...prevList, newObject];
                    newObject_List.push(newObject);
                    sceneRef.current!.add(newObject);

                    if (updatedList.length > 10) {
                        const firstObject = updatedList.shift(); // リストの最初のオブジェクトを削除
                        if (firstObject) {
                            sceneRef.current!.remove(firstObject); // シーンからも削除
                        }
                    }
                    return updatedList;
                });
            }
        }

        addObject(selectedObject);

    }, [selectedObject,analysisResult])

    

    return (
        <div className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} id="canvas"></canvas>
      
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
            {/* <ObjectForm selectedObject={selectedObject} onChange={setSelectedObject} /> */}
            <AnalyzeForm 
                inputText={inputText} 
                setInputText={setInputText} 
                analysisResult={analysisResult} 
                setAnalysisResult={setAnalysisResult} 
            /> 
        </div>

       
      </div>
    </div>
    
    )
}

export default Home
