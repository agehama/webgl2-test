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
    outColor = vec4(1, 1, 0, 1);
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

    //gl.drawArrays(gl.TRIANGLES, 0, 6);
    //gl.flush();

    return true;
}