import fontkit, { IFont } from 'fontkit';

export class FontTool {
  private _font: IFont;

  // constructor(family: string, style?: string, weight?: number) {
  // if (weight === null)
  //   // this.font = opentype.loadSync(`./resource/${allFonts[family][style]}`)
  //   this.font = fontkit.openSync(`./resource/${allFonts[family][style]}`);
  // // this.font = opentype.loadSync(`./resource/${allFonts[family][weight]}`)
  // else this.font = fontkit.openSync(`./resource/${allFonts[family][weight]}`);
  // }
  constructor(
    path = '/Users/chi/work/post-generator/asset/font_en/Alegreya/Alegreya-Black.ttf'
  ) {
    this._font = fontkit.openSync(path);
  }

  getUnitGlyph(str: string) {
    let run = this._font.layout(str);
    let sumX = 0;
    let paths = run.glyphs.map((g, i) => {
      let res = { path: g.path.toSVG(), sumX };
      sumX += run.positions[i].xAdvance;
      return res;
    });
    return {
      paths,
      unitW: sumX / this._font.unitsPerEm, // w = unitW * fontSize
      unitH: (this._font.ascent - this._font.descent) / this._font.unitsPerEm // h = unitH * fontSize
      // unitsPerEm: this._font.unitsPerEm
    };
  }

  getHeight(fontSize: number) {
    const fontScale = (1 / this._font.unitsPerEm) * fontSize;
    return (this._font.ascent - this._font.descent) * fontScale;
  }

  getFontSize(height: number) {
    return (
      (height * this._font.unitsPerEm) /
      (this._font.ascent - this._font.descent)
    );
  }
}
