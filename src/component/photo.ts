import { Container } from '@svgdotjs/svg.js';
import Chance from 'chance';
import * as globby from 'globby';
import sizeOf from 'image-size';

import { Property } from '../property/base';
import { Component } from './base';

// Settings: a folder contains photos for dice
const PHOTO_DIR = '/users/chi/documents/github/coordconv-pytorch/data/facebook';
const PHOTO_EXTENSIONS = ['png', 'jpg', 'jpeg'];

const photoPaths = globby.sync(`${PHOTO_DIR}/**`, {
  expandDirectories: {
    extensions: PHOTO_EXTENSIONS,
    files: ['*']
  }
});

export class Photo extends Property {
  constructor(public path?: string, public w?: number, public h?: number) {
    super();
  }

  public dice(): void {
    if (this.path === undefined) {
      const chance = new Chance();
      const _path = chance.pickone(photoPaths);
      const dim = sizeOf(_path);
      this.path = `file:///${_path}`;
      this.w = dim.width;
      this.h = dim.height;
    }
  }
}

export class PhotoBox extends Component {
  constructor(public readonly photo: Photo = new Photo()) {
    super();
  }

  public render(
    draw: Container,
    annMode: boolean,
    annComp?: Component
  ): Container | void {
    const g = draw.group();
    const im = g.image(this.photo.path as string);
    im.width(this.photo.w as number);
    im.height(this.photo.h as number);
    return g;
  }
}
