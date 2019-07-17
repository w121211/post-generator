import * as faker from 'faker/locale/en';
import { Matrix, Container, G } from '@svgdotjs/svg.js';

import { makeCanvas } from '../common/svg';
import { Component } from './base';
import { Font } from './font';
import { Color } from './color';

class Token {
  // store position for rendering annotations
  public _curX: number | undefined;

  constructor(private readonly _font: Font, private readonly _string: string) {}

  render(group: G, curX?: number) {
    if (curX !== undefined) this._curX = curX;
    else curX = this._curX;

    const glyphs = this._font.layout(this._string);
    for (const { path, x } of glyphs) {
      group.path(path).translate(<number>curX, 0);
      (<number>curX) += x;
    }
    return curX;
  }
}

export class Text extends Component {
  private readonly MIN_FONT_SIZE = 16;
  private readonly MAX_FONT_SIZE = 60;
  private readonly _splitter = ' ';
  private _tokens: Token[] | undefined;
  private _splitterToken: Token | undefined;

  constructor(
    private readonly font: Font,
    private readonly color: Color,
    // private _str = 'default string value',
    private _string = 'hello world',
    // private _tokens: string[] | null = null,
    private _fontSize: number = 24
  ) {
    super();
  }

  dice() {
    this._fontSize = faker.random.number({
      min: this.MIN_FONT_SIZE,
      max: this.MAX_FONT_SIZE
    });
    this._string = faker.lorem.sentence();
    this._tokens = this._string
      .split(this._splitter)
      .map(x => new Token(this.font, x));
    this._splitterToken = new Token(this.font, this._splitter);

    super.dice();
  }

  private _render(draw: Container) {
    const _scale = this._fontSize / <number>this.font.unitsPerEm;
    const g = draw.group();

    let curX = 0;
    for (let i = 0; i < (<Token[]>this._tokens).length; i++) {
      curX = <number>(<Token[]>this._tokens)[i].render(g, curX);
      if (i + 1 !== (<Token[]>this._tokens).length) {
        curX = <number>(<Token>this._splitterToken).render(g, curX);
      }
    }

    // for (let i = 0; i < (<string[]>this._tokens).length; i++) {
    //   const glyphs = this.font.layout((<string[]>this._tokens)[i]);
    //   for (const { path, x } of glyphs) {
    //     g.path(path).translate(curX, 0);
    //     curX += x;
    //   }
    //   if (i + 1 !== (<string[]>this._tokens).length) {
    //     // if not last token, render splitter
    //     const glyph = this.font.layout(this._splitter);
    //     const { path, x } = glyph[0];
    //     g.path(path).translate(curX, 0);
    //     curX += x;
    //   }
    // }
    g.transform(
      new Matrix(
        _scale,
        0,
        0,
        -_scale,
        <number>this.x,
        <number>this.y + this._fontSize
      )
    ).fill(<string>this.color.getHex());

    return g;
  }

  renderAnnotations(): { svg: string; label: string }[] {
    const _scale = this._fontSize / <number>this.font.unitsPerEm;
    const anns = [];

    // render once to record positions of tokens
    const draw = makeCanvas(<number>this.root.w, <number>this.root.h);
    this._render(draw);
    anns.push({
      svg: draw.svg(),
      label: this.constructor.name
    });

    // render each token
    for (let tk of <Token[]>this._tokens) {
      const draw = makeCanvas(<number>this.root.w, <number>this.root.h);
      const g = draw.group();
      tk.render(g);
      g.transform(
        new Matrix(
          _scale,
          0,
          0,
          -_scale,
          <number>this.x,
          <number>this.y + this._fontSize
        )
      ).fill(<string>this.color.getHex());

      if (g.rbox(draw).x < <number>this.root.w) {
        // ignore annotation if it is outside of the image
        anns.push({
          svg: draw.svg(),
          label: tk.constructor.name
        });
      }
    }

    return anns;
  }

  render(draw: Container) {
    return this._render(draw);
  }
}
