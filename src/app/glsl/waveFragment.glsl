precision highp float;

uniform float u_time;
in vec2 vUv;
out vec4 fragColor; // デフォルトの出力位置 (location = 0)

void main() {
    if (length(gl_PointCoord - vec2(0.5)) > 0.475) discard;

    float gradient = vUv.x;
    vec3 localColor = vec3(0.1294, 0.8824, 1.0);
    float noise = sin(vUv.x * 10.0 + u_time ) * sin(vUv.y * 10.0 + u_time * 0.1) * 0.3 + 0.2;
    float opacity = 0.6;

    // noiseを使用して色をランダム化
    vec3 mixColor = mix(localColor, localColor * noise, gradient);

    // 出力する色と透明度
    fragColor = vec4(mixColor, opacity);
}
