// import fontkit, { IFont } from 'fontkit';
// import window from 'svgdom';
// const document = window.document;
// import { Element, Matrix } from '@svgdotjs/svg.js';
// const { SVG, registerWindow } = require('@svgdotjs/svg.js');
// // registerWindow(window, window.document);

// function makeCanvas(width: number, height: number): Element {
//   const { SVG } = require('@svgdotjs/svg.js');
//   const draw = SVG(document.createElement('svg')).size(width, height);
//   return draw
// }

// export type PicAnnotation = {
//   svg: string;
//   annotations: string[];
// };

// export interface IComponent {
//   render(draw: Element): Element;
//   renderElements(): Element[];
// }

// export class Root implements IComponent {
//   private readonly _components: IComponent[];

//   constructor(components: IComponent[]) {
//     this._components = components;
//   }

//   renderElements(): Element[] {
//     return [];
//   }

//   render(draw: Element): Element {
//     for (let c of this._components) {
//       c.render(draw);
//     }
//     return draw;
//   }
// }

// interface IBoxComponent extends IComponent {
//   // constructor(width: number, height: number);
// }

// export class Box implements IBoxComponent {
//   constructor(width: number, height: number) {

//   }

//   render(draw: Element) {

//   }


// }

// export class TextBox {
//   private _width: number;
//   private _height: number;
//   private _font: IFont;
//   private _fontSize: number;

//   constructor() {
//     this._width = 128;
//     this._height = 128;
//     this._font = fontkit.openSync(
//       '/Users/chi/work/post-generator/asset/font_en/Alegreya/Alegreya-Black.ttf'
//     );
//     this._fontSize = 24;
//   }

//   renderElements(str: string): string[] {
//     const _scale = this._fontSize / this._font.unitsPerEm;
//     const run = this._font.layout(str);

//     const svgs: string[] = [];

//     // 1. draw each char seperately
//     let accX = 0;
//     for (let i in run.glyphs) {
//       const draw = SVG(document.createElement('svg')).size(
//         this._width,
//         this._height
//       );
//       const g = draw.group();

//       g.path(run.glyphs[i].path.toSVG()).translate(accX, 0);
//       accX += run.positions[i].xAdvance;

//       // g.scale(_scale, -_scale).translate(0, this._fontSize);
//       g.transform(new Matrix(_scale, 0, 0, -_scale, 0, this._fontSize));

//       svgs.push(draw.svg());
//     }

//     // 2. draw textbox
//     return svgs;
//   }

//   render(str: string): string {
//     const draw = SVG(document.createElement('svg')).size(
//       this._width,
//       this._height
//     );
//     const _scale = this._fontSize / this._font.unitsPerEm;

//     let accX = 0;
//     let run = this._font.layout(str);

//     const g = draw.group();
//     for (let i in run.glyphs) {
//       g.path(run.glyphs[i].path.toSVG()).translate(accX, 0);
//       accX += run.positions[i].xAdvance;
//     }
//     // g.scale(_scale, -_scale).translate(0, this._fontSize);
//     g.transform(new Matrix(_scale, 0, 0, -_scale, 0, this._fontSize));

//     return draw.svg();
//   }
// }
