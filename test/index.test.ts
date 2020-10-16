const nodeGles = require('../temp/node-gles/build/Release/nodejs_gl_binding.node');
import {add, func} from "../src/index";

test("add", () =>
{
    expect(add(1, 1)).toBe(2);
});

test("gles 1", () =>
{
    const gl = nodeGles.createWebGLRenderingContext();
    expect(gl).not.toBeNull();
});

test("gles 2", () =>
{
    const gl = nodeGles.createWebGLRenderingContext({width: 1, height: 1});
    const result = func(gl);
    console.log(result);
    expect(result).toBe(`succeeded`);
});
