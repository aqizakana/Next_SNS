import { Position } from "three/examples/jsm/Addons.js";

/*オブジェクトの引数一覧
    label_numberは+2してオブジェクトの頂点数と捉える
    topicは文字数なので、そのままオブジェクトの大きさと捉える
    scoreは感情のスコアなので、そのままオブジェクトの色と捉える
    noun_numberは名詞の数なので、そのまま集合内のオブジェクトの数と捉える
    ML-Askは一旦保留
    hour,minute,secondは時間なので、そのままオブジェクトの位置と捉える
    */
export type objectProps = {
    
    sizeWithtopic: number;
    //position3次元空間での位置
    position: any;
    vertexShader: string;
    fragmentShader: string;
    ///vertexNumberwithTopic: number;
    colorWithScore: number;
    nounNumber: number;
}
