precision mediump float;

// Vertex Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;
in float vertexIndex;



// Uniforms
uniform mat4 modelViewMatrix;
uniform mat3 normalMatrix; // このuniformを追加
uniform mat4 projectionMatrix;
uniform float u_time;  // Time
uniform float u_PosNegNumber;
uniform float u_colorWithScore;
uniform float u_vertexIndex;
uniform float u_8label;
uniform float u_charCount;



// Outputs to Fragment Shader
out vec2 vUv;
out vec3 vNormal;
out vec3 vPosition;
out float vVertexIndex;
out float vDisplacement;
out float vOpacity;  // Transparency
out vec4 vColor;
out vec4 vColor_2;

// Noise functions (unchanged)
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }



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

float rand(float seed, float delay) {
    return fract((dot(vec2(seed, delay), vec2(12.9898, 78.233))) * 43758.5453);
}

mat2 rotate2d(in float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

void main() {
    vec3 newPosition = position;

    float radius = u_charCount;  // 球の半径を指定
    float distance = length(position);  // 現在の距離
    vec3 direction = normalize(position);  // 原点からの方向ベクトル

    newPosition = direction * radius;

    float noise = sin(u_time - position.x * 5.0 - position.y * 5.0) ;
    newPosition += direction * noise;

    vec3 coords = normal;
    coords.y += sin(u_time / 10.0);
    coords.x += cos(u_time / 10.0);

    vDisplacement = wave(coords);
    float Dis = wave(position);
    vNormal = normalize(normalMatrix * normal);
    
    // Math 2D Transformations
    float angle = 90.0;  // 回転速度
    mat2 rotationMatrix = rotate2d(angle);
    newPosition.xz += rotationMatrix * newPosition.xz;  // xz 平面で回転

    float objectDelay = rand(vertexIndex, u_time);
    float floating_x = 0.05 * vertexIndex * cos(u_time);
    float floating_y = 10.0 * sin(u_time);
    float floating_z = 0.05 * vertexIndex * sin(u_time);

    //newPosition.x += floating_x;
    newPosition.y += floating_y;
    //newPosition.z += floating_z;
 
    vec3 mixPos = mix(position, newPosition, Dis);

    // Outputs
    gl_Position = projectionMatrix * modelViewMatrix * vec4(mixPos, 1.0);
    vUv = uv;
    vVertexIndex = vertexIndex;
    vNormal = normalize(newPosition);  // 法線を更新
    vPosition = newPosition;  // 変形後の位置
}