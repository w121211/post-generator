import * as faker from 'faker/locale/en';
import { IComponent } from './base';

export interface IDiceable {
  // dice(ignoreProps?: string[]): void;
  dice(curComponent: IComponent | null, ignoreProps: string[]): void;
}

export abstract class Property implements IDiceable {
  protected _fixedProps: string[] | null = null;

  protected _fixed(prop: string | string[]) {
    if (this._fixedProps === null) {
      this._fixedProps = [];
      for (const k in this)
        if (this[k] !== undefined && this[k] !== null) this._fixedProps.push(k);
    }

    if (typeof prop === 'string') {
      return this._fixedProps.includes(prop);
    } else {
      for (const p of prop) {
        if (!this._fixedProps.includes(p)) return false;
      }
      return true;
    }
  }

  // protected _isAnyDefined(prop: string | string[]) {
  //   if (typeof prop === 'string') {
  //     return prop !== undefined;
  //   } else {
  //     for (const p of prop) {
  //       if (this[p] !== undefined) return true;
  //     }
  //     return false;
  //   }
  // }

  abstract dice(curComponent: IComponent | null, ignoreProps: string[]): void;

  // dice(curComponent: IComponent | null = null, ignoreProps: string[] = []) {
  //   // todo: `ignoreProps` to avoid cyclic call of components
  //   for (const prop in this) {
  //     if (!ignoreProps.includes(prop)) {
  //       const _prop = this[prop] as any;
  //       if (typeof _prop === 'object' && typeof _prop.dice === 'function') {
  //         _prop.dice();
  //       }
  //     }
  //   }
  // }
}

// ---------------------------------
// Properties
// ---------------------------------

export class Box extends Property {
  private readonly _min_w = 10;
  private readonly _min_h = 10;

  constructor(
    public x: number | null | undefined,
    public y: number | null | undefined,
    public w: number | null | undefined,
    public h: number | null | undefined
  ) {
    super();
  }

  private _diceWH(comp: IComponent) {
    if (comp.parent) {
      this.w = faker.random.number({
        min: this._min_w,
        max: <number>comp.parent.box.w
      });
      this.h = faker.random.number({
        min: this._min_h,
        max: <number>comp.parent.box.h
      });
    } else {
      throw Error('Root component need to declare (width, height)');
    }
  }

  private _diceXY(comp: IComponent) {
    if (comp.parent) {
      this.x = faker.random.number({
        min: 0,
        max: <number>comp.parent.box.w - <number>this.w
      });
      this.y = faker.random.number({
        min: 0,
        max: <number>comp.parent.box.h - <number>this.h
      });
    } else {
      this.x = faker.random.number({ min: 0, max: <number>this.w });
      this.y = faker.random.number({ min: 0, max: <number>this.h });
    }
  }

  dice(curComponent: IComponent | null, ignoreProps: string[]) {
    console.log('dice box');
    if (curComponent === null)
      throw Error('Require current component to dice()');

    if (this.w === undefined && this.h === undefined) {
      this._diceWH(curComponent);
    }
    if (this.x === undefined && this.y === undefined) {
      this._diceXY(curComponent);
    }
  }

  // dice(comp :IComponent) {

  //   if (!this._fixed(['x', 'y', 'w', 'h'])) {
  //     if (this._fixed(['x', 'y'])) {
  //       this._diceWH();
  //     } else if (this._fixed(['w', 'h'])) {
  //       this._diceXY();
  //     } else {
  //       this._diceWH();
  //       this._diceXY();
  //     }
  //   }

  //   // todo: a workaround to avoid cyclic call of dice()
  //   super.dice(['parent', 'root']);
  // }
}

export class Color extends Property {
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
