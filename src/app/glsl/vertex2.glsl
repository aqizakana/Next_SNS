precision mediump float;

varying vec2 vUv;
uniform vec2 u_mouse; 
uniform float u_time;
    uniform float u_color; 

// 頂点の位置を取得
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
vUv = uv;

gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}