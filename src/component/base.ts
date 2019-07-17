import { Container } from '@svgdotjs/svg.js';
import * as faker from 'faker/locale/en';
import { makeCanvas } from '../common/svg';

export interface IDiceable {
  dice(ignoreProps?: string[]): void;
}

export abstract class Diceable implements IDiceable {
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

  dice(ignoreProps: string[] = []) {
    // todo: `ignoreProps` to avoid cyclic call of components
    for (const prop in this) {
      if (!ignoreProps.includes(prop)) {
        const _prop = this[prop] as any;
        if (typeof _prop === 'object' && typeof _prop.dice === 'function') {
          _prop.dice();
        }
      }
    }
  }
}

export interface IComponent extends IDiceable {
  root: IComponent;
  parent: IComponent | null;
  x: number | undefined | null;
  y: number | undefined | null;
  w: number | undefined | null;
  h: number | undefined | null;
  renderAnnotations(): { svg: string; label: string }[];
  render(draw: Container): Container;
}

export abstract class Component extends Diceable implements IComponent {
  abstract render(draw: Container): Container;

  public root: IComponent = this;
  public parent: IComponent | null = null;
  public x: number | undefined | null;
  public y: number | undefined | null;
  public w: number | undefined | null;
  public h: number | undefined | null;

  private readonly _min_w = 10;
  private readonly _min_h = 10;

  private _diceWH() {
    if (this.parent) {
      this.w = faker.random.number({
        min: this._min_w,
        max: <number>this.parent.w
      });
      this.h = faker.random.number({
        min: this._min_h,
        max: <number>this.parent.h
      });
    } else {
      throw Error('Root component need to declare (width, height)');
    }
  }

  private _diceXY() {
    if (this.parent) {
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
  }

  dice() {
    if (!this._fixed(['x', 'y', 'w', 'h'])) {
      if (this._fixed(['x', 'y'])) {
        this._diceWH();
      } else if (this._fixed(['w', 'h'])) {
        this._diceXY();
      } else {
        this._diceWH();
        this._diceXY();
      }
    }

    // todo: a workaround to avoid cyclic call of dice()
    super.dice(['parent', 'root']);
  }

  renderAnnotations(): { svg: string; label: string }[] {
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
    public x: number = 0,
    public y: number = 0,
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

  renderAnnotations(): { svg: string; label: string }[] {
    let anns: { svg: string; label: string }[] = [];
    for (const comp of this.components) {
      const _anns = comp.renderAnnotations();
      anns = [...anns, ..._anns];
    }
    return anns;
  }

  dice() {
    for (const comp of this.components) {
      comp.dice();
    }
  }
}
