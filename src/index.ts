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

uniform vec2 u_resolution;
out vec4 outColor[4];

void main()
{
    vec2 xy = gl_FragCoord.xy / vec2(u_resolution);
    outColor[0] = vec4(xy, 0.0, 1.0);
    outColor[1] = vec4(xy, 0.25, 1.0);
    outColor[2] = vec4(xy, 0.5, 1.0);
    outColor[3] = vec4(xy, 0.75, 1.0);
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
    const depth = 2;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA, width, height, depth, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    /*
    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    for(let z = 0; z < 4; z++)
    {
        gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + z, texture, 0, z);
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2, gl.COLOR_ATTACHMENT3]);

    const locResolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(locResolution, width, height);
    
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.flush();

    const pixels = new Uint8Array(4*width*height);
    for(let z = 0; z < 4; z++)
    {
        gl.readBuffer(gl.COLOR_ATTACHMENT0 + z);
        gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        console.log(pixels);
    }
    */

    return true;
}