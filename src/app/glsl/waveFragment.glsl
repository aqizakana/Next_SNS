uniform vec3 color;
uniform float u_time;
varying vec2 vUv;

void main() {
    if (length(gl_PointCoord - vec2(0.5)) > 0.475) discard;

    float gradient = vUv.x;
    vec3 localColor = vec3(0.1294, 0.8824, 1.0);
    vec3 mixColor = mix(localColor, color, gradient);
    float noise = sin(vUv.x * 10.0 + u_time ) * sin(vUv.y * 10.0 + u_time * 0.1) * 0.3 + 0.2;
    float opacity = 0.6;
    // noiseを使用して色をランダム化し、GPU処理を軽量化
    gl_FragColor = vec4(mixColor + noise, opacity);
}
