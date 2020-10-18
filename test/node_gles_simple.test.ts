const nodeGles = require('node-gles');
import {webglSimple} from "../src/index";

test("simple (node-gles)", () =>
{
    const gl = nodeGles.createWebGLRenderingContext();
    const result = webglSimple(gl);
    console.log(result);
    expect(result).not.toBe([]);
});
