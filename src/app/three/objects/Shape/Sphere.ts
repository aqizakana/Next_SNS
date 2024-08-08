import * as THREE from 'three';

export class Sphere {
    private geometry: THREE.SphereGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor() {
        this.geometry = new THREE.SphereGeometry(150, 64, 64);
        this.material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                precision mediump float;

                varying vec2 vUv;
                uniform vec2 mouse; 
                uniform float time;

                void main() {
                    // Convert UV coordinates to a range of [0, 1] for the gradient
                    float gradient = vUv.y;

                    vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
                    // Create the grayscale color based on the gradient value
                    vec3 color = vec3(gradient);
                    
                    // Calculate a dynamic value based on time
                    //float dynamicValue = sin(time / 10.0) * 0.5 + 0.5;

                    // Adjust the color based on mouse position and dynamic value
                    gl_FragColor = vec4(1.0, color.y, 0.2, 1.0);
                }
            `,
            uniforms: {
                time: { value: 0.0 },
                mouse: { value: new THREE.Vector2(0, 0) }
            }
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public update(deltaTime: number) {
        this.material.uniforms.time.value += deltaTime;
    }

    public updateMousePosition(x: number, y: number) {
        this.material.uniforms.mouse.value.set(x, y);
    }
}

export default Sphere;
