import * as THREE from 'three';
import type { objectProps } from '../type';

export class Cylinder {
    private geometry: THREE.CylinderGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor({ charCount, vertexShader, fragmentShader, koh_sentiment_score, koh_sentiment_label_number }: objectProps) {
        this.geometry = new THREE.CylinderGeometry(charCount, charCount, charCount, charCount);
        const vertexIndices = new Float32Array(this.geometry.attributes.position.count);
        this.geometry.setAttribute('vertexIndex', new THREE.BufferAttribute(vertexIndices, 1));
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_color: { value: koh_sentiment_score },
                u_colorWithScore: { value: koh_sentiment_score },
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public update(deltaTime: number) {
        this.material.uniforms.u_time.value += 0.01;
    }
}

export default Cylinder;
