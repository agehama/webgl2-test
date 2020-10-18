import {remoteEval} from "./chrome_helper";

const call_webglTexture3d = () =>
{
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl2");
    return webglTexture3d(gl);
};

test("texture3d (chrome headless)", (async function()
{
    return remoteEval(call_webglTexture3d, 8080, true).then(
        (result:any) =>
        {
            console.log(result);
            expect(`${result}`).not.toBe([]);
        });
}), 60000);

test("texture3d (chrome browser)", (async function()
{
    return remoteEval(call_webglTexture3d, 8080, false).then(
        (result:any) =>
        {
            console.log(result);
            expect(`${result}`).not.toBe([]);
        });
}), 60000);
