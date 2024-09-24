import * as THREE from 'three';
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

import { objectProps } from '../type';

export class Box {
    private geometry: THREE.BoxGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;
    private nounNumber: number;

    constructor({ sizeWithtopic, position, vertexShader, fragmentShader, colorWithScore, nounNumber }: objectProps) {
        this.nounNumber = nounNumber;
        this.geometry = new THREE.BoxGeometry(sizeWithtopic * 2, sizeWithtopic * 2, sizeWithtopic * 2);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) },

                u_color: { value: colorWithScore },
                u_opacity: { value: 1.0 },
                lightPosition: { value: new THREE.Vector3(5, 5, 5) },
                lightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
                baseColor: { value: new THREE.Color(0.8, 0.8, 0.3) },
                glowStrength: { value: 1.0 },
                cutoffX: { value: 0.1 },
                cutoffZ: { value: 0.1 }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(position.x, position.y, position.z);

    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }
    public update(deltaTime: number) {
        this.mesh.rotation.x += 0.01;
        this.material.uniforms.u_time.value += deltaTime / 1000.0;
        if (this.nounNumber === 1) {
            this.mesh.rotation.y += 0.01;
        }
    }
}