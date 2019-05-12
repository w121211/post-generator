declare module 'fontkit' {
  class Path {
    toSVG(): string;
  }

  interface IGlyph {
    path: Path;
  }

  class GlyphPosition {
    xAdvance: number;
    yAdvance: number;
    xOffset: number;
    yOffset: number;
  }

  class GlyphRun {
    glyphs: IGlyph[];
    positions: GlyphPosition[];
  }

  export interface IFont {
    unitsPerEm: number;
    ascent: number;
    descent: number;
    layout(
      string: string,
      userFeatures?: string[],
      script?: string,
      language?: string,
      direction?: string
    ): GlyphRun;
  }

  // class TTFFont implements Font {}

  type format = IFont;

  interface IFontkit {
    openSync(filename: string, postscriptName?: string): format;
    // create(buffer, postscriptName): format;
  }

  const fontkit: IFontkit;
  export default fontkit;
}
