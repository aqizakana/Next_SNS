//vUvとはフラグメントシェーダーでのuv座標
//varyingは頂点シェーダーからフラグメントシェーダーに値を渡すためのもの
precision mediump float;
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