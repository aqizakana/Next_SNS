import * as THREE from 'three';

import fragment from '../../glsl/fragment.glsl';
import vertex from '../../glsl/vertex.glsl';

import fragment2 from '../../glsl/fragment2.glsl';
import vertex2 from '../../glsl/vertex2.glsl';

import __orangeVertex from '../../glsl/__orangeVertex.glsl';
import claudeFragment from '../../glsl/claudeFrag.glsl';
import claudeVertex from '../../glsl/claudeVertex.glsl';
import orangeFragment from '../../glsl/orangeFrag.glsl';
import orangeVertex from '../../glsl/orangeVertex.glsl';
import purpleFragment from '../../glsl/purpleFrag.glsl';
import purpleVertex from '../../glsl/purpleVertex.glsl';

//オブジェクトの種類
import { Box } from './Shape/Box/Box';
import { DoubleCone } from './Shape/Cone/dobleCone';
import { triangle } from './Shape/Cone/triangle';
import { Sphere2 } from './Sphere/Sphere2';

import type { psqlProps } from './Shape/type';
import { Map } from './map';

export class PreviousObject {
  private id: number;
  private content: string;
  private koh_sentiment_label: string;
  private koh_sentiment_score: number;
  private analyze_8labels_result: string;
  private charCount: number;
  private date: Date;

  constructor(objects10props: psqlProps) {
    this.id = objects10props.id;
    this.content = objects10props.content;
    this.koh_sentiment_label = objects10props.koheiduck_sentiment_label;
    this.koh_sentiment_score = objects10props.koheiduck_sentiment_score;
    this.analyze_8labels_result =
      objects10props.analyze_8labels_result.sentiment;
    this.charCount = objects10props.charCount_result;
    this.date = new Date(objects10props.created_at);
  }

  public koh_label_transform(label: string) {
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

  public bert_label_transform(label: string) {
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
    /*オブジェクトの引数一覧
        label_numberはshaderのクラス分けに使う
        topicは文字数なので、そのままオブジェクトの大きさと捉える
        scoreは感情のスコアなので、そのままオブジェクトの色と捉える
        noun_numberは名詞の数なので、そのまま集合内のオブジェクトの数と捉える
        ML-Askは一旦保留
        hour,minute,secondは時間なので、そのままオブジェクトの位置と捉える
        */
    const bert_label_number = this.bert_label_transform(
      this.analyze_8labels_result,
    );
    const koh_sentiment_label_number = this.koh_label_transform(
      this.koh_sentiment_label,
    );
    const charCount = this.charCount;
    const koh_sentiment_score = this.koh_sentiment_score;
    const date = this.date;

    const vertexShaderList = [
      vertex,
      vertex2,
      __orangeVertex,
      purpleVertex,
      claudeVertex,
    ];
    const fragmentShaderList = [
      fragment,
      fragment2,
      orangeFragment,
      purpleFragment,
      claudeFragment,
    ];
    const content = this.content;
    const created_at = this.date;

    //Dataの中身のhour,minute,secondを取得
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
      outMin: -1500,
      outMax: 1500,
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

    switch (bert_label_number) {
      case 0:
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
        });
        dayGroup.push(spehere);
        return spehere;
      case 1:
        const TRI = new triangle({
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
        dayGroup.push(TRI);
        return TRI;
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
      case 3:
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
    }
    dayGroup.push(dayObjects);
    /*   dayGroup.forEach((dayObject: any) => {
              dayObject.position.x += 100 * day;
          }); */
  }
}
