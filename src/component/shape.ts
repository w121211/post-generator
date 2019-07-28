import * as faker from 'faker/locale/en';
import { Matrix, Container } from '@svgdotjs/svg.js';

// import { makeCanvas } from '../common/svg'
import { Component } from './base';
import { Color, Box } from './properties';

export class Rectangle extends Component {
  constructor(private readonly color: Color, public readonly box: Box) {
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
    g.rect(<number>this.box.w, <number>this.box.h)
      .move(<number>this.box.x, <number>this.box.y)
      .fill(<string>this.color.getHex());
    return g;
  }
}
