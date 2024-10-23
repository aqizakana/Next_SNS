import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Background {
  public sizes: { width: number; height: number; };
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;
  public mouse = new THREE.Vector2();
  public raycaster = new THREE.Raycaster();
  public INTERSECTED: THREE.Object3D | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.sizes.width / this.sizes.height,
      50,
      7000
    );
    this.camera.position.set(0, 0, 2500); // カメラの初期位置を調整


    this.renderer = new THREE.WebGLRenderer({
      canvas: canvasElement,
      antialias: true,
      alpha: false,
    });
    const canvas = this.renderer.domElement;
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });


    this.updateRendererSize();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.maxDistance = 7000;
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0, 0, -1250);

    this.controls.maxPolarAngle = Math.PI * 2;

    this.addLights();



    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private updateRendererSize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000); // 空色（スカイブルー）
  }

  private onWindowResize() {
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
    this.updateRendererSize();
  }

  private addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xffaaff, 1.0);
    pointLight.position.set(1000, 500, 3000);
    this.scene.add(pointLight);
  }

  /*   public clickObject() {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
      if (intersects.length > 0) {
        this.INTERSECTED = intersects[0].object;
  
      }
      else {
        this.INTERSECTED = null;
      }
      return this.INTERSECTED;
    } */

  public clickObject() {
    // マウス位置に基づいてレイキャスト
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // シーン内のオブジェクトと交差するか確認
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
      // 交差した最初のオブジェクトを取得
      this.INTERSECTED = intersects[0].object;

      // クリックしたオブジェクトの詳細情報を取得（例: ID, 名前, 位置など）
      const objectInfo = {
        id: this.INTERSECTED.uuid, // オブジェクトの一意なID
        name: this.INTERSECTED.name, // 名前が設定されていれば名前
        position: this.INTERSECTED.position.clone(), // 位置情報をコピー
      };
      console.log("uuid", this.INTERSECTED.uuid); // クリックしたオブジェクトの情報をコンソールに表示

      return objectInfo; // オブジェクトの情報を返す
    } else {
      this.INTERSECTED = null;
      return null; // クリックした場所にオブジェクトがない場合
    }
  }


  public animate(objects: any[] = []) {
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      if (objects.length >= 0) {
        objects.forEach(object => {
          if (typeof object.update === 'function') {
            object.update(elapsedTime);
          }
        });
      }

      this.controls.update(); // Ensure OrbitControls updates on every frame
      this.renderer.render(this.scene, this.camera); // Always render the scene

      requestAnimationFrame(tick);
    }
    tick();
  }

  public cameraZoom(position: THREE.Vector3) {
    this.camera.focus = 2.0;
    this.camera.position.set(position.x - 100, position.y - 100, position.z + 100);
    this.camera.lookAt(position);
    this.camera.updateProjectionMatrix();


  }

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
    this.controls.dispose();
  }
}