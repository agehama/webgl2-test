const nodeGles = require('../temp/node-gles/src/index');
import {webglTexture3d} from "../src/index";

test("texture3d (node-gles)", () =>
{
    const gl = nodeGles.createWebGLRenderingContext();
    const result = webglTexture3d(gl);
    console.log(result);
    expect(result).not.toBe([]);
});
