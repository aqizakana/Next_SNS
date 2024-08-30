import * as THREE from 'three';

export class Background {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public sizes: { width: number; height: number; };
  public renderer: THREE.WebGLRenderer;
  

  constructor() {
    this.scene = new THREE.Scene();
    //this.renderer = new THREE.WebGLRenderer;


    this.sizes = {
      width: window.innerWidth ,
      height: window.innerHeight,
    }
    this.camera = new THREE.PerspectiveCamera(
      100,
      this.sizes.width / this.sizes.height,
      10,
      2000
    )
    this.camera.position.set(0, 0, 0);
    try {
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
      })
      
    } catch (e) {
      console.error('WebGLレンダラーの作成に失敗しました:', e);
      // フォールバック処理やユーザーへの通知を行う
    }
    
    this.updateRendererSize();

    

    // リサイズイベントリスナーを追加
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private updateRendererSize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private onWindowResize() {
    this.sizes.width = window.innerWidth ;
    this.sizes.height = window.innerHeight;

    // カメラのアスペクト比を更新
    this.camera.aspect = this.sizes.width  / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // レンダラーのサイズを更新
    this.updateRendererSize();
  }

  // アニメーションループ用のメソッド
  public animate(time: number) {

    this.renderer.render(this.scene, this.camera);
  }

  // クリーンアップ用のメソッド
  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    
    this.renderer.dispose();
  }
}

export default Background;