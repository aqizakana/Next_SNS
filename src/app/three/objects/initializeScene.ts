import { Background } from "./background";

import type * as THREE from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface backgroundProps {
	scene: THREE.Scene;
	camera: THREE.PerspectiveCamera;
	renderer: THREE.WebGLRenderer;
	controls: OrbitControls;
	dispose: () => void;
	animate: () => void;
	clickObject: () => THREE.Object3D | null;
	cameraZoom: (delta: THREE.Vector3) => void;
}

export interface objectToProps {
	geometry: THREE.BufferGeometry;
	material: THREE.Material;
}

export function initializeScene(canvasElement: HTMLCanvasElement) {
	const background = new Background(canvasElement);

	return {
		scene: background.scene,
		camera: background.camera,
		renderer: background.renderer,
		controls: background.controls,
		dispose: background.dispose.bind(background),
		animate: background.animate.bind(background),
		clickObject: background.clickObject.bind(background),
		cameraZoom: background.cameraZoom.bind(background),
	};
}
