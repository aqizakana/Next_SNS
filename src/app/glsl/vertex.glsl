precision highp float;

// Uniforms
uniform float u_time;  // Time
uniform float u_PosNegNumber;
uniform float u_colorWithScore;
uniform float u_8label;
uniform float u_charCount;
uniform vec2 u_resolution;

// Outputs to Fragment Shader
in float vertexIndex;
out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out float vVertexIndex;
out float vDisplacement;
out float vOpacity;  // Transparency
out vec4 vColor;
out vec4 vColor_2;
out vec3 vCoords;

float smoothMod(float axis, float amp, float rad) {
    float top = cos(3.141592 * (axis / amp)) * sin(3.141592 * (axis / amp));
    float bottom = pow(sin(3.141592 * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / 3.141592) * at;
}

float fit(float unscaled, float originalMin, float originalMax, float minAllowed, float maxAllowed) {
    return (maxAllowed - minAllowed) * (unscaled - originalMin) / (originalMax - originalMin) + minAllowed;
}

float wave(vec3 position) {
    return fit(smoothMod(position.y * 6.0, 1.0, 1.5), 0.35, 0.6, 0.0, 1.0);
}

float random(vec3 seed) {
    return fract(sin(dot(seed, vec3(12.9898, 78.233, 45.164))) * 43758.5453123);
}

vec3 getWaveDisplacement(vec3 position, float time) {
    float noise = random(position + vec3(pow((time * 0.1),2.0)));

    float waveX = sin(position.x * 2.0 + noise * 100.0);
    float waveY = sin(position.y * 3.0 + noise);
    float waveZ = sin(position.z * 2.5 + noise);

    return vec3(waveX, waveY, waveZ);
}

void main() {
    vec3 newPosition = position;

    // 水中でゆっくり揺れるような表現を追加
    vec3 waveDisplacement = getWaveDisplacement(newPosition, u_time *10.0 );
    newPosition += waveDisplacement;

    vec3 coords = normal;
    coords.y += fract(sin(u_time));
    coords.x += cos(u_time);
    vDisplacement = wave(coords);

    // Outputs
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
    vNormal = normalize(newPosition);  // 法線を更新
    vPosition = newPosition;  // 変形後の位置
    vCoords = coords;
    vVertexIndex = vertexIndex;
}