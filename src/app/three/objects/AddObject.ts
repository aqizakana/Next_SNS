import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';

export class AddObject {
    private sentimentLabel: string;
    private score: number;
    private topicAnalyze: any;
    private MLASK: any;

    constructor(sentimentLabel: string, score: number, topicAnalyze: any, MLASK: any) {
        this.sentimentLabel = sentimentLabel;
        this.score = score;
        this.topicAnalyze = topicAnalyze;
        this.MLASK = MLASK;
    }
    
    public label_transform(sentimentLabel: string){
    const number = sentimentLabel.split(' ')[0];
    return number;
    }

    public determineObjectAndMaterial(): { object: THREE.Mesh; material: THREE.Material } {
        // ここで、sentimentLabel, score, topicAnalyze, MLASKに基づいてオブジェクトとマテリアルを決定するロジックを実装します。
        // 例えば、sentimentLabelが"positive"の場合は、Sphereオブジェクトと緑色のマテリアルを返すなど。
        // このロジックは、実際の要件に応じて適切に実装してください。
        // 以下は単純な例です。
        
        if (this.sentimentLabel === "positive") {
            return {
                object: new THREE.SphereGeometry(1, 60, 60),
                material: new THREE.MeshBasicMaterial({ color: 0x008000 }) // 緑色
            };
        } else {
            return {
                object: new THREE.BoxGeometry(1, 1, 1),
                material: new THREE.MeshBasicMaterial({ color: 0x000000 }) // 黒色
            };
        }
    }
}


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