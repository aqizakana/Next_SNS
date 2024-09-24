import * as THREE from 'three';

import { objectProps } from '../type';


export class triangle {
    private geometry: THREE.ConeGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor({ sizeWithtopic, position, vertexShader, fragmentShader, colorWithScore, nounNumber }: objectProps) {

        this.geometry = new THREE.ConeGeometry(sizeWithtopic, sizeWithtopic, sizeWithtopic);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) },
                u_color: { value: colorWithScore },
                u_nounNumber: { value: nounNumber }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(position.x, position.y, position.z);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public update(deltaTime: number) {
        this.material.uniforms.u_time.value += deltaTime;
    }


}

