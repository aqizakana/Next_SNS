uniform float size;
uniform float u_time;

varying vec2 vUv;

 float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }


void main() {
   
      vUv = uv;
      vec2 array = vec2(0.0, 10.0);
    float randomNumber = rand(array);
    vec2 array2 = vec2(50.0, 100.0);
    float randomNumber2 = rand(array2);
   
    vec3 pos = vec3(position.x +randomNumber , position.y + sin(position.x * 10.0 + u_time) * 20.0, position.z);
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

    gl_PointSize = 5.0 * ( 300.0 / - mvPosition.z );
    gl_Position = projectionMatrix * mvPosition;
}
