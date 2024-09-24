precision mediump float;

varying vec2 vUv;
varying vec4 vColor;
varying vec4 vColor_2;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vVertexIndex;  // attribute ではなく varying として宣言
varying float vDisplacement;
varying float vOpacity; // 頂点シェーダーから受け取る透明度

uniform vec2 u_mouse;
uniform float u_time;
uniform float u_opacity;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform float intensity;
uniform vec3 baseColor;
uniform float glowStrength;

#define PI 3.1415926535



//ノイズ関数
float noise(vec2 st) {
return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 0.5453123);
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise_3(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

/* 
* SMOOTH MOD
* - authored by @charstiles -
* based on https://math.stackexchange.com/questions/2491494/does-there-exist-a-smooth-approximation-of-x-bmod-y
* (axis) input axis to modify
* (amp) amplitude of each edge/tip
* (rad) radius of each edge/tip
* returns => smooth edges
*/

float smoothMod(float axis, float amp, float rad){
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

float fit (float unscaled,float originalMin,float originalMax, float minAllowed,float maxAllowed){
    return (maxAllowed - minAllowed) * (unscaled - originalMin) / (originalMax - originalMin) + minAllowed;
}

float wave (vec3 position) {
    return fit(smoothMod(position.y *6.0,1.0,1.5),0.35,0.6,0.0,1.0);
}

void main() {
vec2 uv = vUv;
uv.y += u_time / 10.0;
vec3 coords = vNormal;
coords.y += u_time/10.0;
vec3 noisePattern = vec3(noise_3(coords));
float pattern = wave(noisePattern);



//照明計算

vec3 lightDir = normalize(lightPosition - vPosition);
vec3 normal = normalize(vNormal);   
float diff = max(dot(normal,lightDir),0.0);
vec3 diffuse = lightColor * diff;   
vec3 ambient = lightColor * 0.1;   

// リムライティング
vec3 viewDir = normalize(cameraPosition - vPosition);
float rimFactor = 1.0 - max(dot(viewDir, normal), 0.0);
vec3 rim = vec3(0.0, 0.0, 0.0) * pow(rimFactor, 5.0) * 1.0;

//グラデーションの方向を決める
float gradient = uv.y;
// オレンジと青の色味を決める
vec3 blueColor = vec3(0.2745, 0.3647, 0.9412);
vec3 orangeColor = vec3(0.3961, 0.2039, 0.9216);

//ノイズ関数を使ってグラデーションの色を決める
float noiseValue = noise(uv * 10.0);



// 時間に基づく動的な効果
float dynamicEffect = sin( 0.5  + uv.y * 10.0) * 0.5 + 0.5;

vec3 finalColor = mix(orangeColor, blueColor, vDisplacement);
finalColor += vec3(noiseValue * 0.1) + rim;
//finalColor *= mouseEffect;



// 輝度効果
float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));

float glowStrength = 0.1;
vec3 glow = vec3(1.0, 0.7, 0.3) * pow(luminance, 3.0) * glowStrength;   


vec3 COLRO = vDisplacement +vec3(noise(uv * 8.0) * 0.1) + glow + rim;
gl_FragColor = vec4(finalColor - 0.5*COLRO, 1.0);
//gl_FragColor = vec4(vec3(COLRO),  u_opacity);
}