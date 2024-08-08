import * as THREE from 'three';

export class Background {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public sizes: { width: number; height: number; };
  public renderer: THREE.WebGLRenderer;
  private geometry: THREE.PlaneGeometry;
  private material: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;

  constructor() {
    this.scene = new THREE.Scene();

    this.sizes = {
      width: window.innerWidth * 0.9,
      height: window.innerHeight,
    }
    this.camera = new THREE.PerspectiveCamera(
      100,
      this.sizes.width*0.9 / this.sizes.height,
      10,
      2000
    )
    this.camera.position.set(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    })
    this.updateRendererSize();

    this.geometry = new THREE.PlaneGeometry(100, 300, 300);
    this.material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        uniform float u_time;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        varying vec2 vUv;

        void main() {
            vec2 uv = vUv;
            vec3 color1 = vec3(0.1, 0.2, 0.3);
            vec3 color2 = vec3(0.5, 0.7, 0.9);
            
            float noise = sin(uv.x * 10.0 + u_time) * sin(uv.y * 10.0 + u_time) * 0.5 + 0.5;
            
            vec3 color = mix(color1, color2, noise);
            
            gl_FragColor = vec4(color, sin(u_time));
        }
      `,
      uniforms: {
        u_time: { value: 0 }
      }
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.set(0, 0, 0)
    //this.scene.add(this.mesh);

    // リサイズイベントリスナーを追加
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private updateRendererSize() {
    this.renderer.setSize(this.sizes.width* 0.8, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onWindowResize() {
    this.sizes.width = window.innerWidth * 0.8;
    this.sizes.height = window.innerHeight;

    // カメラのアスペクト比を更新
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    this.updateRendererSize();
  }

  // アニメーションループ用のメソッド
  public animate(time: number) {
    this.material.uniforms.u_time.value = time / 1000; // 時間を秒単位に変換
    this.renderer.render(this.scene, this.camera);
  }

  // クリーンアップ用のメソッド
  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.geometry.dispose();
    this.material.dispose();
    this.renderer.dispose();
  }
}

export default Background;