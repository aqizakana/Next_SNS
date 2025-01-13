precision mediump float;

in vec2 vUv;  
smooth in vec3 vNormal; 
smooth in vec3 vPosition; 
in float vDisplacement;
in float vOpacity;
in float vVertexIndex;


// Uniforms
uniform float u_time;  // Time
uniform float u_PosNegNumber;  // Pos/Neg number
uniform float u_8label;
uniform float u_colorWithScore;  // Label score
uniform float u_opacity;
uniform float u_userID;
uniform float u_ID;
uniform float u_cameraPos;
uniform vec2 u_resolution;

out vec4 fragColor; 



vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // Skewing
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Permutations
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    // Wrap and shuffle
    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
        i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
        i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients
    float n_ = 0.142857142857; // 1/7
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  // mod(p,7*7)
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    // mod(j,N)
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 g0 = vec3(a0.xy, h.x);
    vec3 g1 = vec3(a0.zw, h.y);
    vec3 g2 = vec3(a1.xy, h.z);
    vec3 g3 = vec3(a1.zw, h.w);

    // Normalize gradients
    vec4 norm = inversesqrt(vec4(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
    g0 *= norm.x;
    g1 *= norm.y;
    g2 *= norm.z;
    g3 *= norm.w;

    // Mix contributions
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(g0, x0), dot(g1, x1), dot(g2, x2), dot(g3, x3)));
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
    return fit(smoothMod(position.x * 3.0, position.y * 3.0, position.z ), 0.35, 1.0, 0.0, 1.0);
}

mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float map(float value, float in_min, float in_max, float out_min, float out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

vec4 c(vec3 p) {
  vec4 v =snoise(p * 0.5) + vec4(-2.0 * p.x, -2.0 * p.y, 0.0, 1.0) / (p.x * p.x + p.y + 1.0);
  return vec4(v.xyz, abs(v.w) + 0.001);
}

void main() {
    vec2 uv = vUv;
    vec3 coords = vNormal;
    vec2 p = gl_FragCoord.xy / u_resolution * 2.0 -1.0;
    vec4 permuteValue = permute(vec4(p,uv));
    float coordPattern = wave(coords * sin(u_time * 0.01));
    float uvPattern = wave(vec3(uv,10.0 * sin(u_time * 0.01)));
    float pattern = 0.1 * mix(coordPattern, uvPattern,0.5);


    vec2 center = vec2(0.5, 0.5);
    vec2 delta = vUv - center;
    float angle = atan(delta.y, delta.x);
    float radius = length(delta);
    vec2 rotatedUV = vec2(
        cos(angle) * radius,
        sin(angle) * radius
    ); 
    float rotate2dValue =  rotatedUV.x + rotatedUV.y; 

    vec3 newPos = vPosition.yzx;
    vec4 cValue = vec4(0.0);
    newPos = abs(fract(newPos));
    cValue = c(newPos); 

    vec4 mixValue = 0.1 * mix(permuteValue,cValue, rotate2dValue);

    float originColorNumber = map(u_userID, 0.0, 10.0, 0.0, 1.0);
    float mapPosNegNumber = map(u_PosNegNumber, 2.0, 0.0, 0.0, 1.0);
    float map8Label = map(u_8label,8.0,0.0, 0.0, 1.0); 

    float dynamicEffect =sin(u_time *0.01);
    float noiseValue = snoise(vNormal /originColorNumber * dynamicEffect);   

    vec3 aquaColor = vec3(0.0, 0.9686, 1.0);

    vec3 blueColor = vec3(0.3451, 0.3647, 0.9804);

    float uvPos = dot(vUv, p);
    vec3 mixColor = mix(aquaColor, blueColor, uvPos);
    vec3 feelColor = vec3(1.0);

    if (u_PosNegNumber == 0.0 ) {
        feelColor = aquaColor + mixColor - noiseValue;
    }
    else if(u_PosNegNumber == 1.0) {
        feelColor = mixColor - pattern - noiseValue * 0.1;
    } 
    else {
        feelColor = blueColor - mixValue.xyz * noiseValue;
    }
 

    fragColor = vec4(feelColor, 1.0);
}
