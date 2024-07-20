"use client"
import type { NextPage } from 'next'
import * as THREE from 'three'
import { useEffect, useRef } from 'react'
import { Circle } from './objects/circle'
import { createSeededRandom } from './objects/seed'
import { createGroup, boxObjects } from './objects/createGroup'
import { randomCircles } from './objects/randomCircles'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (!canvasRef.current) return

        const scene = new THREE.Scene()

        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        const camera = new THREE.PerspectiveCamera(
            75,
            sizes.width / sizes.height,
            0.1,
            1000
        )

        const controls = new OrbitControls(camera, canvasRef.current)
        controls.enableDamping = true
        controls.dampingFactor = 0.2

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: false,
        })
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        const boxgeometry = new THREE.BoxGeometry(1,1,1)
        const boxmaterial = new THREE.MeshNormalMaterial()
        const box = new THREE.Mesh(boxgeometry, boxmaterial)
        //box.position.z = -5
        box.rotation.set(1, 1, 1) // Comment out this line to fix the position of the box
        scene.add(box)

        // ライト
        const amibientLight = new THREE.AmbientLight(0xffffff, 0.2)
        scene.add(amibientLight)
        const pointLight = new THREE.PointLight(0xffffff, 0.2)
        pointLight.position.set(0, 0, 0)
        scene.add(pointLight)


        //オブジェクトの生成
        const { circles, camera_look} = randomCircles(30, 500); // 42はシード値
        circles.forEach(group => {
            scene.add(group);
        });
 
   

        function initCameraPosition() {
            // カメラの初期座標を設定
            camera.position.set(0, -10, -50);
     
        }
        initCameraPosition();
        



        // アニメーション
        const clock = new THREE.Clock()
        const tick = () => {
            const elapsedTime = clock.getElapsedTime()
            boxObjects.forEach(box => {
                box.rotation.x = elapsedTime;
                box.rotation.y = elapsedTime;
            });

            // シェーダーの時間更新
            circles.forEach(circle => {
                if (circle instanceof THREE.Group) {
                    circle.children.forEach(mesh => {
                        if (mesh.material && mesh.material.uniforms && mesh.material.uniforms.time) {
                            mesh.material.uniforms.time.value += clock.getDelta();
                        }
                    });
                }
            });

            controls.update()
            window.requestAnimationFrame(tick)
            renderer.render(scene, camera)
        }
        tick()

        window.addEventListener('resize', () => {
            sizes.width = window.innerWidth
            sizes.height = window.innerHeight
            camera.aspect = sizes.width / sizes.height
            camera.updateProjectionMatrix()
            renderer.setSize(sizes.width, sizes.height)
            renderer.setPixelRatio(window.devicePixelRatio)
        })
    }, [])

    return (
        <>
            <canvas ref={canvasRef} id="canvas"></canvas>
        </>
    )
}

export default Home
