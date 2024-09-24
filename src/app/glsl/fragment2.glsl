precision mediump float;

    varying vec2 vUv;
    uniform vec2 u_mouse;
    uniform float u_time;
    uniform float u_color; 

    // 2D Random
    float random (in vec2 st) {
        return fract(sin(dot(st.xy,
                                vec2(12.9898,78.233)))
                        * 43758.5453123);
    }

    // 2D Noise based on Morgan McGuire @morgan3d
    // https://www.shadertoy.com/view/4dS3Wd
    float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation
        vec2 u = f * f * (3.0 - 2.0 * f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }

    void main() {
        // Convert UV coordinates to a range of [0, 1] for the gradient
        float gradient = vUv.x;

        // Create the base color
        vec3 color = vec3(gradient);

        // Generate noise
        float n = noise(vec2(u_color,u_color) * 10.0 + u_time * 0.001);

        // Mix the base color with the noise
        color = mix(color, vec3(n), 0.3);

        gl_FragColor = vec4(color, 1.0);
    }