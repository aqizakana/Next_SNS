import * as THREE from 'three';
import { AnalysisResult } from './Shape/type';
import { createObjectGenerated } from './Shape/Prototype';
import { objectProps } from './Shape/type';
import { Map } from './map';

const koh_label_transform = (kohLabel: string) => {
  switch (kohLabel) {
    case 'POSITIVE':
      return 1;
    case 'NEGATIVE':
      return 2;
    case 'NEUTRAL':
      return 3;
    default:
      return 0;
  }
};
const bert_label_transform = (bertLabel: string) => {
  switch (bertLabel) {
    case 'joy、うれしい':
      return 0.0;
    case 'sadness、悲しい':
      return 1.0;
    case 'anticipation、期待':
      return 2.0;
    case 'surprise、驚き':
      return 3.0;
    case 'anger、怒り':
      return 4.0;
    case 'fear、恐れ':
      return 5.0;
    case 'disgust、嫌悪':
      return 6.0;
    case 'trust、信頼':
      return 7.0;
    default:
      return 8.0;
  }
}


export class AddObject {
  private content: string;
  private charCount: number;
  private bertLabel: string;
  private date: Date;
  private koh_sentiment_label: string;
  private koh_sentiment_score: number;

  constructor(analysisResult: AnalysisResult) {
    this.content = analysisResult.content;
    this.charCount = analysisResult.charCount;
    this.bertLabel = analysisResult.bert.result.sentiment;
    this.date = new Date(analysisResult.date);
    this.koh_sentiment_label = analysisResult.koh_sentiment[0].label;
    this.koh_sentiment_score = analysisResult.koh_sentiment[0].score;
  }

  public determineObjectAndMaterial() {
    const bert_label_number = bert_label_transform(this.bertLabel);

    const koh_sentiment_label_number = koh_label_transform(this.koh_sentiment_label);
2
    const koh_sentiment_score = this.koh_sentiment_score;
    const charCount = this.charCount;
    const date = this.date;
    const content = this.content;
    const created_at = this.date;
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
      outMin: -2000,
      outMax: 2000
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

    const Object = createObjectGenerated({ charCount, koh_sentiment_score, koh_sentiment_label_number, bertLabel: bert_label_number, position });
    return Object;
  }
}
