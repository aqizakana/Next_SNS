precision mediump float;
#define PI 3.1415926535

varying vec2 vUv;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_color;
uniform float u_opacity;

uniform vec3 lightPosition;
vec3 lightColor = vec3(0.2, 0.1, 1.0);
uniform float intensity;

varying vec3 vNormal;
varying vec3 vPosition;

varying float vVertexIndex;  // attribute ではなく varying として宣言

float smoothMod(float axis, float amp, float rad) {
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

void main() {
    float interval = 60.0; // 60秒の間隔
    float elapsedTime = mod(u_time, interval); // 経過時間を取得
    float phase = elapsedTime / interval; // 時間に基づくフェーズを計算
    float effectStrength = smoothMod(vPosition.y, 1.0, 1.0*sin(phase/2.0)); // 形状変化の強さを計算

    // 形を変えるための変形を法線に基づいて行う
    vec3 displacedPosition = vPosition + vNormal * effectStrength ; // 法線方向に10.0の強さで変形
    
    float gradient = mix(0.5, vUv.y, sin(PI * displacedPosition.z) );

    
    vec3 color = vec3(gradient, 0.5, 0.2); // グラデーションの色を決定
    vec3 orange = vec3(1.0, 0.5, 0.0);
    
      gl_FragColor = vec4(orange * color  , 1.0);
}