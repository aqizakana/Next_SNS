//嬉しいに該当するフラグメントシェーダー
precision mediump float;

varying vec2 vUv;//vUvとはフラグメントシェーダーでのuv座標。uv座標とはテクスチャの座標を指定するためのもの、0.0から1.0の範囲で指定する
varying vec3 vNormal;//vNormalは頂点シェーダーからフラグメントシェーダーに渡す法線ベクトル
varying vec3 vPosition;//vPositionは頂点シェーダーからフラグメントシェーダーに渡す頂点の位置
varying float vVertexIndex; // 頂点インデックスを受け取る
varying float vDisplacement;//vDisplacementは頂点シェーダーからフラグメントシェーダーに渡す変位量
varying float vOpacity; // 頂点シェーダーから受け取る透明度

uniform vec2 u_mouse;//マウスの位置
uniform float u_time;//経過時間
uniform float u_8label;//8labelの値
uniform float u_colorWithScore;//8labelのスコア
uniform float u_opacity;

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

/* Math 2D Transformations */
mat2 rotate2d(in float angle){
    return mat2(cos(angle),-sin(angle), sin(angle), cos(angle));
}

void main() {
    vec2 uv = vUv;
    vec3 coords = vNormal;
    coords.z += u_time/100.0;
    vec3 noisePattern = vec3(noise_3(coords));
    float pattern = wave(noisePattern);

    //照明計算
    vec3 lightPosition = vec3(0.0902, 0.9412, 0.9569);
    vec3 lightDir = normalize(lightPosition - vNormal);
    vec3 normal = normalize(vNormal);   
    float diff = max(dot(normal,lightDir),0.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 diffuse = lightColor * diff;   
    vec3 ambient = lightColor * 0.1;   
    vec3 cameraPosition = vec3(0.3098, 0.9725, 0.6314);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    float rimFactor = 1.0 - max(dot(viewDir, vNormal), 0.0);
    vec3 rim = vec3(diffuse) * pow(rimFactor, 5.0) * 0.2;

    float gradient_x = smoothstep(0.0, 1.0, uv.x);
    float gradient_y = smoothstep(0.0, 1.0, uv.y);
    float _8label = u_8label;
    vec3 Color;
    vec3 mixColor;
    vec3 Score = vec3(u_colorWithScore, u_colorWithScore , u_colorWithScore );
    float dynamicEffect = sin( u_time * 0.1  + uv.y * 10.0) * 0.3 +cos (u_time * 0.01 + uv.x * 10.0) * 0.3;

if (_8label > 1.5) {
    Color = vec3(0.1451, 1.0, 0.9569);
    mixColor = mix(Color, Score, gradient_x *  cos(u_time * 0.1 *PI ));

} else {
    Color = vec3(1.0, 0.7804, 0.0667);
    mixColor = mix(Color, Score, gradient_y *  sin(u_time * 0.1 *PI ));

}
    float noiseValue = noise(uv * 0.01) ;
    float luminance = dot(Score, vec3(0.9843, 0.5922, 0.5922));
    float glowStrength = 0.5;
    vec3 glow = vec3(1.0, 0.8, 0.3) * pow(luminance, 0.5) * dynamicEffect * glowStrength;   
    gl_FragColor = vec4(mixColor /( 1.0 + noiseValue)  + glow, u_opacity); 

}