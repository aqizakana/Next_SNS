precision mediump float;

varying vec2 vUv;
uniform vec2 u_mouse; 
uniform float u_time;
uniform float u_color; // 色はvec3に変更

// 頂点の位置を取得
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
    // uv座標をフラグメントシェーダーに渡す
    //4
    vUv = uv;

    // 法線と頂点位置の計算
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    
    // 最終的な位置を計算
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
