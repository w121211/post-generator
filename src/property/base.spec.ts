import test from 'ava';
import { Box } from './base';
import { align, AlignConfig } from './align';

test('align', t => {
  const bs = [new Box(0, 0, 10, 20), new Box(0, 0, 10, 20)];

  align(bs.map(a => a), new AlignConfig());
  t.is(bs, []);

  // t.is(b instanceof Property, true);
  // t.is(b instanceof Property, false);
});
