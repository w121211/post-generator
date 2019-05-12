import { IDiceable } from './base'
import path from 'path'
import fontkit, { IFont } from 'fontkit'

interface FontMap {
  [key: string]: string[];
}

const fontFolder = '/Users/chi/work/rateapp/server/resource'

const fontMap: FontMap = {
  "Arima_Madurai": [
    "fonts_en/Arima_Madurai/ArimaMadurai-Thin.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-ExtraLight.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-Light.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-Regular.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-Medium.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-Bold.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-ExtraBold.ttf",
    "fonts_en/Arima_Madurai/ArimaMadurai-Black.ttf"
  ],
}

// type FontName = keyof FONT_MAP

export class Font implements IDiceable {
  public unitsPerEm: number | null = null;
  private _fontkit: IFont;

  constructor(
    private name: keyof FontMap = 'Arima_Madurai',
    private index: number = 0,
  ) {
    // super()
    const _path = path.join(fontFolder, fontMap[this.name][this.index])
    this._fontkit = fontkit.openSync(_path)
    this.unitsPerEm = this._fontkit.unitsPerEm
  }

  dice() {
    // this.name = faker.random.arrayElement(Object.keys(FONT_MAP))
    // this.index = faker.random.int(0, FONT_MAP[this.name].length - 1)
    console.log('dice font')
  }

  layout(str: string) {
    let run = this._fontkit.layout(str);
    let sumX = 0;
    let paths = run.glyphs.map((g, i) => {
      let res = { path: g.path.toSVG(), sumX };
      sumX += run.positions[i].xAdvance;
      return res;
    });
    return {
      paths,
      unitW: sumX / this._fontkit.unitsPerEm, // w = unitW * fontSize
      unitH: (this._fontkit.ascent - this._fontkit.descent) / this._fontkit.unitsPerEm // h = unitH * fontSize
      // unitsPerEm: this._font.unitsPerEm
    };
  }
}
