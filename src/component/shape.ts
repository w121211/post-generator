import * as faker from 'faker/locale/en';
import { Matrix, Container } from '@svgdotjs/svg.js';

// import { makeCanvas } from '../common/svg'
import { Component } from './base';
import { Color } from './color';

export class Rectangle extends Component {
  constructor(
    private readonly color: Color,
    public x: number | undefined = undefined,
    public y: number | undefined = undefined,
    public w: number | undefined = undefined,
    public h: number | undefined = undefined
  ) {
    super();
  }

  // dice() {
  //   this._str = faker.lorem.sentence();
  //   this._fontSize = faker.random.number({
  //     min: this.MIN_FONT_SIZE,
  //     max: this.MAX_FONT_SIZE
  //   });
  //   super.dice();
  // }

  render(draw: Container) {
    const g = draw.group();
    g.rect(<number>this.w, <number>this.h)
      .move(<number>this.x, <number>this.y)
      .fill(<string>this.color.getHex());
    return g;
  }
}
