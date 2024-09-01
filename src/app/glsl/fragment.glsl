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