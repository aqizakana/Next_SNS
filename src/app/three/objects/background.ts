import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Wave } from "./seaLevel";
import { cos } from "three/examples/jsm/nodes/Nodes.js";

export class Background {
	public sizes: { width: number; height: number };
	public scene: THREE.Scene;
	public renderer: THREE.WebGLRenderer;
	public camera: THREE.PerspectiveCamera;
	public controls: OrbitControls;
	public mouse = new THREE.Vector2();
	public raycaster = new THREE.Raycaster();
	public INTERSECTED: THREE.Object3D | null = null;
	public wave: Wave = new Wave();
	public wave2: Wave = new Wave();

	/*   private highlightMaterial: THREE.MeshBasicMaterial;
	private defaultMaterial: THREE.ShaderMaterial; */

	constructor(canvasElement: HTMLCanvasElement) {
		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.scene = new THREE.Scene();
		/* {
	  const color = 0xFFFFFF;  // white
	  const near = 10;
	  const far = 100;
	  this.scene.fog = new THREE.Fog(color, near, far);
	} */
		this.camera = new THREE.PerspectiveCamera(
			60,
			this.sizes.width / this.sizes.height,
			50,
			1000,
		);
		this.camera.position.set(0, 0, 400); // カメラの初期位置を調整



		this.renderer = new THREE.WebGLRenderer({
			canvas: canvasElement,
			antialias: true,
			alpha: false,
		});

		const canvas = this.renderer.domElement;

		/**
		 * GPUのドライバーの名前を取得する関数です。
		 * @returns {string} ドライバーの名前です。
		 * @author ICS-Ikeda
		 * @since 2017-08-14
		 */
		/* function detectGpuDriver(): string {
			const canvas = document.createElement('canvas');
			let gl;
			let renderer;
			try {
				gl = canvas.getContext('webgl');

				if (!gl) {
					return '';
				}

				//ドライバー情報を取得
				const ext = gl.getExtension('WEBGL_debug_renderer_info');

				if (!ext) {
					renderer = '';
				} else {
					renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL);
				}
			} catch (e) {
				// WebGL未対応の場合
				gl = null;
				renderer = '';
			}

			// ドライバの種類を出力
			return renderer;
		}

		const driver = detectGpuDriver();
		console.log(driver); */

		const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
		this.scene.add(ambientLight);
		const pointLight = new THREE.PointLight(0xffaaff, 1.0);
		pointLight.position.set(0, 100, 0);
		this.scene.add(pointLight);

		window.addEventListener("mousemove", (event) => {
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
		});

		this.updateRendererSize();

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.enableZoom = true;
		this.controls.maxDistance = 700;
		this.controls.screenSpacePanning = true;

		this.controls.minPolarAngle = Math.PI / 4;
		this.controls.target.set(0, 0, 0);

		this.controls.maxPolarAngle = Math.PI * 2;


		this.wave = new Wave();

		this.wave.getMesh().forEach(element => {
			this.scene.add(element);

		});;

		window.addEventListener("resize", this.onWindowResize.bind(this));
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


	public clickObject() {
		// マウス位置に基づいてレイキャスト
		this.raycaster.setFromCamera(this.mouse, this.camera);
		// シーン内のオブジェクトと交差するか確認
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true,
		);
		console.log(intersects);
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

			this.raycaster.setFromCamera(this.mouse, this.camera);

			if (objects.length >= 0) {
				objects.forEach((object) => {
					if (typeof object.update === "function") {
						object.update(elapsedTime);
					}
				});
			}

			this.controls.update();
			this.renderer.render(this.scene, this.camera);

			this.wave.updateWave();

			requestAnimationFrame(tick);
		};
		tick();
	}

	public cameraZoom(position: THREE.Vector3) {
		/* this.camera.focus = 2.0;
	this.camera.position.set(position.x - 100, position.y - 100, position.z + 100);
	this.camera.lookAt(position);
	this.camera.updateProjectionMatrix(); */
	}

	public dispose() {
		window.removeEventListener("resize", this.onWindowResize.bind(this));
		this.renderer.dispose();
		this.controls.dispose();
	}
}
