import { Container, Matrix } from '@svgdotjs/svg.js';

import { align, AlignConfig } from '../property/align';
import { Box, Color, Property } from '../property/base';
import { Font } from '../property/font';
import { Component, IAnnotation } from './base';

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
      // ['這', '是', '第', '一', '行'],
      // ['這', '是', '第', '二', '行'],
      // ['這', '是', '第', '三', '行']
      ['一'],
      ['二']
    ];
  }
}

// ---------------------------------------------
// Components
// ---------------------------------------------

class Token {
  public box: Box = new Box(0, 0, undefined, undefined);
  public glyphs: Array<{ path: string; x: number }>;
  public scale: number;

  constructor(private readonly _font: Font, private readonly _string: string) {
    this.glyphs = this._font.layout(this._string);
    this.box.w = this.glyphs.reduce(
      (acc, cur) => acc + cur.x * this._font.scale,
      0
    );
    this.box.h = this._font.size;
    this.scale = this._font.scale;
  }

  // render(group: G) {
  //   const glyphs = this._font.layout(this._string);
  //   let w = 0;
  //   for (const { path, x } of glyphs) {
  //     g.path(path);
  //     w += x;
  //   }
  //   this.box.w = w;
  //   return g;
  // }

  // render(group: G, curX?: number) {
  //   if (curX !== undefined) this._curX = curX;
  //   else curX = this._curX;

  //   const glyphs = this._font.layout(this._string);
  //   for (const { path, x } of glyphs) {
  //     group.path(path).translate(<number>curX, 0);
  //     (<number>curX) += x;
  //   }
  //   return curX;
  // }
}

class Line extends Component {
  constructor(
    public readonly tokens: Token[],
    public readonly tokensAlign: AlignConfig
  ) {
    super();
    const { w, h } = align(this.tokens.map(a => a.box), tokensAlign);
    this.box.w = w;
    this.box.h = h;
  }

  public render(
    draw: Container,
    annMode: boolean,
    annComp?: Component
  ): Container {
    const g = draw.group();
    for (const tk of this.tokens) {
      let curX = tk.box.x as number;
      for (const { path, x } of tk.glyphs) {
        g.path(path).transform(
          new Matrix(tk.scale, 0, 0, -tk.scale, curX, tk.box.y as number)
        );
        curX += x;
      }
    }
    g.move(this.box.x as number, this.box.y as number);
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
    public readonly text: Text = new Text(),
    public readonly font: Font = new Font(),
    public readonly color: Color = new Color(),
    public readonly linesAlign: AlignConfig = new AlignConfig(),
    public readonly tokensAlign: AlignConfig = new AlignConfig()
  ) {
    super();
  }

  public dice(): void {
    super.dice(this);

    // initialize required params
    this._lines = (this.text.h1 as string[][]).map(
      ln => new Line(ln.map(tk => new Token(this.font, tk)), this.tokensAlign)
    );
    this.linesAlign.direction = 0;
    const { w, h } = align(this._lines.map(a => a.box), this.linesAlign);
    this.box.w = w;
    this.box.h = h;

    // 置中
    this.box.x =
      (((this.parent as Component).box.w as number) - this.box.w) / 2;
    this.box.y =
      (((this.parent as Component).box.h as number) - this.box.h) / 2;
  }

  public render(
    draw: Container,
    annMode: boolean = false,
    annComp?: Component
  ): Container {
    const g = draw.group();

    // const lineTokens = <Token[][]>this._tokens;
    // const lines = lineTokens.map(x => this._renderLine(g, x));

    // let curY = this.font.size;
    // const lines = (<Line[]>this._lines).map(x => {
    //   const _g = x.render(g);
    //   // _g.transform(new Matrix(_scale, 0, 0, -_scale, 0, curY));
    //   curY += this.font.size;
    //   return _g;
    // });
    // .fill(gradient);

    for (const ln of this._lines as Line[]) {
      const _ln = ln.render(g, annMode, annComp);
      if (annMode && (annComp as unknown) !== ln) {
        _ln.fill('none');
      } else {
        _ln.fill(this.color.hex as string);
      }
    }
    // g.move(this.box.x as number, this.box.y as number);
    g.transform(
      new Matrix(1, 0, 0, 1, this.box.x as number, this.box.y as number)
    );

    return g;
  }

  public renderAnnotations(
    rootRenderFn: (annComp: Component) => Container
  ): IAnnotation[] {
    const anns: IAnnotation[] = [];
    for (const ln of this._lines as Line[]) {
      const draw = rootRenderFn(ln);
      anns.push({ svg: draw.svg(), label: ln.constructor.name });
    }
    return anns;
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
}
