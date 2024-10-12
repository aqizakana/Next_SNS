import * as THREE from 'three';
//import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
import vertex from '../../../glsl/vertex.glsl';
import fragment from '../../../glsl/fragment.glsl';
import { objectProps2, psqlProps } from './type';


const geometryClasses = [THREE.BoxGeometry, THREE.SphereGeometry, THREE.CylinderGeometry, THREE.TorusGeometry, THREE.ConeGeometry] as const;

const geometryType = (bertNumber: number, charCount: number): THREE.BufferGeometry => {
    const index = Math.min(Math.max(bertNumber, 0), geometryClasses.length - 1);
    const GeometryClass = geometryClasses[index];

    return new GeometryClass(charCount * 10, charCount * 10, charCount * 10);
}

const materialType = (_8labelScore: number, __8labelNumber: number): THREE.ShaderMaterial => {

    return new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        uniforms: {
            u_time: { value: 0.0 },
            u_colorWithScore: { value: _8labelScore },
            cutoffX: { value: 0.1 },
            cutoffZ: { value: 0.1 },
            u_8label: { value: __8labelNumber }
        }
    });
}

// 型ガード関数
function isPsqlProps(props: objectProps2 | psqlProps): props is psqlProps {
    return 'analyze_8labels_result' in props;
}

export class Prototypes {
    private geometry: THREE.BufferGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;
    private nounNumber: number;

    constructor(props: objectProps2 | psqlProps) {
        if (isPsqlProps(props)) {
            // psqlProps の場合の処理
            this.nounNumber = Prototypes.getSentimentLabelNumber(props.koheiduck_sentiment_label);
            const bertLabel = Prototypes.getBertLabelFromSentiment(props.analyze_8labels_result.sentiment);
            this.geometry = geometryType(bertLabel, props.charCount_result);
            this.material = materialType(props.koheiduck_sentiment_score, this.nounNumber);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            // position の設定は省略（必要に応じて追加）
        } else {
            // objectProps2 の場合の処理
            this.nounNumber = props.koh_sentiment_label_number;
            this.geometry = geometryType(props.bertLabel, props.charCount);
            this.material = materialType(props.koh_sentiment_score, props.koh_sentiment_label_number);
            this.mesh = new THREE.Mesh(this.geometry, this.material);
            this.mesh.position.set(props.position.x, props.position.y, props.position.z);
        }
    }
    private static getSentimentLabelNumber(label: string): number {
        // ラベルを数値に変換するロジック（例）
        const labelMap: { [key: string]: number } = {
            'positive': 1,
            'negative': 2,
            'neutral': 3
            // 他のラベルも必要に応じて追加
        };
        return labelMap[label] || 0;
    }

    private static getBertLabelFromSentiment(sentiment: string): number {
        // センチメントからBERTラベルを取得するロジック（例）
        const sentimentMap: { [key: string]: number } = {
            'positive': 0,
            'negative': 1,
            'neutral': 2
            // 他のセンチメントも必要に応じて追加
        };
        return sentimentMap[sentiment] || 0;
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;

    }

    public update(deltaTime: number) {

        this.material.uniforms.u_time.value += deltaTime / 1000.0;
        if (this.nounNumber === 1) {
            this.mesh.rotation.y += 0.00;
        }
    }
}

// Usage example
export const createObjectGenerated = (props: objectProps2 | psqlProps) => {

    return new Prototypes(props);
}