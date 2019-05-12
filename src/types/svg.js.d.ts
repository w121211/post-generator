import { Context } from "@svgdotjs/svg.js"

declare module "@svgdotjs/svg.js" {
    interface Context {
        resource: any;
    }
}