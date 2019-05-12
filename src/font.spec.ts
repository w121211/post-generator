// tslint:disable:no-expression-statement
import test from 'ava';
import fontkit from 'fontkit';
import window from 'svgdom';
const document = window.document;
// import { registerWindow, SVG } from '@svgdotjs/svg.js';
const { SVG, registerWindow, Matrix } = require('@svgdotjs/svg.js');
registerWindow(window, window.document);
const canvas = SVG(document.documentElement).size(128, 128);

test('font', t => {
  const font = fontkit.openSync(
    '/Users/chi/work/post-generator/asset/font_en/Alegreya/Alegreya-Black.ttf'
  );
  const str = 'hello';
  const fontSize = 24;
  const _scale = fontSize / font.unitsPerEm;

  let accX = 0;
  let run = font.layout(str);

  const g = canvas.group();
  for (let i in run.glyphs) {
    g.path(run.glyphs[i].path.toSVG()).translate(accX, 0);
    accX += run.positions[i].xAdvance;
  }
  g.scale(_scale, -_scale).translate(0, fontSize);
  g.transform(new Matrix(_scale, 0, 0, -_scale, 0, fontSize));

  t.is(
    canvas.svg(),
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="128" height="128"><g transform="matrix(0.024,0,0,-0.024,0,24)"><path d="M14 81Q39 84 47.5 95Q56 106 56 133L56 565Q56 601 46.5 612.5Q37 624 8 624L-17 624L-22 631L-14 706L74 718L254 742L263 716Q237 692 230 389Q321 484 344 484Q425 484 467.5 451Q510 418 510 354Q510 336 505.5 292Q501 248 499 232Q488 146 488 120Q488 99 494 91Q500 83 515 83L540 84L542 80L531 -4Q449 0 401 0L311 -2L279 -3L287 84Q305 86 313 97Q321 108 322 130L324 271Q325 309 315.5 324Q306 339 281 339Q263 339 229 313Q228 274 228 116Q228 98 233 91Q238 84 251 84L265 85L268 78L257 -4Q179 0 129 0Q75 0 3 -5L14 81Z" transform="matrix(1,0,0,1,0,0)"></path><path d="M259 -12Q141 -12 77.5 51Q14 114 14 230Q14 306 45.5 363.5Q77 421 134.5 452.5Q192 484 269 484Q459 484 459 284Q459 255 451 218L440 208L203 208Q207 164 232 141Q257 118 301 118Q351 118 420 148L429 143L451 69Q411 38 357 13Q303 -12 259 -12ZM281 290Q289 291 291 294.5Q293 298 293 308Q293 373 253 373Q223 373 210.5 352.5Q198 332 198 284Z" transform="matrix(1,0,0,1,554,0)"></path><path d="M14 81Q39 84 47.5 95Q56 106 56 133L56 565Q56 593 51.5 604.5Q47 616 32.5 620Q18 624 -17 624L-22 631L-14 706Q126 723 254 742L263 716Q244 661 236 520.5Q228 380 228 114Q228 96 233 89Q238 82 251 82L283 83L286 76L273 -4Q169 0 129 0Q75 0 3 -5Z" transform="matrix(1,0,0,1,1023,0)"></path><path d="M14 81Q39 84 47.5 95Q56 106 56 133L56 565Q56 593 51.5 604.5Q47 616 32.5 620Q18 624 -17 624L-22 631L-14 706Q126 723 254 742L263 716Q244 661 236 520.5Q228 380 228 114Q228 96 233 89Q238 82 251 82L283 83L286 76L273 -4Q169 0 129 0Q75 0 3 -5Z" transform="matrix(1,0,0,1,1310,0)"></path><path d="M258 -12Q151 -12 89.5 51.5Q28 115 28 225Q28 347 94.5 415.5Q161 484 280 484Q391 484 450 423Q509 362 509 248Q509 126 442.5 57Q376 -12 258 -12ZM270 95Q296 95 306 115.5Q316 136 316 191Q316 259 311.5 296Q307 333 295.5 348.5Q284 364 264 364Q238 364 228 344Q218 324 218 271Q218 202 222.5 164.5Q227 127 238.5 111Q250 95 270 95Z" transform="matrix(1,0,0,1,1597,0)"></path></g></svg>'
  );
});
