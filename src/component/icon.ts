import * as globby from 'globby';
import * as faker from 'faker/locale/en';
import { Matrix, Container } from '@svgdotjs/svg.js';
import { Component } from './base';

// Settings: a folder contains photos for dice
const ICON_DIR = '/users/chi/documents/github/coordconv-pytorch/data/facebook';
const ICON_EXTENSIONS = ['svg'];
const MAX_NUM_COPIES = 10;

const photoPaths = globby.sync(`${ICON_DIR}/**`, {
  expandDirectories: {
    files: ['*'],
    extensions: ICON_EXTENSIONS
  }
});

export class Icon extends Component {
  constructor(
    private path: string | null = null,
    private numCopies: number | null = null
  ) {
    super();
  }

  dice() {
    // larger icon makes less copies
    if (this.path === null) this.path = faker.random.arrayElement(photoPaths);
  }

  render(draw: Container) {
    const g = draw.group();
    g.image(<string>this.path);
    return g;
  }
}
