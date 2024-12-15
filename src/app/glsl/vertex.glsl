precision mediump float;

// Vertex Attributes
in vec3 position;
in vec3 normal;
in vec2 uv;
in float vertexIndex;

// Instance Matrix (if used)
uniform mat4 instanceMatrix;

// Uniforms
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 u_mouse;  // Mouse position
uniform float u_time;  // Time
uniform float cutoffX;
uniform float cutoffZ;
uniform float u_PosNegNumber;
uniform float u_colorWithScore;
uniform float u_vertexIndex;

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

    vec3 coords = normal;
    coords.y += sin(u_time / 10.0);
    coords.x += cos(u_time / 10.0);

    vNormal = normal;

    // Math 2D Transformations
    float angle = u_time * 0.1;
    mat2 rotationMatrix = rotate2d(angle);
    vec2 rotatedPosition = rotationMatrix * position.xz;
    float floating_z = rotatedPosition.y;

    float objectDelay = rand(vertexIndex, u_time);
    float floating_x = 0.005 * vertexIndex * cos(u_time * 3.141592);
    float floating_y = 20.0 * sin(u_time * 3.141592 );

    newPosition.x += floating_x;

    // Outputs
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
    vVertexIndex = vertexIndex;

    vPosition = position;
}