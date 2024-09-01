"use client"

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Background } from './background'


// シーン初期化関数
const initializeScene = (canvasElement: HTMLCanvasElement) => {
  const back = new Background();
  const scene = back.scene;
  const sizes = back.sizes;
  
  const camera = back.camera;
  camera.position.set(0, 0,-300);

  const controls = new OrbitControls(camera, canvasElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.2

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasElement,
    antialias: true,
    alpha: false,
  })
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x80ffff) // 空色（スカイブルー）の例

  // ライト
  const amibientLight = new THREE.AmbientLight(0xffffff, 0.8)
  scene.add(amibientLight)
  const pointLight = new THREE.PointLight(0xffffff, 1.0)
  pointLight.position.set(0, 0, 0)
  scene.add(pointLight)

 

  // アニメーション
  const clock = new THREE.Clock()
  const animate = (object1: any) => {
      const elapsedTime = clock.getElapsedTime()
      object1.update(elapsedTime)   

      controls.update()
      renderer.render(scene, camera)
      requestAnimationFrame(() => animate(object1))
}
 


  // イベントリスナー
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(window.devicePixelRatio)
  })




  return { scene, camera, renderer, controls,animate }
}
export default initializeScene;