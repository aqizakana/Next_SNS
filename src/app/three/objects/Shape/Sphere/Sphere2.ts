//https://chatgpt.com/c/66f425d9-a1fc-8011-bf36-d80594cd733c
import * as three from "three";

import type { objectProps } from "../../../type";

export class Sphere2 {
	private geometry: three.SphereGeometry;
	private material: three.ShaderMaterial;
	private mesh: three.Mesh;
	private count: number;

	constructor({
		charCount,
		position,
		vertexShader,
		fragmentShader,
		analyze8labelsResult,
		koh_sentiment_label_number,
		koh_sentiment_score,
		count = 1,
	}: objectProps) {
		this.geometry = new three.SphereGeometry(charCount * 10, 20, 20);
		const vertexIndices = new Float32Array(
			this.geometry.attributes.position.count,
		);
		this.geometry.setAttribute(
			"vertexIndex",
			new three.BufferAttribute(vertexIndices, 1),
		);
		for (let i = 0; i < vertexIndices.length; i++) {
			vertexIndices[i] = i;
		}
		this.material = new three.ShaderMaterial({
			vertexShader: vertexShader,
			fragmentShader: fragmentShader,
			uniforms: {
				u_time: { value: 0.0 },
				u_mouse: { value: new three.Vector2(0, 0) },
				u_color: { value: koh_sentiment_score },
				u_colorWithScore: { value: koh_sentiment_score },
			},
		});
		this.count = count;
		this.mesh = new three.InstancedMesh(
			this.geometry,
			this.material,
			this.count,
		);
		this.mesh.position.set(position.x, position.y, position.z);
		this.geometry.dispose();
		this.material.dispose();
	}
	public getMesh(): three.Mesh {
		return this.mesh;
	}

	public update(deltaTime: number) {
		this.material.uniforms.u_time.value = performance.now() * 0.001;
		//this.mesh.rotation.x += this.material.uniforms.colorWithScore.value / 10.0;
	}
	public updateMousePosition(x: number, y: number) {
		this.material.uniforms.u_mouse.value.set(x, y);
	}
}
