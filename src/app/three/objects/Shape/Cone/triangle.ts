import * as THREE from "three";

import { objectProps } from "../type";

export class triangle {
	private geometry: THREE.ConeGeometry;
	private material: THREE.ShaderMaterial;
	private mesh: THREE.Mesh;

	constructor({
		charCount,
		vertexShader,
		fragmentShader,
		koh_sentiment_score,
		koh_sentiment_label_number,
	}: objectProps) {
		this.geometry = new THREE.ConeGeometry(charCount, charCount, charCount);
		this.material = new THREE.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				u_time: { value: 0.0 },
				u_mouse: { value: new THREE.Vector2(0, 0) },
				u_color: { value: koh_sentiment_score },
				u_labelNumber: { value: koh_sentiment_label_number },
			},
		});
		this.mesh = new THREE.Mesh(this.geometry, this.material);
	}

	public getMesh(): THREE.Mesh {
		return this.mesh;
	}

	public update(deltaTime: number) {
		this.material.uniforms.u_time.value += deltaTime;
	}
}
