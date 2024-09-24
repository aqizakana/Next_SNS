import * as THREE from 'three';
import vertex from '../../glsl/vertex.glsl';
import fragment from '../../glsl/fragment.glsl';
import vertex2 from '../../glsl/vertex2.glsl';
import fragment2 from '../../glsl/fragment2.glsl';
import orangeVertex from '../../glsl/orangeVertex.glsl';
import orangeFragment from '../../glsl/orangeFrag.glsl';
import purpleVertex from '../../glsl/purpleVertex.glsl';
import purpleFragment from '../../glsl/purpleFrag.glsl';
import claudeVertex from '../../glsl/claudeVertex.glsl';
import claudeFragment from '../../glsl/claudeFrag.glsl';
import __orangeVertex from '../../glsl/__orangeVertex.glsl';

import { Box } from './Shape/Box/Box';
import { Sphere2 } from './Sphere/Sphere2';
import { DoubleCone } from './Shape/Cone/dobleCone';
import { CrossCylinder } from './Shape/Cylinder/CrossCylinder';
import { Map } from './map';
import { objectProps } from './Shape/type';

type argumentProps = {
  text: string;
  char_count: number;
  koh_sentiment: string;
  bert_label: string;
  bert_score: number;
  MLAsk: any;
  textBlob: any;
  date: Date | string; // Allow string for date to handle parsing
}

export class AddObject {
  private text: string;
  private topic = 0;
  private MLAsk: any;
  private textBlob: any;
  private label: string;
  private score = 0.00;
  private date: Date;


  constructor({ text, bert_label, char_count, bert_score, MLAsk, textBlob, date }: argumentProps) {
    this.text = text;
    this.label = bert_label;
    this.topic = char_count;
    this.score = bert_score;
    this.MLAsk = MLAsk;
    this.textBlob = textBlob;

    // Convert date to Date object if it's a string
    this.date = typeof date === 'string' ? new Date(date) : date;
  }

  public label_transform(sentimentLabel: string) {
    console.log('sentimentLabel', sentimentLabel);
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
    const label_number = this.label_transform(this.label) - 1 || 0;
    const topic = this.topic;
    const score = this.score;
    const nounNumber = this.textBlob.noun_phrases.length;
    const MLAsk_disassemble = this.MLAsk_disassemble(this.MLAsk);
    const orientation = this.MLAsk.orientation || "UNKNOWN";
    const emotion = this.MLAsk.emoticon || "neutral";
    const activation = this.MLAsk.activation || "UNKNOWN";
    const date = this.date;


    const vertexShaderList = [vertex, vertex2, claudeVertex, purpleVertex, orangeVertex];
    const fragmentShaderList = [fragment, fragment2, claudeFragment, purpleFragment, orangeFragment];
    /*     console.log('vertexShaderList', vertexShaderList[label_number]);
     */
    // Dataの中身のhour,minute,secondを取得
    // X軸 (分)
    const X = Map({
      value: date.getMinutes(),
      inMin: 0,
      inMax: 59,
      outMin: -1500,
      outMax: 1500
    });

    // Y軸 (秒)
    const Y = Map({
      value: date.getSeconds(),
      inMin: 0,
      inMax: 59,
      outMin: -1000,
      outMax: 1000
    });

    // Z軸 (時)
    const hour = date.getHours(); // 時の取得
    const Z = Map({
      value: hour,
      inMin: 0,
      inMax: 23, // 時間は0〜23の範囲です
      outMin: 0,
      outMax: 2500
    });

    const position = new THREE.Vector3(-X, Y, -Z);
    const day = date.getDay();
    const dayObjects: any = [];
    const dayGroup: any = [];

    switch (nounNumber) {
      case 0:
        const C_Cylinder = new CrossCylinder({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
        dayGroup.push(C_Cylinder);
        return C_Cylinder;

      case 1:
        const box = new Box({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
        dayGroup.push(box);
        return box;
      case 2:
        const D_Cone = new DoubleCone({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
        dayGroup.push(D_Cone);
        return D_Cone;

      case 3:
        const spehere = new Sphere2({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
        dayGroup.push(spehere);
        return spehere;
    }
    dayGroup.push(dayObjects);
    /*     dayGroup.forEach((dayObject: any) => {
          dayObject.position.x += 100 * day;
        });
     */
  }
}
