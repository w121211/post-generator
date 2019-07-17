import * as globby from 'globby';
import * as faker from 'faker/locale/en';
import { Matrix, Container } from '@svgdotjs/svg.js';
import { Component } from './base';

// Settings: a folder contains photos for dice
const PHOTO_DIR = '';
const PHOTO_EXTENSIONS = ['png', 'jpg', 'jpeg'];

const photoPaths = globby.sync(`${PHOTO_DIR}/**`, {
  expandDirectories: {
    files: ['*'],
    extensions: PHOTO_EXTENSIONS
  }
});

export class Photo extends Component {
  constructor(
    private path: string | null = null,
    public x: number | null = null,
    public y: number | null = null,
    public w: number | null = null,
    public h: number | null = null
  ) {
    super();
  }

  dice() {
    if (this.path === null) this.path = faker.random.arrayElement(photoPaths);
  }

  render(draw: Container) {
    const g = draw.group();
    g.image(<string>this.path);
    return g;
  }
}
