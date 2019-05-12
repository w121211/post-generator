declare module 'svgdom' {
  class Window {
    document: Document;
  }

  const window: Window;
  export default window;
}
