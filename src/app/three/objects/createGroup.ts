//周りのトーラスとボックスを生成する関数

import { Circle } from "./Shape/Circle";
import { Box } from "./Shape/Box/Box";
import * as THREE from "three";

import { SimplexNoise } from "three/addons/math/SimplexNoise.js";

import { triangle } from "./Shape/Cone/triangle";
import { Cylinder } from "./Shape/Cylinder/Cylinder";

let object_List = ["circle", "box"];

const simplexNoise = new SimplexNoise();
const value = simplexNoise.noise(-1, 1); // x1とy1は任意の数値

const clock = new THREE.Clock();

function MeshRotation(group: THREE.Group, rotationFactor: number) {
	group.children.forEach((mesh, index) => {
		if (mesh instanceof THREE.Mesh) {
			// グループに追加された順番に応じた回転を設定
			mesh.rotation.y = index * rotationFactor;
		}
	});
}

//トーラスまたは、ボックス生成する関数
function createGroup(
	objectType: string,
	size: number,
	number: number,
	x: number,
	y: number,
	z: number,
) {
	let position = new THREE.Vector3(x, y, z);
	let group = new THREE.Group();
	let BoxList: THREE.Mesh[] = [];
	let circlesList: THREE.Mesh[] = [];
	for (let i = 0; i < number; i++) {
		let mesh;
		if (objectType === object_List[0]) {
			let radius = size;
			let circle = new Circle(radius, position);
			//const elapsedTime = clock.getElapsedTime()
			//circle.material.uniforms.time.value = elapsedTime;
			mesh = circle.mesh;
			circlesList.push(mesh);
		} else if (objectType === object_List[1]) {
			let line = size;
			let box = new Box(line, position);
			box.mesh.rotation.y = i;
			box.mesh.rotation.x = i;
			box.mesh.rotation.z = i * 0.1;
			mesh = box.mesh;
			BoxList.push(mesh);
		} else {
			console.error("Unknown object type:", objectType);
			return null;
		}
		group.add(mesh);
		MeshRotation(group, 10);
	}
	group.position.set(x, y, z);
	return { group, circlesList, BoxList };
}

let center = [];

function OnPath(group: THREE.Group, x, y, z) {
	group.children.forEach((mesh, index) => {
		if (mesh instanceof THREE.Mesh) {
			mesh.position.set(x, y, z);
		}
	});
}

function GroupRotate(
	group: THREE.Group,
	rotateTypes: string[],
	angleStep: number,
	iterator: number,
) {
	rotateTypes.forEach((rotateType) => {
		if (rotateType.includes("x")) {
			group.rotation.x += angleStep * iterator;
		}
		if (rotateType.includes("y")) {
			group.rotation.y += angleStep * iterator;
		}
		if (rotateType.includes("z")) {
			group.rotation.z += angleStep * iterator;
		}
	});
}

//トーラス・ボックスセットを円状に配置する関数
function createTorusOnPath(pathRadius: number, numberofTorus: number) {
	const elapsedTime = clock.getElapsedTime();
	const TorusSet = new THREE.Group();
	const path = new THREE.CurvePath();
	let BBB: THREE.Mesh[] = [];
	let curve = new THREE.EllipseCurve(
		0,
		0, // 中心
		pathRadius,
		pathRadius, // X軸半径、Y軸半径
		0,
		2 * Math.PI, // 開始角度、終了角度
		false, // 時計回りかどうか
		0, // 回転
	);
	path.add(curve);

	for (let i = 0; i < numberofTorus; i++) {
		const t = i / numberofTorus;
		const position = path.getPointAt(t);
		const angleStep = Math.PI / 6; // 30度をラジアンに変換
		const xOffset = Math.cos(angleStep) * pathRadius;
		const yOffset = Math.sin(angleStep) * pathRadius;
		const torusPosition = new THREE.Vector3(position.x, position.y, 0);
		const boxPosition = new THREE.Vector3(position.x, position.y, 0);

		const { group: Toruses } = createGroup(
			"circle",
			5,
			10,
			torusPosition.x,
			torusPosition.y,
			0,
		);
		const { group: Boxes, BoxList } = createGroup(
			"box",
			5,
			1,
			boxPosition.x,
			boxPosition.y,
			0,
		);

		OnPath(Toruses, torusPosition.x, torusPosition.y, torusPosition.z);
		OnPath(Boxes, boxPosition.x, boxPosition.y, boxPosition.z);

		TorusSet.add(Toruses);
		TorusSet.add(Boxes);

		//GroupRotate(Toruses, ['y'],angleStep,j);
		//GroupRotate(Boxes, ['y'],angleStep,j);

		BoxList.forEach((box) => BBB.push(box));
	}
	return { TorusSet, BBB };
}

