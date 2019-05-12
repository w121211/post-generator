import test from 'ava';
import window from 'svgdom';
const document = window.document;
// import { registerWindow, SVG } from '@svgdotjs/svg.js';
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
registerWindow(window, window.document);

// import { Component } from './generator';

test('createSvg', t => {
  const e1 = document.createElement('svg'); // need to name 'svg', otherwise cannot work
  const e2 = document.createElement('svg');
  const canvas = SVG(e1).size(128, 128);
  const canvas2 = SVG(e2).size(256, 256);
  t.is(
    canvas.svg(),
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="128" height="128"></svg>'
  );
  t.is(
    canvas2.svg(),
    '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="256" height="256"></svg>'
  );
});

// test('render', t => {
//   // const c = new Component();
//   // t.is(c.renderItems('hello'), []);
// });
