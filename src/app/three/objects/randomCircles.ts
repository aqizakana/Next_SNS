import * as THREE from 'three';
import { createGroup,createTorusOnPath } from './createGroup';
import { createSeededRandom } from './seed';


let torusGroup;
let boxGroup;
let CenterBall;

function randomCircles(number, seed) {
    const seededRandom = createSeededRandom(seed);

    // CenterBallとTorusの生成
    const pathRadius = 150;
    const torusRadius = 10;
    const tubeRadius = 1;
    const Toruses = createTorusOnPath(pathRadius, torusRadius, tubeRadius, number);

    let circles = [];
    let camera_look = [];
    let attempts = 0;
    
    for (let i = 0; i < number; i++) {
        let radius = 10;
        let position;
        let isValidPosition = false;
        const time = Date.now() * 0.0001;
        // 衝突しない位置を見つけるまで試行
        while (!isValidPosition && attempts < 100) {
            position = new THREE.Vector3(
                seededRandom() * 100,
                seededRandom() * 100,
                seededRandom() * 100
            );
            
            isValidPosition = true;

            // 他のサークルとの衝突チェック
            for (let j = 0; j < camera_look.length; j++) {
                if (position.distanceTo(camera_look[j]) < radius * 2) {
                    isValidPosition = false;
                    break;
                }
            }
            attempts++;
        }

        if (isValidPosition) {
            // TorusCircleからグループを取得
            
            torusGroup = createGroup('circle', radius, seededRandom() * 20, position.x, position.y, position.z);
            boxGroup = createGroup('box', 5, 10,position.x, position.y, position.z);
            CenterBall = createGroup('circle', 150, 40, 0,0,0);
            // シーンにグループを追加
      
            circles.push(torusGroup);
            circles.push(boxGroup);
            circles.push(CenterBall);
            circles.push(Toruses);

            camera_look.push(position); // 位置を保存
        } else {
            console.warn('Could not place circle after 100 attempts');
        }
    }

    return { Toruses,circles, camera_look};
} 

export { randomCircles };