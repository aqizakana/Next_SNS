import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Prototypes } from "./Shape/Prototype";
import { Wave } from "./seaLevel";

import TWEEN from "@tweenjs/tween.js";

export class Background {
	public gl: WebGL2RenderingContext | null;
	public sizes: { width: number; height: number };
	public scene: THREE.Scene;
	public renderer: THREE.WebGLRenderer;
	public camera: THREE.PerspectiveCamera;
	public controls: OrbitControls;
	public mouse = new THREE.Vector2();
	public raycaster = new THREE.Raycaster();
	public INTERSECTED: THREE.Object3D | null = null;
	public wave: Wave = new Wave();
	private myReq: number | null = null;

	constructor(canvasElement: HTMLCanvasElement) {
		this.gl = canvasElement.getContext("webgl2");
		if (this.gl === null) {
			throw new Error("WebGL2 is not available");
		}

		this.sizes = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			80,
			this.sizes.width / this.sizes.height,
			0.01,
			3000,
		);
		this.camera.position.set(0, 0, 1200); // カメラの初期位置を調整

		this.renderer = new THREE.WebGLRenderer({
			canvas: canvasElement,
			antialias: true,
			alpha: false,
			context: this.gl,
		});

		const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
		this.scene.add(ambientLight);
		const pointLight = new THREE.PointLight(0xffaaff, 1.0);
		pointLight.position.set(0, 100, 0);
		this.scene.add(pointLight);

		this.updateRendererSize();

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.05;
		this.controls.enableZoom = true;
		this.controls.maxDistance = 1500;
		this.controls.screenSpacePanning = true;

		this.controls.minPolarAngle = Math.PI / 4;
		this.controls.target.set(0, 0, 0);

		this.controls.maxPolarAngle = Math.PI * 2;

		this.wave = new Wave();
		this.scene.add(this.wave.getMesh());

		window.addEventListener("resize", this.onWindowResize.bind(this));
		window.addEventListener("mousemove", this.mousePosition.bind(this));
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

	private mousePosition(event: MouseEvent) {
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	public clickObject(): THREE.Object3D | null {
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

	public cameraZoom(position: THREE.Vector3) {
		const cameraPosition = {
			x: this.camera.position.x,
			y: this.camera.position.y,
			z: this.camera.position.z,
		};
		const targetPosition = {
			x: position.x,
			y: position.y,
			z: position.z + 100,
		};
		const cameraTween = new TWEEN.Tween(cameraPosition)
			.to(targetPosition, 1000)
			.easing(TWEEN.Easing.Quadratic.InOut)
			.onUpdate(() => {
				this.camera.position.set(
					cameraPosition.x,
					cameraPosition.y,
					cameraPosition.z,
				);
			})
			.start();

		cameraTween.onComplete(() => {
			this.camera.lookAt(position);
		});
	}

	public animate: (objects?: Prototypes[]) => void = (
		objects: Prototypes[] = [],
	) => {
		const tick = () => {
			this.raycaster.setFromCamera(this.mouse, this.camera);

			if (objects.length >= 0) {
				for (let i = 0; i < objects.length; i++) {
					objects[i].update();
					const objTime = objects[i].returnCreatedAt();
					if (objTime) {
						const elapsedTime =
							(new Date().getTime() - objTime.getTime()) /
							(1000 * 60 * 60 * 48 * 2); // 経過時間を24時間で割る
						//objects[i].getMesh().position.y += elapsedTime;
					}
				}
			}

			this.controls.update();

			this.renderer.render(this.scene, this.camera);

			this.wave.updateWave();

			this.myReq = requestAnimationFrame(tick);
		};
		tick();
	};

	public dispose() {
		console.log("dispose");
		if (this.gl) {
			// ウィンドウリサイズイベントのリスナー削除
			window.removeEventListener("resize", this.onWindowResize.bind(this));
			window.removeEventListener("mousemove", this.mousePosition.bind(this));

			// アニメーションフレームのキャンセル
			if (this.myReq !== null) {
				cancelAnimationFrame(this.myReq);
			}

			// シーン内のオブジェクトを再帰的に処理して破棄
			this.scene.traverse((object) => {
				if (object instanceof THREE.Mesh) {
					if (object.geometry) {
						object.geometry.dispose();
					}
					if (Array.isArray(object.material)) {
						for (const mat of object.material) {
							if (mat instanceof THREE.Material) {
								mat.dispose();
							}
						}
					} else if (object.material instanceof THREE.Material) {
						object.material.dispose();
					}
				}
			});

			// Three.jsレンダラーの破棄
			this.renderer.dispose();

			// シーンの削除
			this.scene.clear();
		}
	}
}
