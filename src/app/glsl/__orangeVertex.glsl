precision mediump float;
#define PI 3.1415926535

varying vec2 vUv;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_color;

varying vec3 vNormal;
varying vec3 vPosition;

float smoothMod(float axis, float amp, float rad) {
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

void main() {
    float gradient = mix(0.0, 1.0, vUv.y);
    float interval = 60.0; // 60秒の間隔
    float elapsedTime = mod(u_time, interval); // 経過時間を取得
    float phase = elapsedTime / interval; // 時間に基づくフェーズを計算
    float effectStrength = smoothMod(vPosition.y/2.0, 5.0, 1.0*sin(phase/2.0)); // 形状変化の強さを計算

    // 形を変えるための変形を法線に基づいて行う
    vec3 displacedPosition = vPosition + vNormal * effectStrength ; // 法線方向に10.0の強さで変形


  gl_Position = vec4(displacedPosition, 1.0);
}