const nodeGles = require('node-gles');
import {webglSimple} from "../src/index";

test("simple (node-gles - ES 2.0)", () =>
{
    const gl = nodeGles.createWebGLRenderingContext({
        client_major_es_version: 2,
        client_minor_es_version: 0,
    });
    const result = webglSimple(gl);
    console.log(result);
    expect(result).not.toBe([]);
});

test("simple (node-gles - ES 3.0)", () =>
{
    const gl = nodeGles.createWebGLRenderingContext({
        client_major_es_version: 2,
        client_minor_es_version: 0,
    });
    const result = webglSimple(gl);
    console.log(result);
    expect(result).not.toBe([]);
});
