import * as faker from 'faker/locale/en'
import { IDiceable } from './base'

export class Color implements IDiceable {
  constructor(private hex = '#000000') { }

  dice() {
    this.hex = faker.internet.color()
  }

  getHex() {
    return this.hex
  }
}