export function webglSimple(gl: WebGL2RenderingContext): string
{
    return [
        `------------------------------------------------------------`,
        `gl.RENDERER  | ${gl.getParameter(gl.RENDERER)}`,
        `gl.VERSION   | ${gl.getParameter(gl.VERSION)}`,
        `------------------------------------------------------------`,
        `gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS  | ${gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS)}`,
        `gl.MAX_CUBE_MAP_TEXTURE_SIZE         | ${gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE)}`,
        `gl.MAX_FRAGMENT_UNIFORM_VECTORS      | ${gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS)}`,
        `gl.MAX_TEXTURE_IMAGE_UNITS           | ${gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)}`,
        `gl.MAX_TEXTURE_SIZE                  | ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}`,
        `gl.MAX_VARYING_VECTORS               | ${gl.getParameter(gl.MAX_VARYING_VECTORS)}`,
        `gl.MAX_VERTEX_ATTRIBS                | ${gl.getParameter(gl.MAX_VERTEX_ATTRIBS)}`,
        `gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS    | ${gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)}`,
        `gl.MAX_VERTEX_UNIFORM_VECTORS        | ${gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS)}`,
        `------------------------------------------------------------`,
    ].join('\n');
}

export function webglTexture3d(gl: WebGL2RenderingContext): Uint8Array[]
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
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
    {
        gl.shaderSource(fs, 
`#version 300 es
precision mediump float;
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
    }

    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

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

    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    let results = [];
    const pixels = new Uint8Array(4*width*height);
    for(let z = 0; z < 4; z++)
    {
        gl.readBuffer(gl.COLOR_ATTACHMENT0 + z);
        gl.readPixels(0, 0, width, height, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, pixels);
        results.push(pixels.slice());
    }

    return results;
}
