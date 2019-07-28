// import * as faker from 'faker/locale/en';
import * as faker from 'faker/locale/zh_CN';
import { Matrix, Container, G } from '@svgdotjs/svg.js';

import { Component, ComponentGroup } from './base';
import { Property, Color, Box } from './properties';
import { Font } from './font';

export class Text extends Property {
  private readonly _h1Limit = [0, 10]; // [min, max]
  private readonly _h2Limit = [0, 20];
  private readonly _h3Limit = [0, 40];

  constructor(
    public h1: string[][] | null = null,
    public h2: string[][] | null = null,
    public h3: string[][] | null = null,
    public h1Fontize: number = 18
  ) {
    super();
  }

  dice() {
    // this.h1 = ['這是第一行', '這是第二行', '這是第三行'];
    this.h1 = [
      ['這', '是', '第', '一', '行'],
      ['這', '是', '第', '二', '行'],
      ['這', '是', '第', '三', '行']
    ];
  }
}

// ---------------------------------------------
// Components
// ---------------------------------------------

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

class Line extends Component {
  constructor(public readonly tokens: Token[]) {
    super();
  }

  render(draw: Container) {
    const g = draw.group();
    let curX = 0;
    for (let tk of this.tokens) {
      curX = <number>tk.render(g, curX);
    }
    return g;
  }
}

export class TextBox extends Component {
  private readonly MIN_FONT_SIZE = 16;
  private readonly MAX_FONT_SIZE = 60;
  private readonly _splitter = ' ';
  private _tokens: Token[][] | undefined;
  private _splitterToken: Token | undefined;
  private _lines: Line[] | undefined;

  constructor(
    private readonly text: Text,
    private readonly font: Font,
    private readonly color: Color
  ) {
    super();
  }

  dice() {
    super.dice();

    // initialize required params
    this._lines = (<string[][]>this.text.h1).map(
      ln => new Line(ln.map(tk => new Token(this.font, tk)))
    );
  }

  // dice() {
  //   this._fontSize = faker.random.number({
  //     min: this.MIN_FONT_SIZE,
  //     max: this.MAX_FONT_SIZE
  //   });
  //   // this._string = faker.lorem.sentence();
  //   this._string = '這是一個測試';
  //   this._strings = ['這是第一行', '這是第二行', '這是第三行'];

  //   this._tokens = this._strings.map(x =>
  //     x.split('').map(y => new Token(this.font, y))
  //   );
  //   // this._tokens = this._strings.map(x => {
  //   //   return x.split().map()
  //   // })
  //   // .map(x => new Token(this.font, x));
  //   // this._tokens = this._string
  //   //   .split(this._splitter)
  //   //   .map(x => new Token(this.font, x));
  //   // this._splitterToken = new Token(this.font, this._splitter);

  //   super.dice();
  // }

  // private _renderLine(group: Container, tokens: Token[]) {
  //   const g = group.group();
  //   let curX = 0;
  //   for (let tk of tokens) {
  //     console.log(tk);
  //     curX = <number>tk.render(g, curX);
  //   }
  //   return g;
  // }

  private _render(draw: Container) {
    const _scale = this.font.size / <number>this.font.unitsPerEm;
    const g = draw.group();

    // const lineTokens = <Token[][]>this._tokens;
    // const lines = lineTokens.map(x => this._renderLine(g, x));

    let curY = this.font.size;
    const lines = (<Line[]>this._lines).map(x => {
      const _g = x.render(g);
      _g.transform(new Matrix(_scale, 0, 0, -_scale, 0, curY));
      curY += this.font.size;
      console.log(_g.svg());
      return _g;
    });
    // .fill(gradient);
    g.move(<number>this.box.x, <number>this.box.y);

    // let curX = 0,
    //   curY = this.font.size;
    // for (let line of lines) {
    //   line.transform(
    //     new Matrix(
    //       _scale,
    //       0,
    //       0,
    //       -_scale,
    //       0, // align left
    //       curY
    //     )
    //   );
    //   curY += this.font.size;
    // }

    // const gradient = draw.gradient('linear', function(add) {
    //   add.stop(0, '#333');
    //   add.stop(1, '#fff');
    // });

    // .fill(<string>this.color.getHex());

    return g;
  }

  // renderAnnotations(): { svg: string; label: string }[] {
  //   const _scale = this._fontSize / <number>this.font.unitsPerEm;
  //   const anns = [];

  //   // render once to record positions of tokens
  //   const draw = makeCanvas(<number>this.root.w, <number>this.root.h);
  //   this._render(draw);
  //   anns.push({
  //     svg: draw.svg(),
  //     label: this.constructor.name
  //   });

  //   // render each token
  //   for (let tk of <Token[]>this._tokens) {
  //     const draw = makeCanvas(<number>this.root.w, <number>this.root.h);
  //     const g = draw.group();
  //     tk.render(g);
  //     g.transform(
  //       new Matrix(
  //         _scale,
  //         0,
  //         0,
  //         -_scale,
  //         <number>this.x,
  //         <number>this.y + this._fontSize
  //       )
  //     ).fill(<string>this.color.getHex());

  //     if (g.rbox(draw).x < <number>this.root.w) {
  //       // ignore annotation if it is outside of the image
  //       anns.push({
  //         svg: draw.svg(),
  //         label: tk.constructor.name
  //       });
  //     }
  //   }

  //   return anns;
  // }

  render(draw: Container) {
    return this._render(draw);
  }
}
