uniform float size;
uniform float u_time;
varying vec2 vUv;

float rand(float seed) {
    return fract(sin(seed) * 43758.5453123);
}

void main() {
    vUv = uv;

    // 各ポイントにランダムな振幅と周期を生成
    float frequencyX = 2.0 + rand(position.x * 0.1) * 5.0;
    float amplitudeX = 5.0 + rand(position.x * 0.1 + 1.0) * 20.0;
    
    float frequencyY = 2.5 + rand(position.y * 0.1) * 5.0;
    float amplitudeY = 5.0 + rand(position.y * 0.1 + 1.5) * 20.0;

    float frequencyZ = 3.0 + rand(position.z * 0.1) * 5.0;
    float amplitudeZ = 5.0 + rand(position.z * 0.1 + 2.0) * 20.0;

    // 各ポイントの位置にランダムな波を適用し、Z軸方向にも波を加える
    vec3 pos = position;
    
    pos.x += sin(pos.y * frequencyX + u_time * 0.01) * amplitudeX + 1.5;
    pos.y += cos(pos.x * frequencyY + u_time * 0.1) * amplitudeY;
    pos.z += sin(pos.z * frequencyZ + u_time * 0.01) * amplitudeZ * 0.3;
    
    float randNumber = rand(position.x + position.y + position.z);
    // X、Y、Z軸にランダムな波を追加
    pos.x += cos(pos.z * frequencyX + u_time * randNumber * 0.05) * amplitudeX ;
    pos.y += sin(pos.x * frequencyY + u_time *randNumber) * amplitudeY ;
    pos.z += cos(pos.y * frequencyZ + u_time * 0.005) * amplitudeZ * 0.01;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = size * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
