import * as three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Prototypes } from "./Shape/Prototype";
import { Wave } from "./seaLevel";

import TWEEN from "@tweenjs/tween.js";

export class Background {
	public gl: WebGL2RenderingContext | null;
	public sizes: { width: number; height: number };
	public scene: three.Scene;
	public renderer: three.WebGLRenderer;
	public camera: three.PerspectiveCamera;
	public controls: OrbitControls;
	public mouse = new three.Vector2();
	public raycaster = new three.Raycaster();
	public INTERSECTED: three.Object3D | null = null;
	public wave: Wave = new Wave();
	public wave2: Wave = new Wave();

	/*   private highlightMaterial: THREE.MeshBasicMaterial;
	private defaultMaterial: THREE.ShaderMaterial; */

	constructor(canvasElement: HTMLCanvasElement) {

		this.gl = canvasElement.getContext('webgl2');
		if (this.gl === null) {
			throw new Error('WebGL2 is not available');
		}

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.scene = new three.Scene();
		this.camera = new three.PerspectiveCamera(
			60,
			this.sizes.width / this.sizes.height,
			50,
			1500,
		);
		this.camera.position.set(0, 0, 1000); // カメラの初期位置を調整

		this.renderer = new three.WebGLRenderer({
			canvas: canvasElement,
			antialias: true,
			alpha: false,
			context: this.gl
		});


		const ambientLight = new three.AmbientLight(0xffffff, 1.0);
		this.scene.add(ambientLight);
		const pointLight = new three.PointLight(0xffaaff, 1.0);
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
		this.scene.add(this.wave.getMesh());


		this.gl.enable(this.gl.CULL_FACE); // 背面カリングを有効にする
		this.gl.cullFace(this.gl.BACK);   // 裏面をカリングする(デフォルト)
		this.gl.frontFace(this.gl.CCW);
		const shaderProgram = this.gl.createProgram();
		this.gl.useProgram(shaderProgram);
		this.renderer.getContext().getExtension('EXT_color_buffer_float');
		this.renderer.getContext().getExtension('OES_texture_float_linear');
		this.renderer.getContext().getExtension('OES_texture_float');
		this.renderer.getContext().getExtension('OES_standard_derivatives');


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

	public clickObject(): three.Object3D | null {
		// マウス位置に基づいてレイキャスト
		this.raycaster.setFromCamera(this.mouse, this.camera);
		// シーン内のオブジェクトと交差するか確認
		const intersects = this.raycaster.intersectObjects(
			this.scene.children,
			true,
		);
		if (intersects.length > 0) {
			this.INTERSECTED = intersects[0].object;
			return this.INTERSECTED;
		}
		return null;
	}

	public cameraZoom(position: three.Vector3) {
		// Smoothly transition camera to the target position
		const duration = 1.5; // Duration in seconds
		const start = this.camera.position.clone();
		const end = position.clone();

		const tween = new TWEEN.Tween(start)
			.to(end, duration * 1000)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				this.camera.position.copy(start);
				this.camera.lookAt(this.scene.position); // Ensure the camera looks at the center
			})
			.start();
	}

	public animate(objects: Prototypes[] = []) {
		const clock = new three.Clock();

		const tick = () => {
			this.raycaster.setFromCamera(this.mouse, this.camera);

			if (objects.length >= 0) {
				for (let i = 0; i < objects.length; i++) {
					objects[i].update();
				}
			}

			this.controls.update();

			this.renderer.render(this.scene, this.camera);

			this.wave.updateWave();

			requestAnimationFrame(tick);
		};
		tick();
	}

	public dispose() {
		if (this.gl) {
			window.removeEventListener("resize", this.onWindowResize.bind(this));
			this.renderer.dispose();
			this.controls.dispose();
			this.gl = null; // Set to null after disposal for clarity (optional)
		}
	}
}