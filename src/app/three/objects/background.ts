import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertex from '../../glsl/vertex.glsl';
import fragment from '../../glsl/fragment.glsl';
import { create } from 'domain';


export class Background {
  public sizes: { width: number; height: number; };
  public scene: THREE.Scene;
  public renderer: THREE.WebGLRenderer;
  public camera: THREE.PerspectiveCamera;
  public controls: OrbitControls;
  public mouse = new THREE.Vector2();
  public raycaster = new THREE.Raycaster();
  public INTERSECTED: THREE.Object3D | null = null;

  private highlightMaterial: THREE.MeshBasicMaterial;
  private defaultMaterial: THREE.ShaderMaterial;

  constructor(canvasElement: HTMLCanvasElement) {
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    this.scene = new THREE.Scene();
    {
      const color = 0xFFFFFF;  // white
      const near = 10;
      const far = 100;
      this.scene.fog = new THREE.Fog(color, near, far);
    }
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.sizes.width / this.sizes.height,
      50,
      200000
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

    this.highlightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    this.defaultMaterial = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
    });



    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  private updateRendererSize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor("aqua", 0.0);

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

  public clickObject() {
    // マウス位置に基づいてレイキャスト
    this.raycaster.setFromCamera(this.mouse, this.camera);

    // シーン内のオブジェクトと交差するか確認
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {

      this.INTERSECTED = intersects[0].object;


      return this.INTERSECTED;
    } else {
      this.INTERSECTED = null;
      return null;
    }
  }



  public animate(objects: any[] = []) {
    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      /* this.raycaster.setFromCamera(this.mouse, this.camera);

      // シーン内のオブジェクトと交差するか確認
      const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    
      if (intersects.length > 0) {
        // 交差した最初のオブジェクトを取得
        this.INTERSECTED = intersects[0].object;
        if (this.INTERSECTED && (this.INTERSECTED as THREE.Mesh).material) {
          const newMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // 赤色に設定
          (this.INTERSECTED as THREE.Mesh).material = newMaterial;
        }
      } else {
        // INTERSECTEDがnullでない場合のみmaterialを設定
        if (this.INTERSECTED && (this.INTERSECTED as THREE.Mesh).material) {
          (this.INTERSECTED as THREE.Mesh).material = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
          });
        }
        // INTERSECTEDをnullに設定
        this.INTERSECTED = null;
      } */

      if (objects.length >= 0) {
        objects.forEach(object => {
          if (typeof object.update === 'function') {
            object.update(elapsedTime);
          }
        });
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);

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
    this.highlightMaterial.dispose();
    this.defaultMaterial.dispose();
  }
}