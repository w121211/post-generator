declare module 'convert-svg-to-png' {
  import { Buffer } from 'buffer';

  type Options = {
    puppeteer?: object;
    background?: string;
    baseFile?: string;
    baseUrl?: string;
    scale?: number;
    width?: number;
    height?: number;
  };

  class Converter {
    convert(input: string | Buffer, options?: Options): Promise<Buffer>;
    destroy(): Promise<void>;
  }

  export function createConverter(options?: Options): Converter;
}
