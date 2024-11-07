uniform vec3 color;
uniform float u_time;
varying vec2 vUv;
void main() {

    if ( length( gl_PointCoord - vec2( 0.5, 0.5 ) ) > 0.475 ) discard;

  
    float gradient = vUv.x;
    vec3 localColor = vec3(gradient);
    float noise = sin(vUv.x * 10.0 + u_time) * sin(vUv.y * 10.0 + u_time) * 0.5 + 0.5;
    gl_FragColor = vec4(localColor.x,0.8,1.0  , 1.0 );

}