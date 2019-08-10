import { Container } from '@svgdotjs/svg.js';
import { makeCanvas } from '../common/svg';
import { Box, IDiceable, Property } from '../property/base';

export interface IAnnotation {
  svg: string;
  label: string;
}

export interface IComponent {
  root: IComponent;
  parent: IComponent | null;
  box: Box;
  render(
    draw: Container,
    annMode: boolean,
    annComp?: Component
  ): Container | void;
  renderAnnotations(
    rootRenderFn: (annComp: IComponent) => Container
  ): IAnnotation[];
}

export abstract class Component implements IComponent, IDiceable {
  [key: string]: any;
  public root: Component = this;
  public parent: Component | null = null;
  public box: Box = new Box();

  public abstract render(
    draw: Container,
    annMode: boolean,
    annComp?: Component
  ): Container | void;

  public renderAnnotations(
    rootRenderFn: (annComp: Component) => Container
  ): IAnnotation[] {
    const draw = rootRenderFn(this);
    return [{ svg: draw.svg(), label: this.constructor.name }];
  }

  // protected _setRoot(comp: IComponent, root: IComponent) {
  //   comp.root = root;
  //   if (comp instanceof ComponentGroup) {
  //     for (const _comp of comp.components) this._setRoot(_comp, root);
  //   }
  // }

  public dice(
    thisComp: IComponent | null = this,
    ignoreProps: string[] = []
  ): void {
    // TODO: `ignoreProps` to avoid cyclic call of components
    for (const k of Object.keys(this)) {
      const prop = this[k];
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

  // public renderAnnotations(): IAnnotation[] {
  //   const draw = makeCanvas(
  //     this.root.box.w as number,
  //     this.root.box.h as number
  //   );
  //   this.render(draw);
  //   return [{ svg: draw.svg(), label: this.constructor.name }];
  // }

  private _getRootComponent(): void {
    let count = 0;
    let _root: IComponent = this;
    while (true) {
      if (count++ > 100) throw Error('A component has over 100 layers');
      if (_root.parent) _root = _root.parent;
      else break;
    }
  }
}
