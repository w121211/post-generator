// const textBox = new Box(
//   [
//     new Rect(),
//     new Text(new Font())
//   ]
// )

// const width = 256
// const height = 256
// const root = new Root(
//   width, height, [textBox]
// )
// root.dice()
// let draw = root.render(draw)
// root.svg()

// const CONFIG = {
//   MIN_BOX_WIDTH: 10
// }

import { Container } from '@svgdotjs/svg.js';
import * as faker from 'faker/locale/en';
import { makeCanvas } from '../common/svg';

export interface IDiceable {
  dice(ignoreProps?: string[]): void;
}

export abstract class Diceable implements IDiceable {
  dice(ignoreProps: string[] = []) {
    for (const prop in this) {
      if (!ignoreProps.includes(prop)) {
        const _prop = this[prop] as any;
        if (typeof _prop.dice === 'function') {
          _prop.dice();
        }
      }
    }
  }
}

export interface IComponent extends IDiceable {
  root: IComponent;
  parent: IComponent | null;
  x: number | null;
  y: number | null;
  w: number | null;
  h: number | null;
  renderElements(): { svg: string; label: string }[];
  render(draw: Container): Container;
}

export abstract class Component extends Diceable implements IComponent {
  // abstract renderElements(): void
  abstract render(draw: Container): Container;

  public root: IComponent = this;
  public parent: IComponent | null = null;
  public x: number | null = null;
  public y: number | null = null;
  public w: number | null = null;
  public h: number | null = null;

  private readonly _min_w = 10;
  private readonly _min_h = 10;

  dice() {
    if (this.parent) {
      if (
        this.w === null &&
        this.h === null &&
        typeof this.parent.w === 'number' &&
        typeof this.parent.h === 'number'
      ) {
        this.w = faker.random.number({
          min: this._min_w,
          max: <number>this.parent.w
        });
        this.h = faker.random.number({
          min: this._min_h,
          max: <number>this.parent.h
        });
      }
      this.x = faker.random.number({
        min: 0,
        max: <number>this.parent.w - <number>this.w
      });
      this.y = faker.random.number({
        min: 0,
        max: <number>this.parent.h - <number>this.h
      });
    } else {
      this.x = faker.random.number({ min: 0, max: <number>this.w });
      this.y = faker.random.number({ min: 0, max: <number>this.h });
    }

    // todo: a workaround to avoid cyclic call of dice()
    super.dice(['parent', 'root']);
  }

  renderElements(): { svg: string; label: string }[] {
    const draw = makeCanvas(<number>this.root.w, <number>this.root.h);
    this.render(draw);
    return [{ svg: draw.svg(), label: this.constructor.name }];
  }

  private _getRootComponent() {
    let count = 0;
    let _root: IComponent = this;
    while (true) {
      if (count++ > 100) throw Error('A component has over 100 layers');
      if (_root.parent) _root = _root.parent;
      else break;
    }
  }
}

export class ComponentStack extends Component {
  constructor(
    public readonly components: IComponent[],
    public w: number | null = null,
    public h: number | null = null
  ) {
    super();

    for (let c of components) c.parent = this;
    this._setRoot(this, this.root);
  }

  private _setRoot(comp: IComponent, root: IComponent) {
    comp.root = root;
    if (comp instanceof ComponentStack) {
      for (const _comp of comp.components) this._setRoot(_comp, root);
    }
  }

  render(draw: Container) {
    const g = draw.group();
    for (let comp of this.components) {
      comp.render(g);
    }
    return g;
  }

  renderElements(): { svg: string; label: string }[] {
    let elems: { svg: string; label: string }[] = [];
    for (const comp of this.components) {
      const _elems = comp.renderElements();
      elems = [...elems, ..._elems];
    }
    return elems;
  }

  dice() {
    for (const comp of this.components) {
      comp.dice();
    }
  }
}
