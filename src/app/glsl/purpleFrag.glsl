precision mediump float;

varying vec2 vUv;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_color;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
  vec3 finalColor = vec3(0.7412, 0.102, 0.9373);
  finalColor = vec3(vUv.x, vUv.y, 0.0);
gl_FragColor = vec4(finalColor, 1.0);
}