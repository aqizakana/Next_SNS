import * as THREE from 'three';
import vertexShader from '../../../glsl/vertex.glsl';
import fragmentShader from '../../../glsl/fragment.glsl';


export class Sphere2 {
    private geometry: THREE.SphereGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor() {
        this.geometry = new THREE.SphereGeometry(150, 64, 64);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0.0 },
                mouse: { value: new THREE.Vector2(0, 0) },
               
               
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    // Meshのプロパティを委譲するためのgetter
 

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public update(deltaTime: number) {
        this.material.uniforms.time.value += deltaTime/1000.0;
        this.mesh.rotation.x += deltaTime/1000.0;
    }
    public updateTime(time: number) {
        this.material.uniforms.time.value = time;
    }

    public updateMousePosition(x: number, y: number) {
        this.material.uniforms.mouse.value.set(x, y);
    }
}

export default Sphere2;
