'use client';

import type { NextPage } from "next";
import Layout from "../layout";
import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
import { Footer } from "../../../components/footer";
import { init } from "next/dist/compiled/webpack/webpack";

const Home: NextPage = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const threeCanvas = canvasRef.current;
        if (!threeCanvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        camera.position.z = 700;

        const renderer = new THREE.WebGLRenderer({
            canvas: threeCanvas,
            antialias: true,
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // ライトを初期化
        const initLight = (scene: THREE.Scene) => {
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 0, -10).normalize();
            scene.add(light);
        };

        initLight(scene);

        // メッシュを追加
        const geometryWidth = window.innerWidth;
        const geometryHeight = window.innerHeight;

        const geometry = new THREE.PlaneGeometry(geometryWidth, geometryHeight, 1, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0.0 },
                u_scrollY: { value: 0.0 }, // スクロール量を受け取るuniform
                resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }, // 解像度の設定
            },
            vertexShader: `
                varying vec2 vUv;
                uniform float u_scrollY;

                #define PI 3.14159265359

                void main() {
                    vUv = uv;
                    vec3 pos = position;
                    
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
            uniform float u_time;
            uniform vec2 resolution;
            uniform float u_scrollY;
            varying vec2 vUv;

            #define PI 3.14159265359

            float noise(vec2 uv)
            {
                float seed = dot(uv, vec2(501.0, 601.0));
                return fract(sin(seed) * 6000.0);
            }

            void main() {
                vec2 center = vec2(0.4, 0.6);

                vec2 delta = vUv - center;
                float angle = atan(delta.y, delta.x);

                float timeOffset = u_scrollY * 0.5;
                angle += timeOffset;

                float radius = length(delta);
                vec2 rotatedUV = vec2(
                    cos(angle) * radius,
                    sin(angle) * radius
                );

                vec3 yellow = vec3(0.6, 0.6, 0.1);
                vec3 blue = vec3(0.2, 0.3, 0.9);
                vec3 black = vec3(0.0, 0.0, 0.0);
                vec3 mixYellow_Y = mix(yellow, black, vUv.y);
                vec3 mixBlue_Y = mix(black,blue, vUv.y);
                vec3 mixYellow_X = mix(mixYellow_Y * 0.6, black, vUv.x * 0.5);
                vec3 mixBlue_X = mix(black, mixBlue_Y, vUv.x * 0.5 );

                float colorMixFactor =sin(u_scrollY + 0.1) * 0.5 * rotatedUV.x + 0.5 * rotatedUV.y; // -1～1 を 0～1 に変換
                
                float timeFactor = 0.5 + 0.5 * sin(u_time * PI * 0.5);
                float swapFactor = smoothstep(0.0, 1.0, fract(vUv.x + timeFactor));

                float noise = noise(vUv) * 0.1;

                vec3 mixColor = mix(mixYellow_X - noise, mixBlue_X - noise, vUv.x +  colorMixFactor);

                // 色の出力
                gl_FragColor = vec4(mixColor, 1.0);
            }

            `,
        });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        initLight(scene);

        // アニメーション関数
        const animate = () => {
            material.uniforms.u_time.value += 0.05;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // リサイズイベント
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);

        const handleScroll = (event: WheelEvent) => {
            console.log(event.deltaY);
            let scrollValue = event.deltaY;

            if (scrollValue < 0) {
                scrollValue -= 0.05;
            }else{
                scrollValue += 0.05;
            }
            scrollValue *= 0.3;

            if (Math.abs(scrollValue) < 0.001) {
                scrollValue = 0;  // 十分に減速したら停止
            }

            scrollValue += 0.2; 

            setScrollY((prev) => prev + scrollValue);
            material.uniforms.u_scrollY.value += scrollValue; // スクロール量をシェーダーに渡す
        };
    
        window.addEventListener("wheel", handleScroll);
    
        // クリーンアップ関数
        return () => {
            window.removeEventListener("resize", handleResize);
            
            renderer.dispose();
        };
    }, []);

    return (
        <Layout>
            <div className={styles.container}>
                <canvas className={styles.bv} ref={canvasRef} id="canvas" />
                <div className={styles.foot}>
                    <p>Current Scroll: {scrollY.toFixed(2)}</p>
                </div>
                <Footer />
            </div>
        </Layout>
    );
};

export default Home;
