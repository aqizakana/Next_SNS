import * as THREE from 'three';
import { SimplexNoise } from 'three/addons/math/SimplexNoise.js';
const simplexNoise = new SimplexNoise();
const time = Date.now() * 0.1;
const value = simplexNoise.noise(time, 2.5); // x1とy1は任意の数値

export class Circle {
  private radius: number;
  private geometry: THREE.TorusGeometry;
  //private material: THREE.MeshBasicMaterial;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private rotation: THREE.Euler; // Add rotation property

  constructor(radius: number) {
    this.radius = radius;

    this.rotation = new THREE.Euler(); // Initialize rotation

    this.geometry = new THREE.TorusGeometry(this.radius, 0.1, 10, 50);
    //this.material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
    // ShaderMaterialを使用してシェーダーを適用

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
                    float noise = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time) * 0.5 + 0.5;

                    gl_FragColor = vec4(color.x,1.0,1.0,noise);
                }
            `,
      uniforms: {
        time: { value: 0.0 },
      },
      // 他の必要なユニフォームやプロパティを追加
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
  }

  public addToScene(scene: THREE.Scene) {
    scene.add(this.mesh);
  }
  public getMesh(): THREE.Mesh {
    return this.mesh;
  }
  public update() {
    this.mesh.position.y += 0.01;
  }
}
