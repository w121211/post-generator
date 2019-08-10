import { Container } from '@svgdotjs/svg.js';

// import { makeCanvas } from '../common/svg'
import { Box, Color } from '../property/base';
import { Component, IAnnotation } from './base';

export class Rectangle extends Component {
  constructor(
    public readonly box: Box = new Box(),
    public readonly color: Color = new Color()
  ) {
    super();
  }

  public render(
    draw: Container,
    annMode: boolean = false,
    annComp?: Component
  ): Container {
    const g = draw.group();
    const rect = g.rect(this.box.w as number, this.box.h as number);
    rect.move(this.box.x as number, this.box.y as number);

    // use trick 'as unknown' to avoid typescript warning
    if (annMode && (annComp as unknown) !== this) {
      rect.fill('none');
    } else {
      rect.fill(this.color.hex as string);
    }
    return g;
  }
}
