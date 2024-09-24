import * as THREE from 'three';

import { objectProps } from '../Shape/type';

export class Sphere2 {
    private geometry: THREE.SphereGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor({ sizeWithtopic, position, vertexShader, fragmentShader, colorWithScore, nounNumber }: objectProps) {
        this.geometry = new THREE.SphereGeometry(sizeWithtopic, 40, 40);
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
        this.material.uniforms.u_time.value += 0.01;
        //this.mesh.rotation.x += this.material.uniforms.colorWithScore.value / 10.0;
    }
    public updateMousePosition(x: number, y: number) {
        this.material.uniforms.u_mouse.value.set(x, y);
    }
}

