import {remoteEval} from "./chrome_helper";
import {webglSimple} from "../src/index";

const call_webglSimple = () => 
{
    const canvas = document.querySelector("canvas");
    const gl = canvas?.getContext("webgl2");
    return gl != null ? webglSimple(gl) : "";
};

test("simple (chrome headless)", (async function()
{
    return remoteEval(call_webglSimple, 8080, true).then(
        (result:any) =>
        {
            console.log(result);
            expect(`${result}`).not.toBe("");
        });
}), 60000);

test("simple (chrome browser)", (async function()
{
    return remoteEval(call_webglSimple, 8080, false).then(
        (result:any) =>
        {
            console.log(result);
            expect(`${result}`).not.toBe("");
        });
}), 60000);
