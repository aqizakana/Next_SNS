import * as THREE from "three";

export class Sphere3 {
	/* private geometry: THREE.IcosahedronGeometry; */
	private geometry: THREE.TorusGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;
	private camera: THREE.Camera;

	constructor(opacity: number) {
		this.camera = new THREE.Camera();
		this.geometry = new THREE.TorusGeometry(10, 10, 10, 16);
		const vertexIndices = new Float32Array(
			this.geometry.attributes.position.count,
		);
		for (let i = 0; i < vertexIndices.length; i++) {
			vertexIndices[i] = i;
		}
		this.geometry.setAttribute(
			"vertexIndex",
			new THREE.BufferAttribute(vertexIndices, 1),
		);
		this.material = new THREE.ShaderMaterial({
			vertexShader: `
            precision mediump float;
            //vUvとはフラグメントシェーダーでのuv座標
            //varyingは頂点シェーダーからフラグメントシェーダーに値を渡すためのもの
            varying vec2 vUv;
            varying float vDisplacement;
            varying float vOpacity; // フラグメントシェーダーに渡す透明度

            uniform vec2 mouse;
            uniform float time;
            uniform float cutoffX; // カットオフするX座標の値
            uniform float cutoffZ;

            //インスタンス行列
            attribute mat4 instanceMatrix;

            //ライト方向
            uniform vec3 lightDirection;

            varying vec4 vColor; 
            varying vec4 vColor_2;
            varying vec3 vNormal;
            varying vec3 vPosition;

            attribute float vertexIndex;  // 頂点インデックスを追加
            varying float vVertexIndex;  // attribute ではなく varying として宣言
            #define PI 3.1415926535

           
            vec2 random2(vec2 p) {
                return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
            }

            float voronoi(vec2 x) {
                vec2 n = floor(x);
                vec2 f = fract(x);
                float m = 8.0;
                for(int j=-1; j<=1; j++)
                for(int i=-1; i<=1; i++) {
                    vec2 g = vec2(float(i),float(j));
                    vec2 o = random2(n + g);
                    o = 0.5 + 0.5*sin(time + 6.2831*o);
                    vec2 r = g + o - f;
                    float d = dot(r,r);
                    m = min(m, d);
                }
                return sqrt(m);
            }

            
            //	Classic Perlin 3D Noise 
//	by Stefan Gustavson
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float noise(vec3 P){
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}
/* 
* SMOOTH MOD
* - authored by @charstiles -
* based on https://math.stackexchange.com/questions/2491494/does-there-exist-a-smooth-approximation-of-x-bmod-y
* (axis) input axis to modify
* (amp) amplitude of each edge/tip
* (rad) radius of each edge/tip
* returns => smooth edges
*/

float smoothMod(float axis, float amp, float rad){
    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
    float at = atan(top / bottom);
    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
}

float fit(float unscaled, float originalMin, float originalMax, float minAllowed, float maxAllowed) {
  return (maxAllowed - minAllowed) * (unscaled - originalMin) / (originalMax - originalMin) + minAllowed;
}

float wave(vec3 position) {
  return fit(smoothMod(position.y * 6.0, 1.0, 1.5), 0.35, 0.6, 0.0, 1.0);
}

                void main() {
                 //uv座標を頂点シェーダーに渡す
                 vVertexIndex = vertexIndex;
                    vec3 coords =normal;
                    coords.y += time/10.0;
                    vec3 noisePattern = vec3(noise(coords));
                    float pattern = wave(noisePattern);
                    vDisplacement = pattern ;


                    vec3 newPosition = position;
                    vNormal = normal;
                    vUv = uv;
                    vPosition = position;
                    float v = voronoi(newPosition.xy *0.1);

                    float distanceToMouse = distance(newPosition.xy, mouse * 2.0 - 1.0);
                    float influence = smoothstep(1.0, 0.0, distanceToMouse);

                    // インスタンス固有の変換を適用
                    vec4 instancePosition = instanceMatrix * vec4(position, 1.0);

                    //法線
                    vec3 worldNormal = normalize(normalMatrix * normal);
                    /* vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz; */

                    // 変換された法線を使用して照明計算などを行う
                    float lightIntensity = dot(worldNormal, lightDirection);

                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    worldPosition.xy += (sin(time) * 100.0 - worldPosition.xy) * influence * 0.1;

                    // 時間に基づいて揺らぎを追加
                    vec4 viewPosition = viewMatrix * worldPosition;
                    
                    float displacement = vDisplacement / 3.0;
                    vec3 newPosition_2 = position + normal * (vDisplacement* 100.0);
                    //newPosition_2.xy += (sin(time) * 100.0 - newPosition_2.xy) * influence * 0.1;
                    /* if(mod(vertexIndex,10.0) == 0.0){
                        newPosition_2.x += smoothMod(sin(time  + newPosition_2.y * 0.5) * 100.0 * (0.5)+v,,);
                        newPosition_2.y += smoothMod(cos(time  + newPosition_2.x * 0.5) * 100.0 * (0.5)+v,1.0,1.0);
                        newPosition_2.z += smoothMod(sin(time + newPosition_2.x * 0.5) * 100.0 * (0.5)+v,1.0,1.0);
                    } */


                    /* float twist = sin(newPosition_2.y * 0.1 + time);
                    float cosTheta = cos(twist);
                    float sinTheta = sin(twist);
                    newPosition_2.x = newPosition_2.x * cosTheta - newPosition_2.z * sinTheta;
                    newPosition_2.z = newPosition_2.x * sinTheta + newPosition_2.z * cosTheta;  */

                   
                    vOpacity = 1.0 - smoothstep(cutoffZ - 0.3, cutoffZ, newPosition_2.x);
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition_2, 1.0);
                    
                    
                    //gl_Position = projectedPosition;
                    vColor = vec4(lightIntensity, lightIntensity, lightIntensity, 1.0);
                    vColor_2 = vec4(instanceMatrix[3].xyz, 1.0); // 位置情報を色として使用
                }
            `,
			fragmentShader: `
                precision mediump float;

                varying vec2 vUv;
                varying vec4 vColor;
                varying vec4 vColor_2;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying float vVertexIndex;  // attribute ではなく varying として宣言
                varying float vDisplacement;
                varying float vOpacity; // 頂点シェーダーから受け取る透明度

                uniform vec2 mouse;
                uniform float time;
                uniform float opacity;
               
                uniform vec3 lightPosition;
                uniform vec3 lightColor;
                uniform float intensity;
                uniform vec3 baseColor;
                uniform float glowStrength;

                #define PI 3.1415926535

              

                //ノイズ関数
                float noise(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 0.5453123);
                }
                
                float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
                vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
                vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

                float noise_3(vec3 p){
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

                /* 
                * SMOOTH MOD
                * - authored by @charstiles -
                * based on https://math.stackexchange.com/questions/2491494/does-there-exist-a-smooth-approximation-of-x-bmod-y
                * (axis) input axis to modify
                * (amp) amplitude of each edge/tip
                * (rad) radius of each edge/tip
                * returns => smooth edges
                */

                float smoothMod(float axis, float amp, float rad){
                    float top = cos(PI * (axis / amp)) * sin(PI * (axis / amp));
                    float bottom = pow(sin(PI * (axis / amp)), 2.0) + pow(rad, 2.0);
                    float at = atan(top / bottom);
                    return amp * (1.0 / 2.0) - (1.0 / PI) * at;
                }

                float fit (float unscaled,float originalMin,float originalMax, float minAllowed,float maxAllowed){
                    return (maxAllowed - minAllowed) * (unscaled - originalMin) / (originalMax - originalMin) + minAllowed;
                }

                float wave (vec3 position) {
                    return fit(smoothMod(position.y *6.0,1.0,1.5),0.35,0.6,0.0,1.0);
                }

                void main() {
                vec2 uv = vUv;
                uv.y += time / 10.0;
                vec3 coords = vNormal;
                coords.y += time/10.0;
                vec3 noisePattern = vec3(noise_3(coords));
                float pattern = wave(noisePattern);



                //照明計算

                vec3 lightDir = normalize(lightPosition - vPosition);
                vec3 normal = normalize(vNormal);   
                float diff = max(dot(normal,lightDir),0.0);
                vec3 diffuse = lightColor * diff;   
                vec3 ambient = lightColor * 0.1;   

                // リムライティング
                vec3 viewDir = normalize(cameraPosition - vPosition);
                float rimFactor = 1.0 - max(dot(viewDir, normal), 0.0);
                vec3 rim = vec3(0.0, 0.0, 0.0) * pow(rimFactor, 5.0) * 1.0;

                //グラデーションの方向を決める
                float gradient = uv.y;
                // オレンジと青の色味を決める
                vec3 blueColor = vec3(0.8, 0.3, 0.1);
                vec3 orangeColor = vec3(1.0, 0.5, 0.0);

                //ノイズ関数を使ってグラデーションの色を決める
                float noiseValue = noise(uv * 10.0);

                
                
                // 時間に基づく動的な効果
                float dynamicEffect = sin( 0.5  + uv.y * 10.0) * 0.5 + 0.5;

                vec3 finalColor = mix(orangeColor, blueColor, vDisplacement);
                finalColor += vec3(noiseValue * 0.1) + rim;
                //finalColor *= mouseEffect;
                
                

                // 輝度効果
                float luminance = dot(finalColor, vec3(0.299, 0.587, 0.114));

                float glowStrength = 0.1;
                vec3 glow = vec3(1.0, 0.7, 0.3) * pow(luminance, 3.0) * glowStrength;   


                vec3 COLRO = vDisplacement +vec3(noise(uv * 8.0) * 0.1) + glow + rim;
                gl_FragColor = vec4(finalColor + glow + rim, opacity);
                //gl_FragColor = vec4(vec3(COLRO),  opacity);
                }
            `,
			uniforms: {
				mouse: { value: new THREE.Vector2() },
				time: { value: 0 },
				cameraPosition: { value: this.camera.position },
				lightPosition: { value: new THREE.Vector3(5, 5, 5) },
				lightColor: { value: new THREE.Color(0.5, 0.5, 0.5) },
				intensity: { value: 1.0 },
				baseColor: { value: new THREE.Color(0.8, 0.8, 0.3) },
				glowStrength: { value: 1.0 },
				opacity: { value: 0.1 },
				cutoffX: { value: 0.1 },
				cutoffZ: { value: 0.1 },
			},
			transparent: true,
			//side: THREE.BackSide, // 内側から見えるように
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
		this.mesh.position.set(0, 0, 0);
		/*  this.mesh.scale.x *= 5;
         this.mesh.scale.y *= 5; */
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}
}

export default Sphere3;
