import * as THREE from 'three';
import { triangle } from './triangle';
import { objectProps } from '../type';

export class DoubleCone {
    private group: THREE.Group;
    private cones: [triangle, triangle];

    constructor({
        sizeWithtopic,
        position,
        vertexShader,
        fragmentShader,
        colorWithScore,
        nounNumber
    }: objectProps) {
        const radius = sizeWithtopic;
        const height = sizeWithtopic;
        const segments = sizeWithtopic;
        const heightnonNumber = nounNumber + 1.0;

        const cone1Props = { sizeWithtopic, position, vertexShader, fragmentShader, colorWithScore, nounNumber };
        const cone2Props = { ...cone1Props };

        const Cone1 = new triangle(cone1Props);
        const Cone2 = new triangle(cone2Props);

        Cone1.getMesh().position.set(0, -height / heightnonNumber, 0);
        Cone2.getMesh().position.set(0, height / heightnonNumber, 0);
        Cone1.getMesh().rotation.x = Math.PI;
        Cone2.getMesh().rotation.x = 0;
        Cone1.getMesh().rotation.y = Math.PI / segments;

        this.group = new THREE.Group();
        this.group.add(Cone1.getMesh());
        this.group.add(Cone2.getMesh());

        this.cones = [Cone1, Cone2];

        if (position) {
            this.group.position.set(position.x, position.y, position.z);
        }
    }

    public getMesh(): THREE.Group {
        return this.group;
    }

    public update(deltaTime: number) {
        this.cones.forEach(cone => cone.update(deltaTime));
    }
}