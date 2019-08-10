import * as faker from 'faker/locale/en';
import { Property, Box } from './base';

export class AlignConfig extends Property {
  constructor(
    public direction: number | undefined = 1,
    public anchor: number | undefined = 0,
    public gap: number | undefined = 0
  ) {
    super();
  }

  dice() {}
}

export function align(
  boxes: Box[],
  config: AlignConfig
): { w: number; h: number } {
  let x = 0,
    y = 0,
    w = 0,
    h = 0;
  for (let b of boxes) {
    b.x = x;
    b.y = y;
    if (config.direction === 0) {
      x += <number>b.w + <number>config.gap;
      w += <number>b.w + <number>config.gap;
    } else {
      y += <number>b.h + <number>config.gap;
      h += <number>b.h + <number>config.gap;
    }
  }
  if (w === 0) {
    w = boxes.reduce(
      (acc, cur) => (<number>cur.w > acc ? <number>cur.w : acc),
      0
    );
  }
  if (h === 0) {
    h = boxes.reduce(
      (acc, cur) => (<number>cur.h > acc ? <number>cur.h : acc),
      0
    );
  }
  return { w, h };
  // let coords = boxes.map(b => {
  //   if (config.direction === 0) {
  //     x += <number>b.w + <number>config.gap;
  //   } else {
  //     y += <number>b.h + <number>config.gap;
  //   }
  //   return [x, y];
  // });
}
