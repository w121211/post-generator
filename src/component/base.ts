import { Container } from '@svgdotjs/svg.js';
import * as faker from 'faker/locale/en';
import { makeCanvas } from '../common/svg';
import { IDiceable, Property, Box } from './properties';

// ---------------------------------------------------
// Component
// ---------------------------------------------------

export interface IComponent {
  root: IComponent;
  parent: IComponent | null;
  box: Box;
  // x: number | undefined | null;
  // y: number | undefined | null;
  // w: number | undefined | null;
  // h: number | undefined | null;
  renderAnnotations(): { svg: string; label: string }[];
  render(draw: Container): Container;
}

export abstract class Component implements IComponent, IDiceable {
  abstract render(draw: Container): Container;

  public root: IComponent = this;
  public parent: IComponent | null = null;
  public box: Box = new Box(undefined, undefined, undefined, undefined);

  protected _setRoot(comp: IComponent, root: IComponent) {
    comp.root = root;
    if (comp instanceof ComponentGroup) {
      for (const _comp of comp.components) this._setRoot(_comp, root);
    }
  }

  dice(curComponent: IComponent | null = this, ignoreProps: string[] = []) {
    // TODO: `ignoreProps` to avoid cyclic call of components
    for (const _prop in this) {
      const prop = this[_prop];
      if (prop instanceof Property) {
        prop.dice(this, []);
      }
    }

    // for (const prop in this) {
    //   if (!ignoreProps.includes(prop)) {
    //     const _prop = this[prop] as any;
    //     if (typeof _prop === 'object' && typeof _prop.dice === 'function') {
    //       _prop.dice();
    //     }
    //   }
    // }
  }

  renderAnnotations(): { svg: string; label: string }[] {
    const draw = makeCanvas(<number>this.root.box.w, <number>this.root.box.h);
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

// ---------------------------------------------------
// Component group and support for aligning components
// ---------------------------------------------------

type AlignConfig = {
  direction: number;
  anchor: number;
  gap: number | null;
};

interface IAlignable {
  components: IComponent[];
  alignConfig: AlignConfig | null;
  align(): void;
}

export abstract class ComponentGroup extends Component implements IAlignable {
  constructor(
    // public readonly components: Array<{ new (): Component }>,
    public readonly components: Component[],
    public box: Box = new Box(0, 0, null, null),
    public alignConfig: AlignConfig = {
      direction: 0, // 0: top-to-bottom, 1: left-to-right
      anchor: 0, // TODO
      gap: 0 // in pixel, or null for average expand
    }
  ) {
    super();
    for (let c of components) c.parent = this;
    this._setRoot(this, this.root);
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
      // comp.dice();
    }
  }

  // align

  _diceAlign() {}

  align(): void {
    const config = this.alignConfig;
    if (config == null) return;

    if (config.gap == null) {
    } else {
    }
  }
}

export class Group extends ComponentGroup {}
