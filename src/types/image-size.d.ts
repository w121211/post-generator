declare module 'image-size' {
  export interface Dimensions {
    width: number;
    height: number;
    type: string;
  }

  function sizeOf(path: string): Dimensions;

  export default sizeOf;
}
