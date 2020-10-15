const main = document.getElementById("main");
if(main != null)
{
    main.innerHTML = `<h1>test1</h1>`;
}

function getString(): string[]
{
    return [`test1 test2 ab`, `abc`, `test`];
}

function webgl2TestFunc(gl: WebGL2RenderingContext): string
{
    const vs = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
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
            return "error";
        }
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    {
        gl.shaderSource(fs, 
`#version 300 es
precision mediump float;

uniform vec2 u_resolution;
out uvec4 outColor[4];

void main()
{
    uvec2 xy = uvec2(gl_FragCoord.xy);
    outColor[0] = uvec4(xy + uvec2( 0,  0), 0u, 255u);
    outColor[1] = uvec4(xy + uvec2(10, 10), 0u, 255u);
    outColor[2] = uvec4(xy + uvec2(20, 20), 0u, 255u);
    outColor[3] = uvec4(xy + uvec2(30, 30), 0u, 255u);
}`
        );
        gl.compileShader(fs);
        if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
        {
            console.log(gl.getShaderInfoLog(fs));
            return "error";
        }
    }

    const program = gl.createProgram() as WebGLProgram;
    {
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if(!gl.getProgramParameter(program, gl.LINK_STATUS))
        {
            console.log(gl.getShaderInfoLog(program));
            return "error";
        }

        gl.useProgram(program);
    }

    const width = 2;
    const height = 2;
    const depth = 4;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_3D, texture);
    gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA8UI, width, height, depth, 0, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, null);

    const fb = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    for(let z = 0; z < 4; z++)
    {
        gl.framebufferTextureLayer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + z, texture, 0, z);
    }
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1, gl.COLOR_ATTACHMENT2, gl.COLOR_ATTACHMENT3]);

    const locResolution = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(locResolution, width, height);
    
    gl.clearBufferuiv(gl.COLOR, 0, [0,0,0,0]);
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.flush();

    let results = [];
    const pixels = new Uint8Array(4*width*height);
    for(let z = 0; z < 4; z++)
    {
        gl.readBuffer(gl.COLOR_ATTACHMENT0 + z);
        gl.readPixels(0, 0, width, height, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, pixels);
        results.push(pixels.slice());
    }

    return JSON.stringify(results);
}

function getString2(): string
{
    return `test6 test7 test8`;
}
