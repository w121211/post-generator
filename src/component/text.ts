import * as faker from 'faker/locale/en';
import { Matrix, Container } from '@svgdotjs/svg.js';

// import { makeCanvas } from '../common/svg'
import { Component } from './base';
import { Font } from './font';
import { Color } from './color';

export class Text extends Component {
  private readonly MIN_FONT_SIZE = 16;
  private readonly MAX_FONT_SIZE = 60;

  constructor(
    private readonly font: Font,
    private readonly color: Color,
    // private _str = 'default string value',
    private _str = 'hello',
    private _fontSize: number = 24
  ) {
    super();
  }

  dice() {
    this._str = faker.lorem.sentence();
    this._fontSize = faker.random.number({
      min: this.MIN_FONT_SIZE,
      max: this.MAX_FONT_SIZE
    });
    super.dice();
  }

  // renderElements() {
  // const draw = makeCanvas(<number>this.root.w, <number>this.root.h)
  // }

  render(draw: Container) {
    const _scale = this._fontSize / <number>this.font.unitsPerEm;
    const res = this.font.layout(this._str);

    const g = draw.group();

    for (const { path, sumX } of res.paths) {
      g.path(path).translate(sumX, 0);
    }
    g.transform(
      new Matrix(
        _scale,
        0,
        0,
        -_scale,
        <number>this.x,
        <number>this.y + this._fontSize
      )
    ).fill(this.color.getHex());

    return g;
  }
}
