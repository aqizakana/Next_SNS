import { Background } from "./background";

import type * as three from "three";
import type { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export interface backgroundProps {
	scene: three.Scene;
	camera: three.PerspectiveCamera;
	renderer: three.WebGLRenderer;
	controls: OrbitControls;
	dispose: () => void;
	animate: () => void;
	clickObject: () => three.Object3D | null;
	cameraZoom: (delta: three.Vector3) => void;
}

export interface objectToProps {
	geometry: three.BufferGeometry;
	material: three.Material;
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
