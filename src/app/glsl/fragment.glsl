precision mediump float;

// Inputs from the vertex shader
in vec2 vUv;  // UV coordinates
smooth in vec3 vNormal;  // Normal vector
in vec3 vPosition;  // Vertex position
in float vVertexIndex;  // Vertex index
in float vDisplacement;  // Displacement value
in float vOpacity;  // Opacity value

// Uniforms
uniform vec2 u_mouse;  // Mouse position
uniform float u_time;  // Time
uniform float u_PosNegNumber;  // Pos/Neg number
uniform float u_8label;
uniform float u_colorWithScore;  // Label score
uniform float u_opacity;
uniform float u_userID;
uniform float u_ID;

out vec4 fragColor;  // Output color


// Noise functions
float noise(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 0.5453123);
}

float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 perm(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }

float noise_3(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float smoothMod(float axis, float amp, float rad) {
    if (rad == 0.0) return 0.0;  // Zero division prevention
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

mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float map(float value, float in_min, float in_max, float out_min, float out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

void main() {
    vec2 uv = vUv;
    vec3 coords = vNormal;
    coords.z += u_time / 100.0;
    vec3 noisePattern = vec3(noise_3(coords));
    float pattern = wave(noisePattern);

    float originColorNumber = map(u_userID, 0.0, 100.0, 0.0, 1.0);
    float mapPosNegNumber = map(u_PosNegNumber, 3.0, 1.0, 0.0, 1.0);

    // Lighting calculation
    vec3 lightPosition = vec3(0.0902, 0.9412, 0.9569);
    vec3 lightDir = normalize(lightPosition - vNormal);
    vec3 normal = normalize(vNormal);
    float diff = max(dot(normal, lightDir), 0.0);
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 diffuse = lightColor * diff;
    vec3 ambient = lightColor * 0.1;
    vec3 cameraPosition = vec3(0.3098, 0.9725, 0.6314);

    vec3 viewDir = normalize(cameraPosition - vPosition);
    float rimFactor = 1.0 - max(dot(viewDir, vNormal), 0.0);
    vec3 rim = vec3(diffuse) * pow(rimFactor, 5.0) * 0.2;

    float gradient_x = smoothstep(0.0, 1.0, uv.x);
    float gradient_y = smoothstep(0.0, 1.0, uv.y);

    vec3 Color;
    vec3 mixColor;
    vec3 Score = vec3(u_colorWithScore, u_colorWithScore, u_colorWithScore);
    float dynamicEffect = sin(u_time * 0.1 + uv.y * 10.0) * 0.3 + cos(u_time * 0.01 + uv.x * 10.0) * 0.3;

    Color = vec3(originColorNumber, mapPosNegNumber, 0.8);
    float noiseValue = noise_3(vPosition * 0.01);

    Color.x += gradient_x * cos(u_time * 3.141592) * 0.1;
    Color.y += gradient_y * sin(u_time * 3.141592) * 0.1;

    mixColor = mix(Color, Score, vNormal + vUv.y);
    float luminance = dot(Score, vec3(0.9843, 0.5922, 0.5922));
    float glowStrength = 0.5;
    vec3 glow = vec3(1.0, 0.8, 0.3) * pow(luminance, 0.5) * dynamicEffect * glowStrength;

    fragColor = vec4(Color + glow, u_colorWithScore);
}
