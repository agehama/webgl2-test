const nodeGles = require('node-gles');

export const add = (a: number, b: number): number => a + b;

export const func = ():boolean =>
{
    const gl = nodeGles.createWebGLRenderingContext({});

    const vs = gl.createShader(gl.VERTEX_SHADER);
    {
        gl.shaderSource(vs,
`#version 300 es

void main()
{
    vec3[6] vertices = vec3[](
        vec3(-1.0, -1.0, 0),
        vec3(+1.0, -1.0, 0),
        vec3(-1.0, +1.0, 0),
        vec3(-1.0, +1.0, 0),
        vec3(+1.0, -1.0, 0),
        vec3(+1.0, +1.0, 0)
    );

    gl_Position = vec4(vertices[gl_VertexID], 1);
}`
        );
        gl.compileShader(vs);
        if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(vs));
            return false;
        }
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    {
        gl.shaderSource(fs, 
`#version 300 es
precision mediump float;

out vec4 outColor;

void main()
{
    outColor = vec4(0, 1, 0, 1);
}`
        );
        gl.compileShader(fs);
        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(fs));
            return false;
        }
    }

    const program = gl.createProgram();
    {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.log(gl.getShaderInfoLog(program));
            return false;
        }

        gl.useProgram(program);
    }

    const width = 2;
    const height = 2;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.flush();

    const pixels = new Uint8Array(4*width*height);
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    console.log(pixels);

    return true;
}