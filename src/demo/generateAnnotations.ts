import fs from 'fs';
import path from 'path';

import { Container } from '@svgdotjs/svg.js';
import Chance from 'chance';
import { Converter, createConverter } from 'convert-svg-to-png';

import { makeCanvas } from '../common/svg';
import { Group, Stack } from '../component/group';
import { PhotoBox } from '../component/photo';
import { Rectangle } from '../component/shape';
import { TextBox } from '../component/text';
import { Box, Color } from '../property/base';

const chance = new Chance();

/**
 * 隨機產生步驟：
 * 1. 決定n個main objects (textbox, photo, )
 * 2. 對main objects隨機進行合併，依照規則：
 *    can stack: [photo, textbox], []
 *    can group: []
 * 3. 合併好的group/stack/object（仍稱為objects），決定bg、fg、layout、effect、mask
 * 4. 將objects置入最終的post group(稱為post)，post決定layout, bg, fg, effect, mask
 */
export function generatePost(): void {
  const nTextboxes = chance.integer({ min: 1, max: 4 });
  const nPhotos = chance.integer({ min: 1, max: 2 });
  // const nIcons = faker.random.number({ min: 0, max: 3 });

  const objects = [];

  // 選擇stack的對象
  // 1. 取得candidates，再依照n來決定

  // 選擇
}

async function svg2png(
  converter: Converter,
  svg: string,
  saveDir = './output',
  saveFilename = 'save.png'
): Promise<void> {
  // const saveDir = path.join(root, 'export');
  if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
  }

  // const png = await converter.convert(svg, { width: 500, height: 500 });
  const png = await converter.convert(svg);
  // const png = await converter.convert(svg)
  fs.writeFileSync(path.join(saveDir, saveFilename), png);

  // let parser = csv
  //   .fromPath(path.join(root, src), { delimiter: '\t', headers: true })
  //   .on('data', async data => {
  //     console.log(data.id);
  //     parser.pause();

  //     // 將 <image ... /> 轉成local地址
  //     let svg = data.svg.replace(
  //       new RegExp('href="/image/3_2v3ghij/image', 'g'),
  //       'href="/Users/chi/Work/rateapp/tasks/task3_2/v3ghij/image'
  //     );

  //     const png = await converter.convert(svg, { width: 500, height: 500 });
  //     // const png = await converter.convert(svg)
  //     fs.writeFileSync(path.join(saveDir, data.id + '.png'), png);
  //     parser.resume();
  //   })
  //   .on('end', async () => {
  //     console.log('done');
  //     // await converter.destroy()
  //   });

  // try {
  //   for (let i = 0; i < items.length; i++) {
  //     if (i % 1000 === 0)
  //       console.log(i)
  //
  //     let x = items[i]
  //
  //     // 轉換post

  //
  //     // 轉換icon
  //     const png = await converter.convert(x.osvg, {width: 100, height: 100})
  //     fs.writeFileSync(path.join(root, 'images', x.uid + '.png'), png)
  //   }
  // } finally {
  //   await converter.destroy()
  // }
}

export async function main(withAnnotations = true): Promise<void> {
  const IMG_WIDTH = 512;
  const IMG_HEIGHT = 512;
  const NUM_POSTS = 1;

  // const textbox = new TextBox();
  // const textboxStack = new Stack([textbox]);
  // const photobox = new PhotoBox();
  // const group = new Group([textboxStack, photobox]);
  // const stack = new Stack(
  //   [group],
  //   new Box(0, 0, IMG_WIDTH, IMG_HEIGHT),
  //   undefined,
  //   { bgAlllowNull: false }
  // );
  // stack.dice();

  const converter = createConverter({
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  });

  for (let i = 0; i < NUM_POSTS; i++) {
    console.log(i);

    const group = new Stack(
      [new PhotoBox()],
      new Box(0, 0, IMG_WIDTH, IMG_HEIGHT)
    );

    group.dice();

    const draw = makeCanvas(IMG_WIDTH, IMG_HEIGHT);
    group.render(draw);
    const svg = draw.svg();
    await svg2png(converter, svg, './output/images', `${i}_crowd.png`);

    // function rootRenderFn(annComp: Component): Container {
    //   const draw = makeCanvas(IMG_WIDTH, IMG_HEIGHT);
    //   group.render(draw, true, annComp);
    //   return draw;
    // }

    // const anns = group.renderAnnotations(rootRenderFn);
    // for (let j = 0; j < anns.length; j++) {
    //   await svg2png(
    //     converter,
    //     anns[j].svg,
    //     './output/annotations',
    //     `${i}_crowd_${anns[j].label.toLowerCase()}_${j}.png`
    //   );
    // }
  }

  await converter.destroy();
}

// "<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512"><g transform="matrix(1,0,0,1,0,0)"><g><rect width="512" height="512" x="0" y="0" fill="#310318"></rect></g><g><image width="0" height="0" href="/users/chi/documents/github/coordconv-pytorch/data/facebook/334752_541304355895878_589460923_o.jpg"></image></g></g></svg>"
// "<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512"><g transform="matrix(1,0,0,1,0,0)"><g><rect width="512" height="512" x="0" y="0" fill="#345801"></rect></g><g><image width="0" height="0" href="file:////users/chi/documents/github/coordconv-pytorch/data/facebook/922117_706117639414548_2002491177_o.jpg"></image></g></g></svg>"
// "<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="512" height="512"><g transform="matrix(1,0,0,1,0,0)"><g><rect width="512" height="512" x="0" y="0" fill="#3a4973"></rect></g><g><image width="100" height="100" href="file:////users/chi/documents/github/coordconv-pytorch/data/facebook/679955_556161864410127_792000981_o.jpg"></image></g></g></svg>"
