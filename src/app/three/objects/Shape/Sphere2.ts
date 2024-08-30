import * as THREE from 'three';

export class Sphere2 {
    private geometry: THREE.SphereGeometry;
    private material: THREE.ShaderMaterial;
    private mesh: THREE.Mesh;

    constructor() {
        this.geometry = new THREE.SphereGeometry(150, 64, 64);
        this.material = new THREE.ShaderMaterial({
            vertexShader: `
            //vUvとはフラグメントシェーダーでのuv座標
            //varyingは頂点シェーダーからフラグメントシェーダーに値を渡すためのもの
            varying vec2 vUv;

            //頂点の位置を取得
            varying vec3 vNormal;
            varying vec3 vPosition;

                void main() {
                 //uv座標を頂点シェーダーに渡す
                   vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
fragmentShader: `
precision mediump float;

//vUvはフラグメントシェーダーでのuv座標
varying vec2 vUv;

varying vec3 vNormal;
varying vec3 vPosition;
const vec3 lightPosition = vec3(200.0, 200.0, 200.0);
const vec3 lightColor = vec3(1.0, 1.0, 1.0);

//カメラの位置を取得

//ノイズ関数
float noise(vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
//照明計算
vec3 lightDir = normalize(lightPosition - vPosition);
vec3 normal = normalize(vNormal);   
float diff = max(dot(normal,lightDir),0.0);
vec3 diffuse = lightColor * diff;   
vec3 ambient = lightColor * 0.1;   

// リムライティング
vec3 viewDir = normalize(cameraPosition - vPosition);
float rimFactor = 1.0 - max(dot(viewDir, normal), 0.0);
vec3 rim = vec3(1.0, 0.5, 0.8) * pow(rimFactor, 5.0) * 1.0;


//グラデーションの方向を決める
float gradient = vUv.y;
// オレンジと青の色味を決める
vec3 blueColor = vec3(0.3, 0.3, 1.0);
vec3 orangeColor = vec3(1.0, 0.5, 0.0);

//ノイズ関数を使ってグラデーションの色を決める
float noiseValue = noise(vUv * 10.0);


//グラデーションの色を決める
vec3 finalColor = mix(orangeColor, blueColor, gradient);
//finalColor += noiseValue;
//finalColor = finalColor * (diffuse);
finalColor = finalColor * (diffuse) ;

// 輝度効果
float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));

float glowStrength = 5.0;
vec3 glow = vec3(1.0, 0.7, 0.3) * pow(luminance, 3.0) * glowStrength;   


gl_FragColor = vec4(finalColor + glow, 1.0);
}
            `,
            uniforms: {
                time: { value: 0.0 },
                mouse: { value: new THREE.Vector2(0, 0) },
               
               
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
    public updateTime(time: number) {
        this.material.uniforms.time.value = time;
    }

    public updateMousePosition(x: number, y: number) {
        this.material.uniforms.mouse.value.set(x, y);
    }
}

export default Sphere2;