function complexcreateTorusOnPath(
	pathRadius: number,
	torusRadius: number,
	tubeRadius: number,
	numberofTorus: number,
	numberofRing: number,
) {
	const centerBall = new THREE.Group();
	const angleStep = Math.PI / 6; // 30度をラジアンに変換
	const path = new THREE.CurvePath();
	const curve = new THREE.EllipseCurve(
		0,
		0, // 中心
		pathRadius,
		pathRadius, // X軸半径、Y軸半径
		0,
		2 * Math.PI, // 開始角度、終了角度
		false, // 時計回りかどうか
		0, // 回転
	);

	path.add(curve);

	for (let i = 0; i < numberofTorus; i++) {
		const t = i / numberofTorus;
		const position = path.getPointAt(t);
		const theta = (i / numberofTorus) * Math.PI * 2; // 横回転角度

		for (let j = 0; j < numberofRing; j++) {
			const phi = (j / numberofRing) * Math.PI; // 縦回転角度

			const x = pathRadius * Math.sin(phi) * Math.cos(theta);
			const y = pathRadius * Math.sin(phi) * Math.sin(theta);
			const z = pathRadius * Math.cos(phi);

			const torusPosition = new THREE.Vector3(
				position.x + x,
				position.y + y,
				z,
			);
			const boxPosition = new THREE.Vector3(position.x + x, position.y + y, z);

			const { group: Toruses } = createGroup(
				"circle",
				5,
				10,
				torusPosition.x,
				torusPosition.y,
				torusPosition.z,
			);
			const { group: Boxes } = createGroup(
				"box",
				5,
				5,
				boxPosition.x,
				boxPosition.y,
				boxPosition.z,
			);

			// 回転
			//GroupRotate(Toruses, ['xy'], angleStep, j);
			//GroupRotate(Boxes, ['xy'], angleStep, j);

			// `i`に基づいて回転を追加

			centerBall.add(Toruses);
			centerBall.add(Boxes);
		}
	}

	return centerBall;
}

function DoubleCone(x, y, z) {
	let radius = x;
	let height = y;
	let segments = z;
	const Cone1 = new triangle(radius, height, segments);
	const Cone2 = new triangle(radius, height, segments);

	Cone1.mesh.position.set(0, -height / 2, 0);
	Cone2.mesh.position.set(0, height / 2, 0);
	Cone1.mesh.rotation.x = Math.PI;
	Cone2.mesh.rotation.x = 0;
	Cone1.mesh.rotation.y = Math.PI / segments;

	const group = new THREE.Group();
	group.add(Cone1.mesh);
	group.add(Cone2.mesh);

	return { mesh: group, Cones: [Cone1, Cone2] };
}

function crossCylinder(a, b, c, d) {
	let radius_T = a;
	let radius_B = b;
	let height = c;
	let segments = d;
	const Cylinder1 = new Cylinder(radius_T, radius_B, height, segments);
	const Cylinder2 = new Cylinder(radius_T, radius_B, height, segments);

	Cylinder1.mesh.position.set(0, 0, 0);
	Cylinder2.mesh.position.set(0, 0, 0);
	Cylinder1.mesh.rotation.z = Math.PI * 0.5;
	Cylinder2.mesh.rotation.x = 0;

	const group = new THREE.Group();
	group.add(Cylinder1.mesh);
	group.add(Cylinder2.mesh);
	return { mesh: group, cylinders: [Cylinder1, Cylinder2] };
}

export { createGroup, createTorusOnPath, DoubleCone, crossCylinder };
