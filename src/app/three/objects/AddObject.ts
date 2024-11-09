import * as THREE from 'three';
import { Circle } from './Shape/Circle';
import { createObjectGenerated } from './Shape/Prototype';
import type { AnalysisResult } from './Shape/type';
import { objectProps } from './Shape/type';
import { Sphere3 } from './Sphere/Sphere3';
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
};

export class AddObject {
  private content: string;
  private charCount: number;
  private bertLabel: string;
  private date: Date;
  private koh_sentiment_label: string;
  private koh_sentiment_score: number;
  private username: string;
  public PosX: number;
  public PosY: number;
  public PosZ: number;

  constructor(analysisResult: AnalysisResult) {
    this.content = analysisResult.content;
    this.charCount = analysisResult.charCount;
    this.bertLabel = analysisResult.bert.result.sentiment;
    this.date = new Date(analysisResult.date);
    this.koh_sentiment_label = analysisResult.koh_sentiment[0].label;
    this.koh_sentiment_score = analysisResult.koh_sentiment[0].score;
    this.username = analysisResult.username;
    this.PosX = Map({
      value: this.date.getMinutes(),
      inMin: 0,
      inMax: 59,
      outMin: -150,
      outMax: 150,
    });

    // Y軸 (秒)
    this.PosY = Map({
      value: this.date.getSeconds(),
      inMin: 0,
      inMax: 59,
      outMin: -200,
      outMax: 50,
    });

    // Z軸 (時)
    this.PosZ = Map({
      value: this.date.getHours(),
      inMin: 0,
      inMax: 23, // 時間は0〜23の範囲です
      outMin: 0,
      outMax: 250,
    });
  }
  public OwnObject() {
    const Sphere = new Circle(this.charCount * 2).getMesh();
    Sphere.position.set(-this.PosX, this.PosY, -this.PosZ);

    return Sphere;
  }

  public determineObjectAndMaterial() {
    const bert_label_number = bert_label_transform(this.bertLabel);

    const koh_sentiment_label_number = koh_label_transform(
      this.koh_sentiment_label,
    );

    const koh_sentiment_score = this.koh_sentiment_score;
    const charCount = this.charCount;
    const date = this.date;
    const content = this.content;
    const created_at = this.date;
    const username = this.username;

    // Dataの中身のhour,minute,secondを取得
    // X軸 (分)

    const position = new THREE.Vector3(-this.PosX, this.PosY, -this.PosZ);

    /* const alarm = {
  remind(aMessage) {
    alert(aMessage);
    this.timeoutID = undefined;
  },

  setup() {
    if (typeof this.timeoutID === "number") {
      this.cancel();
    }

    this.timeoutID = setTimeout(
      (msg) => {
        this.remind(msg);
      },
      1000,
      "Wake up!",
    );
  },

  cancel() {
    clearTimeout(this.timeoutID);
  },
};
window.addEventListener("click", () => alarm.setup());
*/

    const Object = createObjectGenerated({
      charCount,
      koh_sentiment_score,
      koh_sentiment_label_number,
      bertLabel: bert_label_number,
      position,
      content,
      created_at,
      username,
    });

    return Object;
  }
}
