precision mediump float;

varying vec2 vUv;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_color;

varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;



void main() {

  vec3 finalColor = vec3(0.7882, 0.4588, 0.0);

  finalColor.y +=  vNormal.y;
  gl_FragColor = vec4(finalColor, 1.0);
}