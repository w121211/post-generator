import * as faker from 'faker/locale/en';
import { Diceable } from './base';

export class Color extends Diceable {
  constructor(private hex: string | null = null) {
    super();
  }

  dice() {
    this.hex = faker.internet.color();
  }

  getHex() {
    return this.hex;
  }
}
