import window from 'svgdom';
const document = window.document;
import { Container } from '@svgdotjs/svg.js';
const { SVG, registerWindow } = require('@svgdotjs/svg.js');
registerWindow(window, window.document);

export function makeCanvas(width: number, height: number): Container {
    const draw = SVG(document.createElement('svg')).size(width, height);
    return draw
}
