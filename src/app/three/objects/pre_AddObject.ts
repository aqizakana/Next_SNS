import * as THREE from 'three';
import __orangeVertex from '../../glsl/__orangeVertex.glsl';
import claudeFragment from '../../glsl/claudeFrag.glsl';
import claudeVertex from '../../glsl/claudeVertex.glsl';
import fragment from '../../glsl/fragment.glsl';
import fragment2 from '../../glsl/fragment2.glsl';
import orangeFragment from '../../glsl/orangeFrag.glsl';
import orangeVertex from '../../glsl/orangeVertex.glsl';
import purpleFragment from '../../glsl/purpleFrag.glsl';
import purpleVertex from '../../glsl/purpleVertex.glsl';
import vertex from '../../glsl/vertex.glsl';
import vertex2 from '../../glsl/vertex2.glsl';

import { Box } from './Shape/Box/Box';
import { DoubleCone } from './Shape/Cone/dobleCone';
import { CrossCylinder } from './Shape/Cylinder/CrossCylinder';
import { type AnalysisResult, psqlProps } from './Shape/type';
import { Sphere2 } from './Sphere/Sphere2';
import { Map } from './map';

export class AddObject {
  private content: string;
  private charCount: number;
  private bert_label: string;
  private date: Date;
  private koh_sentiment_label: string;
  private koh_sentiment_score: number;

  constructor(analysisResult: AnalysisResult) {
    this.content = analysisResult.content;
    this.charCount = analysisResult.charCount;
    this.bert_label = analysisResult.bert.result.sentiment;
    this.date = new Date(analysisResult.date);
    this.koh_sentiment_label = analysisResult.koh_sentiment[0].label;
    this.koh_sentiment_score = analysisResult.koh_sentiment[0].score;
  }
  koh_label_transform(label: string) {
    switch (label) {
      case 'positive':
        return 1;
      case 'negative':
        return 2;
      case 'neutral':
        return 3;
      default:
        return 0;
    }
  }

  bert_label_transform(label: string) {
    switch (label) {
      case 'joy、うれしい':
        return 1;
      case 'sadness、悲しい':
        return 2;
      case 'anticipation、期待':
        return 3;
      case 'surprise、驚き':
        return 4;
      case 'anger、怒り':
        return 5;
      case 'fear、恐れ':
        return 6;
      case 'disgust、嫌悪':
        return 7;
      case 'trust、信頼':
        return 8;
      default:
        return 0;
    }
  }

  public determineObjectAndMaterial() {
    const bert_label_number = this.bert_label_transform(this.bert_label) || 0;
    const koh_sentiment_label_number =
      this.koh_label_transform(this.koh_sentiment_label) - 1 || 0;
    const koh_sentiment_score = this.koh_sentiment_score;
    const charCount = this.charCount;
    const date = this.date;
    const content = this.content;
    const created_at = this.date;
    const vertexShaderList = [
      vertex,
      vertex2,
      claudeVertex,
      purpleVertex,
      orangeVertex,
    ];
    const fragmentShaderList = [
      fragment,
      fragment2,
      claudeFragment,
      purpleFragment,
      orangeFragment,
    ];
    // Dataの中身のhour,minute,secondを取得
    // X軸 (分)
    const X = Map({
      value: date.getMinutes(),
      inMin: 0,
      inMax: 59,
      outMin: -1500,
      outMax: 1500,
    });

    // Y軸 (秒)
    const Y = Map({
      value: date.getSeconds(),
      inMin: 0,
      inMax: 59,
      outMin: -2000,
      outMax: 2000,
    });

    // Z軸 (時)
    const hour = date.getHours(); // 時の取得
    const Z = Map({
      value: hour,
      inMin: 0,
      inMax: 23, // 時間は0〜23の範囲です
      outMin: 0,
      outMax: 2500,
    });

    const position = new THREE.Vector3(-X, Y, -Z);
    const day = date.getDay();
    const dayObjects: any = [];
    const dayGroup: any = [];

    switch (koh_sentiment_label_number) {
      case 0:
        const C_Cylinder = new CrossCylinder({
          content,
          created_at,
          charCount: charCount * 2.0,
          position,
          vertexShader: vertexShaderList[bert_label_number],
          fragmentShader: fragmentShaderList[bert_label_number],
          analyze_8labels_result: bert_label_number,
          koh_sentiment_label_number,
          koh_sentiment_score,
        });
        dayGroup.push(C_Cylinder);
        return C_Cylinder;

      case 1:
        const box = new Box({
          content,
          created_at,
          charCount: charCount * 2.0,
          position,
          vertexShader: vertexShaderList[bert_label_number],
          fragmentShader: fragmentShaderList[bert_label_number],
          analyze_8labels_result: bert_label_number,
          koh_sentiment_label_number,
          koh_sentiment_score,
        });
        dayGroup.push(box);
        return box;
      case 2:
        const D_Cone = new DoubleCone({
          content,
          created_at,
          charCount: charCount * 2.0,
          position,
          vertexShader: vertexShaderList[bert_label_number],
          fragmentShader: fragmentShaderList[bert_label_number],
          analyze_8labels_result: bert_label_number,
          koh_sentiment_label_number,
          koh_sentiment_score,
        });
        dayGroup.push(D_Cone);
        return D_Cone;

      default:
        const spehere = new Sphere2({
          content,
          created_at,
          charCount: charCount * 2.0,
          position,
          vertexShader: vertexShaderList[bert_label_number],
          fragmentShader: fragmentShaderList[bert_label_number],
          analyze_8labels_result: bert_label_number,
          koh_sentiment_label_number,
          koh_sentiment_score,
          count: 1,
        });
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
