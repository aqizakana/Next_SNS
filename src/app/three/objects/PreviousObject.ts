import * as THREE from 'three';

import vertex from '../../glsl/vertex.glsl';
import fragment from '../../glsl/fragment.glsl';

import vertex2 from '../../glsl/vertex2.glsl';
import fragment2 from '../../glsl/fragment2.glsl';

import orangeVertex from '../../glsl/orangeVertex.glsl';
import orangeFragment from '../../glsl/orangeFrag.glsl'
import purpleVertex from '../../glsl/purpleVertex.glsl';
import purpleFragment from '../../glsl/purpleFrag.glsl';
import claudeVertex from '../../glsl/claudeVertex.glsl';
import claudeFragment from '../../glsl/claudeFrag.glsl';
import __orangeVertex from '../../glsl/__orangeVertex.glsl';

//オブジェクトの種類
import { Box } from './Shape/Box/Box';
import { Sphere2 } from './Sphere/Sphere2';
import { triangle } from './Shape/Cone/triangle';
import { DoubleCone } from './Shape/Cone/dobleCone';

import { Map } from './map';
import { objectProps } from './Shape/type';

export interface objects10 {
    id: number;
    content: string;
    created_at: Date;
    updated_at: Date;
    //ml_ask_result: any;
    koh_sentiment: string;
    sentiment_label: string;
    sentiment_score: number;
    //textBlob_result: any;
    char_count: any;
}

export class PreviousObject {
    private id: number;
    private content: string;
    private label: string;
    private textBlob_result: any;
    private score: number;
    private MLAsk: any;
    private topic_analyze: number;
    private date: Date;

    constructor({ id, content, created_at, koh_sentiment, updated_at, sentiment_label, sentiment_score, char_count }: objects10) {
        this.id = id;
        this.content = content;
        this.label = sentiment_label;
        //this.textBlob_result = textBlob_result;
        this.score = sentiment_score;
        //this.MLAsk = ml_ask_result;
        this.topic_analyze = char_count;
        this.date = created_at;
    }

    public label_transform(sentimentLabel: string | undefined | null): number {
        console.log('sentimentLabel', sentimentLabel);
        if (!sentimentLabel) {
            return 0; // または適切なデフォルト値
        }
        const parts = sentimentLabel.split(' ');
        if (parts.length === 0) {
            return 0; // または適切なデフォルト値
        }
        const number = parseInt(parts[0], 10);
        return isNaN(number) ? 0 : number; // NaNの場合も0（またはデフォルト値）を返す
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
        const label_number = this.label_transform(this.label) || 0;
        const topic = this.topic_analyze;
        const score = this.score;
        const nounNumber = this.textBlob_result.noun_phrases.length || 0;
        const date = this.date;
        console.log("label_number", label_number);
        console.log('nounNumber', nounNumber)


        const vertexShaderList = [vertex, vertex2, __orangeVertex, purpleVertex, claudeVertex];
        const fragmentShaderList = [fragment, fragment2, orangeFragment, purpleFragment, claudeFragment];
        console.log('vertexShaderList', vertexShaderList[label_number]);

        //Dataの中身のhour,minute,secondを取得
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
            outMin: -1500,
            outMax: 1500
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
                const spehere = new Sphere2({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
                dayGroup.push(spehere);
                return spehere;
            case 1:
                const TRI = new triangle({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
                dayGroup.push(TRI);
                return TRI;
            case 2:
                const D_Cone = new DoubleCone({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
                dayGroup.push(D_Cone);
                return D_Cone;
            case 3:
                const box = new Box({ sizeWithtopic: topic * 2.0, position, vertexShader: vertexShaderList[label_number], fragmentShader: fragmentShaderList[label_number], colorWithScore: score, nounNumber });
                dayGroup.push(box);
                return box;
        }
        dayGroup.push(dayObjects);
        /*   dayGroup.forEach((dayObject: any) => {
              dayObject.position.x += 100 * day;
          }); */

    }

}