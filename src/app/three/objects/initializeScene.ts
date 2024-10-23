"use client";

import { Background } from './background';

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
