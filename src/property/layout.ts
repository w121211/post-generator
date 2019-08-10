import Chance from 'chance';

import { Group } from '../component/group';
import { Property } from './base';

// {nBoxes: [[[x0, y0, x1, y1], ...]]}
const LAYOUTS = {
  1: [[0, 0, 1, 1]],
  2: [[0, 0, 1 / 2, 1], [1 / 2, 0, 1, 1]],
  3: [[0, 0, 1 / 3, 1], [1 / 3, 0, 2 / 3, 1], [2 / 3, 0, 1, 1]],
  4: [
    [0, 0, 1 / 4, 1],
    [1 / 4, 0, 2 / 4, 1],
    [2 / 4, 0, 3 / 4, 1],
    [3 / 4, 0, 1, 1]
  ]
};

export class Layout extends Property {
  constructor(public boxes?: number[][]) {
    super();
  }

  public dice(thisComp: Group): void {
    if (thisComp.box.w === null || thisComp.box.h === null) {
      throw new Error('Layout requires group to have (w, h)');
    }
    // const chance = new Chance();
    // this.boxes = chance.pickone(
    //   LAYOUTS[curComp.components.length as keyof typeof LAYOUTS]
    // );
    this.boxes = LAYOUTS[thisComp.components.length as keyof typeof LAYOUTS];
    this.apply(thisComp);
  }

  public apply(thisComp: Group): void {
    const w = thisComp.box.w as number;
    const h = thisComp.box.h as number;
    const _boxes = this.boxes as number[][];
    for (let i = 0; i < thisComp.components.length; i++) {
      const x0 = w * _boxes[i][0];
      const y0 = h * _boxes[i][1];
      const x1 = w * _boxes[i][2];
      const y1 = h * _boxes[i][3];
      thisComp.components[i].box.x = x0;
      thisComp.components[i].box.y = y0;
      thisComp.components[i].box.w = x1 - x0;
      thisComp.components[i].box.h = y1 - y0;
    }
  }
}
