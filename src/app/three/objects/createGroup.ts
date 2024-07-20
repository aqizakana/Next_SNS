import { Circle,Box } from './circle'
import * as THREE from 'three';
import { createSeededRandom } from './seed';
import { SimplexNoise } from "three/addons/math/SimplexNoise.js";

let circlesList = [];
let boxObjects = [];
let object_List = ['circle', 'box'];

const simplexNoise = new SimplexNoise();
const value = simplexNoise.noise(-1, 1); // x1とy1は任意の数値


function createGroup(objectType:string , size:number , number:number, x:number, y:number, z:number) {
    let position = new THREE.Vector3(x, y, z);
    let group = new THREE.Group();
    const seededRandom = createSeededRandom(42);

    for (let i = 0; i < number; i++) {
        let  mesh;

        if (objectType === object_List[0]) {
            let radius = size;
            let circle = new Circle(radius, position)
            circle.mesh.rotation.y = i * 2;
            circle.mesh.rotation.x = i * 0.5;

            mesh = circle.mesh;
        } else if (objectType === object_List[1]) {
            size = size;
            let box = new Box(size, position)
            mesh = box.mesh;
            boxObjects.push(mesh);
        } else {
            console.error('Unknown object type:', objectType);
            return null;
        }

        group.add(mesh);
    }

    group.position.set(x, y, z);
    return group;
}   


function createTorusOnPath(pathRadius: number, torusRadius: number, tubeRadius: number, numberofTorus: number) {
    const centerBall  = new THREE.Group();
    const path = new THREE.CurvePath();

    const curve = new THREE.EllipseCurve(
        0, 0,             // 中心
        pathRadius, pathRadius,  // X軸半径、Y軸半径
        0, 2 * Math.PI,   // 開始角度、終了角度
        false,            // 時計回りかどうか
        0                 // 回転
    );

    path.add(curve); // Remove unnecessary new THREE.CurvePath()

    for (let i = 0; i < numberofTorus; i++) {
        const t = i / numberofTorus;
        const position = path.getPointAt(t);

        const torusGeometry = new THREE.TorusGeometry(torusRadius, tubeRadius, 16, 100);
        const torusMaterial = new THREE.MeshNormalMaterial();
        const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);

        torusMesh.position.set(position.x, position.y, 0);
        
        // Torusを中心に向ける
        torusMesh.lookAt(new THREE.Vector3(0, 0, 0));

        centerBall.add(torusMesh);
    }
    return centerBall;
}


export  { createGroup, createTorusOnPath,circlesList, boxObjects };