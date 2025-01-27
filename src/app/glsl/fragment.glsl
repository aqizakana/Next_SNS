precision highp float;

in vec2 vUv;  
smooth in vec3 vNormal; 
smooth in vec3 vPosition; 
in float vDisplacement;
in float vVertexIndex;


// Uniforms
uniform float u_time;  // Time
uniform float u_PosNegNumber;  // Pos/Neg number
uniform float u_8label;
uniform float u_colorWithScore;  // Label score
uniform vec2 u_resolution;

out vec4 fragColor; 



// Noise functions (unchanged)
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}


float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f*f*(3.0-2.0*f);
    return mix(mix(hash(i + vec2(0.0,0.0)), 
                   hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), 
                   hash(i + vec2(1.0,1.0)), u.x), u.y);
}

mat2 rotate2d(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.1;
    for(int i = 0; i < 4; i++) {
        value += amplitude * noise(p);
        p *= 2.0;
        amplitude *= 0.5;
    }
    return value;
}

vec3 palette(float t) {
    vec3 a = vec3(0.0, 0.9686, 1.0);
    vec3 b = vec3(0.3451, 0.3647, 0.9804);
    vec3 c = vec3(1.0, 1.0, 1.0);
    vec3 d = vec3(0.0314, 0.6078, 0.4941);
    return a + b * cos(6.28318 * (c * t + d));
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

uvec3 k = uvec3(0x456789abu, 0x6789ab45u, 0x89ab4567u);
uvec3 u = uvec3(1, 2, 3);
const uint UINT_MAX = 0xffffffffu;

uvec3 uhash33(uvec3 n) {
    n ^= (n.yzx << u);
    n ^= (n.yzx >> u);
    n *= k;
    n ^= (n.yzx << u);
    return n * k;
}

float hash31(vec3 p) {
    uvec3 n = floatBitsToUint(p);
    return float(uhash33(n).x) / float(UINT_MAX);
}

void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float time = u_time * 0.1;

vec2 distortedUV = vec2(
        uv.x + sin(uv.y * 5.0 + time) * 0.1,
        uv.y + cos(uv.x * 5.0 + time) * 0.1
    );
    float fbm1 = fbm(distortedUV * 3.0 + time + noise(vec2(distortedUV)));
    float fbm2 = fbm(distortedUV * 5.0 - time + noise(vec2(distortedUV)));
    float fbm3 = fbm(distortedUV * 7.0 + time * 0.5);
    float pattern = (fbm1 * 2.0 + fbm2 * 1.0 + fbm3 * 3.0);

    vec2 center = vec2(0.5, 0.5);
    vec2 delta = vUv - center;
    float angle = atan(delta.y, delta.x);
    float radius = length(delta);
    vec2 rotatedUV = vec2(
        cos(angle + pow(time,0.5)) * radius,
        sin(angle + pow(time,0.5)) * radius
    ); 
    float rotate2dValue =  rotatedUV.x + rotatedUV.y; 

    float depth = length(vPosition) * 0.1;
    float alpha = smoothstep(0.5, 1.0, 1.0 - depth);
    vec3 coords = vNormal;
    coords.x += rotatedUV.x;
    coords.y += rotatedUV.y;
    
    float noise3D = hash31(coords);
    float noiseValue = snoise(coords + time);

     // 感情タイプに基づく色の選択
    vec3 baseColor;
    if(u_PosNegNumber == 0.0) {  // Positive
        baseColor = vec3(0.0, 0.9686, 1.0);
    } else if(u_PosNegNumber == 1.0) {  // Neutral
        baseColor = vec3(0.1255, 0.7647, 0.498)   - (noise3D + noiseValue)  * 0.3;
    } else {  // Negative
        baseColor = vec3(0.2431, 0.098, 0.8235) - noiseValue *0.5;
    }
    vec3 finalColor = palette(pattern) * baseColor;
    

    float edge = pow(1.0 - length(uv), 4.0);
    finalColor += vec3(0.8863, 0.3725, 0.0745) * edge * 5.0;
    if(u_PosNegNumber == 0.0) {
        fragColor = vec4(vec3(0.0, 0.9686, 1.0) +  vec3(0.8863, 0.3725, 0.0745) * edge * 5.0 ,1.0) ;
    }else{
    fragColor = vec4(finalColor, 1.0);
    }

}
