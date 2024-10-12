import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class Background {
  public sizes: { width: number; height: number; };
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;

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
    this.updateRendererSize();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.maxDistance = 4500;
    this.controls.screenSpacePanning = true;
    this.controls.target.set(0, 0, -1250);

    this.controls.maxPolarAngle = Math.PI * 2;

    this.addLights();



    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private updateRendererSize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x80ffff); // 空色（スカイブルー）
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

  public dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
    this.renderer.dispose();
    this.controls.dispose();
  }
}