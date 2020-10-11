import {add} from "../src/index";
const nodeGles = require('node-gles');

test("add", () =>
{
    expect(add(1, 1)).toBe(2);
});

test("gles", () =>
{
    const gl = nodeGles.binding.createWebGLRenderingContext();
    expect(gl).not.toBeNull();
});