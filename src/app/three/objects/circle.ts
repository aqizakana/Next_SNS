import * as THREE from 'three';
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

export class Circle {
    private radius: number;
    private position: THREE.Vector3;
    private geometry: THREE.TorusGeometry;
    private material: THREE.MeshBasicMaterial;
    //private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;
    private rotation: THREE.Euler; // Add rotation property

    constructor(radius: number, position: THREE.Vector3) {
        this.radius = radius;
        this.position = position;
        this.rotation = new THREE.Euler(); // Initialize rotation

        this.geometry = new THREE.TorusGeometry(this.radius,0.1, 10, 50);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
         // ShaderMaterialを使用してシェーダーを適用

         /* this.material = new THREE.ShaderMaterial({
            vertexShader: `
                varying vec3 vPosition;
                uniform vec2 u_resolution;  // 画面の解像度
                void main() {
                    vPosition = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec2 u_resolution;  // 画面の解像度
                uniform vec2 u_mouse;       // マウスの座標
                uniform float u_time; 
                // HSBをRGBに変換する関数。イディオムとして扱えれば充分
                vec3 hsb2rgb(in vec3 c) {
                    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
                    rgb = rgb * rgb * (3.0 - 2.0 * rgb);
                    return c.z * mix(vec3(1.0), rgb, c.y);
                }

                void main(void) {
                    // 画面中心で座標を正規化
                    vec2 position = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / max(u_resolution.x, u_resolution.y);
                    
                    // 座標のベクトル長を数値として取得
                    float l = length(position);
                    
                    // HSBとして色にする
                    vec3 HSB = vec3(l - u_time, 0.9, 1.0);
                    
                    // HSBをRGBに変換する
                    vec3 color = hsb2rgb(HSB);
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            // 他の必要なユニフォームやプロパティを追加
        }); */

        this.mesh = new THREE.Mesh(this.geometry, this.material);

    }

    public addToScene(scene: THREE.Scene) {
        scene.add(this.mesh);
    }
}

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
                void main() {
                    vPosition = position;
                  
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                  
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 u_resolution;  // 画面の解像度
                varying vec3 vPosition;
                void main() {
                    vec2 uv = (gl_FragCoord.xy / u_resolution.xy);
                    float greenValue = abs(sin(time + vPosition.y));
                    gl_FragColor = vec4(0.0, greenValue, 0.0, 1.0);
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