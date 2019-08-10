import { Container, Matrix } from '@svgdotjs/svg.js';
import Chance from 'chance';
import { Box, Color } from '../property/base';
import { Layout } from '../property/layout';
import { Component, IAnnotation } from './base';
import { Icon } from './icon';
import { Rectangle } from './shape';

export abstract class BaseGroup extends Component {
  constructor(
    public readonly box: Box,
    public readonly components: Component[]
  ) {
    super();
    for (const comp of components) {
      comp.parent = this;
    }
    // this._setRoot(this, this.root);
  }

  public dice(): void {
    super.dice();
    for (const comp of this.components) {
      comp.dice();
    }
  }

  public render(
    draw: Container,
    annMode: boolean = false,
    annComp?: Component
  ): Container | void {
    const g = draw.group();

    for (const comp of this.components) {
      comp.render(g, annMode, annComp);
    }

    // 避免使用`g.move(...)`，會產生問題
    g.transform(
      new Matrix(1, 0, 0, 1, this.box.x as number, this.box.y as number)
    );
    // if (annMode && (annComp as unknown) === this) {
    //   // 以group整體作為annotation
    //   for (const comp of this.components) {
    //     comp.render(g, annMode, comp);
    //   }
    // } else {
    //   for (const comp of this.components) {
    //     comp.render(g, annMode, annComp);
    //   }
    // }

    return g;
  }

  public renderAnnotations(
    rootRenderFn: (annComp: Component) => Container
  ): IAnnotation[] {
    let anns: IAnnotation[] = [];
    // 1. render its own annotation (ie, group as one annotation)
    const draw = rootRenderFn(this);
    anns.push({ svg: draw.svg(), label: this.constructor.name });

    // 2. render each child's annotation
    for (const comp of this.components) {
      const _anns = comp.renderAnnotations(rootRenderFn);
      anns = [...anns, ..._anns];
    }
    return anns;
  }
}

/**
 * 在一個平面依照layout放置components
 */
export class Group extends BaseGroup {
  constructor(
    public readonly components: Component[],
    public readonly box: Box = new Box(0, 0, null, null),
    public readonly lauout: Layout = new Layout()
  ) {
    super(box, components);
  }

  public renderAnnotations(
    rootRenderFn: (annComp: Component) => Container
  ): IAnnotation[] {
    // 防止group作為annotation，ie 僅render child annotations
    let anns: IAnnotation[] = [];
    for (const comp of this.components) {
      const _anns = comp.renderAnnotations(rootRenderFn);
      anns = [...anns, ..._anns];
    }
    return anns;
  }
}

/**
 * 一系列的layer疊加在一起
 */
export class Stack extends BaseGroup {
  constructor(
    public readonly components: Component[],
    public readonly box: Box = new Box(0, 0, null, null),
    public bg?: Component | null,
    public readonly config = { bgAlllowNull: true }
  ) {
    super(box, components);
    if (this.bg !== null && this.bg !== undefined) {
      this.components.unshift(this.bg);
    }
  }

  public dice(): void {
    if (this.bg === undefined) {
      this.bg = diceBg(this.box, this.config.bgAlllowNull);
      if (this.bg !== null) {
        this.components.unshift(this.bg);
      }
    }
    super.dice();
  }

  public render(
    draw: Container,
    annMode: boolean = false,
    annComp?: Component
  ): Container {
    const g = draw.group();

    if (annMode && (annComp as unknown) === this) {
      // 以stack整體作為annotation
      for (const comp of this.components) {
        comp.render(g, false); // TODO: trick, 可能會出錯
      }
    } else {
      for (const comp of this.components) {
        comp.render(g, annMode, annComp);
      }
    }

    g.transform(
      new Matrix(1, 0, 0, 1, this.box.x as number, this.box.y as number)
    );
    return g;
  }
}

/**
 * 隨機產生bg，給stack使用
 * @param stackBox
 */
function diceBg(stackBox: Box, allowNull: boolean): Component | null {
  const chance = new Chance();

  // 決定box
  // const w = chance.integer({ min: -20, max: 20 });
  // const h = chance.integer({ min: -20, max: 20 });
  const marginX0 = 0;
  const marginX1 = 0;
  const marginY0 = 0;
  const marginY1 = 0;
  const box = new Box(0, 0, stackBox.w, stackBox.h);

  // 決定bg component
  const rect = new Rectangle(box);
  const icon = new Icon();

  rect.dice();

  return rect;

  // if (allowNull) {
  //   return chance.weighted([null, rect, new Stack([rect, icon])], [20, 4, 1]);
  // } else {
  //   return chance.weighted([rect, new Stack([rect, icon])], [10, 1]);
  // }
}
