import fs from 'fs';
import path from 'path';
import { createConverter, Converter } from 'convert-svg-to-png';
import { makeCanvas } from '../common/svg';
import { Group } from '../component/base';
import { Font } from '../component/font';
import { Color, Box } from '../component/properties';
import { Text, TextBox } from '../component/text';
import { Rectangle } from '../component/shape';

async function svg2png(
  converter: Converter,
  svg: string,
  saveDir = './output',
  saveFilename = 'save.png'
): Promise<void> {
  // const saveDir = path.join(root, 'export');
  if (!fs.existsSync(saveDir)) fs.mkdirSync(saveDir, { recursive: true });

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
  const NUM_IMAGES = 1;

  // const rect0 = new Rectangle(new Color(), 0, 0, 512, 512);
  // const rect1 = new Rectangle(new Color());
  // const stack = new ComponentStack([rect0, rect1, text], IMG_WIDTH, IMG_HEIGHT);

  const rect0 = new Rectangle(
    new Color(),
    new Box(0, 0, IMG_WIDTH, IMG_HEIGHT)
  );
  const rect1 = new Rectangle(
    new Color(),
    new Box(undefined, undefined, undefined, undefined)
  );
  // const rect1 = new Rectangle(new Color());
  // const rect2 = new Rectangle(new Color());
  // const text = new TextBox(new Font(), new Color());
  const group = new Group(
    [rect0, rect1, new TextBox(new Text(), new Font(), new Color())],
    new Box(0, 0, IMG_WIDTH, IMG_HEIGHT)
  );

  const converter = createConverter({
    puppeteer: { args: ['--no-sandbox', '--disable-setuid-sandbox'] }
  });

  for (let i = 0; i < NUM_IMAGES; i++) {
    console.log(i);
    group.dice();

    const draw = makeCanvas(IMG_WIDTH, IMG_HEIGHT);
    group.render(draw);

    await svg2png(converter, draw.svg(), './output/images', `${i}_crowd.png`);

    if (withAnnotations) {
      const elems = group.renderAnnotations();
      for (let j in elems) {
        await svg2png(
          converter,
          elems[j]['svg'],
          './output/annotations',
          `${i}_crowd_${elems[j]['label'].toLowerCase()}_${j}.png`
        );
      }
    }
  }

  await converter.destroy();
}
