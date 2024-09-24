import * as THREE from 'three';

type argumentProps = {
    size: number;
    position: THREE.Vector3;
    vertexShader: string;
    fragmentShader: string;
    score: number;
}

export class Sphere {
    private geometry: THREE.SphereGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor({ size,position, vertexShader, fragmentShader,score}: argumentProps) {
        this.geometry = new THREE.SphereGeometry(size, 64, 64);
        this.material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: vertexShader,
            uniforms: {
                u_time: { value: 0.0 },
                u_mouse: { value: new THREE.Vector2(0, 0) }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public update(deltaTime: number) {
        this.material.uniforms.u_time.value += deltaTime;
    }

    public updateMousePosition(x: number, y: number) {
        this.material.uniforms.u_mouse.value.set(x, y);
    }
}


