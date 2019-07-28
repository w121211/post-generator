import test from 'ava';
import * as faker from 'faker/locale/zh_CN';
import { makeCanvas } from '../common/svg';
import { Font } from './font';
import { Color } from './properties';
import { IComponent } from './base';
import { Property, Box } from './properties';

function align(components: IComponent[]) {}

test('faker', t => {
  const b = new Box(0, 0, 100, 100);

  t.is(b instanceof Property, true);
  t.is(b instanceof Property, false);
});

// test('text', t => {
//   const draw = makeCanvas(128, 128);
//   const text = new Text(new Font(), new Color());
//   t.is(
//     text.render(draw).svg(),
//     '<g transform="matrix(0.024,0,0,-0.024,0,24)" fill="#000000"><path d="M464 87Q464 24 470 0Q462 -8 452 -8Q435 -8 435 14L434 298Q434 393 402.5 438.5Q371 484 301 484Q262 484 222 461.5Q182 439 154.5 386Q127 333 127 247Q127 97 128 57Q129 17 133 0Q125 -8 115 -8Q98 -8 98 14L97 706Q97 728 116 728Q126 728 134 720Q129 702 128 640L127 383Q148 443 197 477.5Q246 512 304 512Q463 512 463 297L464 87Z" transform="matrix(1,0,0,1,0,0)"></path><path d="M427 115Q441 110 441 95Q441 87 435 72Q417 31 372 9.5Q327 -12 268 -12Q166 -12 109.5 53Q53 118 53 243Q53 369 110.5 440.5Q168 512 276 512Q351 512 394.5 476Q438 440 438 375Q438 300 377.5 262Q317 224 201 224Q149 224 85 234Q88 119 140 68Q192 17 271 17Q328 17 371 41.5Q414 66 427 115ZM274 485Q190 485 139 428Q88 371 85 259Q148 249 213 249Q308 249 357.5 280.5Q407 312 407 375Q407 433 368.5 459Q330 485 274 485Z" transform="matrix(1,0,0,1,554,0)"></path><path d="M164 -10Q132 -10 113 11.5Q94 33 94 73L94 706Q94 728 113 728Q123 728 131 720Q127 710 126 656.5Q125 603 125 524L124 71Q124 46 134.5 32Q145 18 165 18Q179 18 191 25Q203 32 209 45Q218 35 218 24Q218 8 202 -1Q186 -10 164 -10Z" transform="matrix(1,0,0,1,1051,0)"></path><path d="M164 -10Q132 -10 113 11.5Q94 33 94 73L94 706Q94 728 113 728Q123 728 131 720Q127 710 126 656.5Q125 603 125 524L124 71Q124 46 134.5 32Q145 18 165 18Q179 18 191 25Q203 32 209 45Q218 35 218 24Q218 8 202 -1Q186 -10 164 -10Z" transform="matrix(1,0,0,1,1301,0)"></path><path d="M267 -12Q166 -12 109.5 57Q53 126 53 250Q53 374 109.5 443Q166 512 267 512Q368 512 424.5 443Q481 374 481 250Q481 126 424.5 57Q368 -12 267 -12ZM267 16Q353 16 401 78Q449 140 449 250Q449 360 401 422Q353 484 267 484Q181 484 133 422Q85 360 85 250Q85 140 133 78Q181 16 267 16Z" transform="matrix(1,0,0,1,1551,0)"></path></g>'
//   );
//   t.deepEqual(text.renderAnnotations(), [
//     {
//       svg:
//         '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="0" height="0"><g transform="matrix(0.024,0,0,-0.024,0,24)" fill="#000000"><path d="M464 87Q464 24 470 0Q462 -8 452 -8Q435 -8 435 14L434 298Q434 393 402.5 438.5Q371 484 301 484Q262 484 222 461.5Q182 439 154.5 386Q127 333 127 247Q127 97 128 57Q129 17 133 0Q125 -8 115 -8Q98 -8 98 14L97 706Q97 728 116 728Q126 728 134 720Q129 702 128 640L127 383Q148 443 197 477.5Q246 512 304 512Q463 512 463 297L464 87Z" transform="matrix(1,0,0,1,0,0)"></path><path d="M427 115Q441 110 441 95Q441 87 435 72Q417 31 372 9.5Q327 -12 268 -12Q166 -12 109.5 53Q53 118 53 243Q53 369 110.5 440.5Q168 512 276 512Q351 512 394.5 476Q438 440 438 375Q438 300 377.5 262Q317 224 201 224Q149 224 85 234Q88 119 140 68Q192 17 271 17Q328 17 371 41.5Q414 66 427 115ZM274 485Q190 485 139 428Q88 371 85 259Q148 249 213 249Q308 249 357.5 280.5Q407 312 407 375Q407 433 368.5 459Q330 485 274 485Z" transform="matrix(1,0,0,1,554,0)"></path><path d="M164 -10Q132 -10 113 11.5Q94 33 94 73L94 706Q94 728 113 728Q123 728 131 720Q127 710 126 656.5Q125 603 125 524L124 71Q124 46 134.5 32Q145 18 165 18Q179 18 191 25Q203 32 209 45Q218 35 218 24Q218 8 202 -1Q186 -10 164 -10Z" transform="matrix(1,0,0,1,1051,0)"></path><path d="M164 -10Q132 -10 113 11.5Q94 33 94 73L94 706Q94 728 113 728Q123 728 131 720Q127 710 126 656.5Q125 603 125 524L124 71Q124 46 134.5 32Q145 18 165 18Q179 18 191 25Q203 32 209 45Q218 35 218 24Q218 8 202 -1Q186 -10 164 -10Z" transform="matrix(1,0,0,1,1301,0)"></path><path d="M267 -12Q166 -12 109.5 57Q53 126 53 250Q53 374 109.5 443Q166 512 267 512Q368 512 424.5 443Q481 374 481 250Q481 126 424.5 57Q368 -12 267 -12ZM267 16Q353 16 401 78Q449 140 449 250Q449 360 401 422Q353 484 267 484Q181 484 133 422Q85 360 85 250Q85 140 133 78Q181 16 267 16Z" transform="matrix(1,0,0,1,1551,0)"></path></g></svg>',
//       label: 'Text'
//     }
//   ]);
// });

// test('stack', t => {
//   const draw = makeCanvas(128, 128);
//   const text = new Text(new Font(), new Color());
//   const stack = new ComponentStack([text], 128, 128);

//   stack.dice();
//   // stack.render(draw)
//   t.is(text.root, stack);
//   t.is(text.parent, stack);

//   text.render(draw);
//   t.deepEqual(stack.renderAnnotations(), [
//     {
//       svg: draw.svg(),
//       label: 'Text'
//     }
//   ]);
// });
