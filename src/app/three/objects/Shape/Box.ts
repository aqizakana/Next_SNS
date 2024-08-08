import * as THREE from 'three';
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

export class Box{
    private size: number;
    private position: THREE.Vector3;
    private geometry: THREE.BoxGeometry;
    //private material: THREE.MeshBasicMaterial;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;
    private rotation: THREE.Euler; // Add rotation property
    constructor( size:number,position: THREE.Vector3) {
        this.position = position;
        this.rotation = new THREE.Euler(); // Initialize rotation

        this.geometry = new THREE.BoxGeometry(size, size, size);
        // ShaderMaterialを使用してシェーダーを適用
        this.material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vPosition;
                uniform vec2 u_mouse;
                varying vec2 vUv;
                void main() {
                    vPosition = position;
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
                gl_FragColor = vec4(0.7, color.y, color.x, 1.0);
            }
        `,
            uniforms: {
                time: { value: 0.0 }
            }
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    public addToScene(scene: THREE.Scene) {
        scene.add(this.mesh);
    }
    public update(deltaTime: number) {
        this.material.uniforms.time.value += deltaTime;
    }
}