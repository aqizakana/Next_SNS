precision mediump float;


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

float noise(vec2 uv)
            {
                float seed = dot(uv, vec2(501.0, 601.0));
                return fract(sin(seed) * 6000.0);
            }


vec3 field(vec3 p) {
  p *= 0.1;
  float f = 0.1;
  for (int i = 0; i < 3; i++) {
    p = p.yzx;
    p = abs(fract(p) - 0.5);
    p *= 3.0;
    f *= 3.0;
  }
  p *= p;
  return sqrt(p + p.yzx) / f - 0.3;
}

void main() {
    vec3 newPosition = position;

    float radius = u_charCount;  // 球の半径を指定
    newPosition = position;

    vec2 center = vec2(0.5, 0.5);
    vec2 delta = vUv - center;
    float angle = atan(delta.y, delta.x);
    float radiusFromCenter = length(delta);

    vec2 rotatedUV = vec2(
        cos(angle * pow(u_time,0.2)) * radiusFromCenter,
        sin(angle * pow(u_time,0.2)) * radiusFromCenter
    );

    float noiseValue = noise(rotatedUV);

    vec3 coords = normal;
    coords.y += sin(u_time / 10.0);
    coords.x += cos(u_time / 10.0);

    float a = dot(coords.xy, rotatedUV.xy);

    vDisplacement = wave(coords);
    float Dis = wave(position);
    vNormal = normalize(normalMatrix * normal);

    vec3 displacedPosition = position + normal * vDisplacement;
    
    // Math 2D Transformations
    mat2 rotationMatrix = rotate2d(angle);
    
    float flaoting_y = exp(sin(u_time*0.8) / 50.0) * vertexIndex;
    newPosition.y -= normal.y * flaoting_y;


    // Outputs
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    vUv = uv;
    vNormal = normalize(newPosition);  // 法線を更新
    vPosition = newPosition;  // 変形後の位置
    vCoords = coords;
    vVertexIndex = vertexIndex;
}