import * as THREE from 'three';

import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import {Box} from './Shape/Box';
import { Sphere2 } from './Shape/Sphere2';


interface AnalysisResult {
    status: number;
    text: string;
    topic: number;
    sentiment: { label: string, score: number }[];
    MLAsk: {
      text: string;
      emotion: { [key: string]: string[] };
      orientation: string;
      activation: string;
      emoticon: string | null;
    };
    textBlob: { noun_phrases: string[] };
    cohereParaphrase: string;
  }
  
  interface argumentProps {
    text: string;
    label: string;
    char_count: number;
    score: number;
    MLAsk: any;
    textBlob: any;
    cohereParaphrase: string;
  }
  


export class AddObject{
    private text:string
    private topic = 0;
    private MLAsk: any;
    private textBlob:any;
    private label: string;
    private score = 0.00; 
    private transformed_text:string;

    constructor({ text, label, char_count, score, MLAsk, textBlob, cohereParaphrase }: argumentProps) {
        this.text =text;
        this.label = label; 
        this.topic = char_count;
        this.score = score;
        this.MLAsk = MLAsk;
        this.textBlob = textBlob;
        this.transformed_text = cohereParaphrase;
    }
    
    public label_transform(sentimentLabel: string){
    const number = parseInt(sentimentLabel.split(' ')[0], 10);
    return number;
    }

    public MLAsk_disassemble(MLAsk: any): { [key: string]: boolean } {
        const emotions = ['yorokobi', 'ikari', 'kanashimi', 'odoroki', 'iya', 'suki'];
        const emotions_flag: { [key: string]: boolean } = {
          yorokobi: false,
          ikari: false,
          kanashimi: false,
          odoroki: false,
          iya: false,
          suki: false
        };
      
        if (MLAsk && MLAsk.emotion) {
          emotions.forEach(emotion => {
            if (Array.isArray(MLAsk.emotion[emotion]) && MLAsk.emotion[emotion].length > 0) {
              emotions_flag[emotion] = true;
            }
          });
        } else {
          console.warn("MLAsk.emotion が存在しません。");
        }
        return emotions_flag;
      }

      public determineObjectAndMaterial() {
        const label_number = this.label_transform(this.label);
        const topic = this.topic;
        const score = this.score;
        const noun_number = this.textBlob.noun_phrases ? this.textBlob.noun_phrases.length : 0;
        const text_number = this.transformed_text.length;
        const MLAsk_disassemble = this.MLAsk_disassemble(this.MLAsk);
        const orientation = this.MLAsk.orientation || "UNKNOWN";
        const emotion = this.MLAsk.emoticon || "neutral";
        const activation = this.MLAsk.activation || "UNKNOWN";
      
        console.log("Processed topic:", topic);
        
        if (orientation === "POSITIVE") {
          const box = new Box(topic, new THREE.Vector3(0, 0, 0));
          return box;
        } else {
          const Sphere = new Sphere2();
          return Sphere
        }
      }
      
}


/* // addObject関数をコンポーネントのトップレベルで定義
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
}; */