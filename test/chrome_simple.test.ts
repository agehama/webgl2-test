const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

async function remoteEval(expr: string, port: number, chromeFlags: string[] = [])
{
    const chrome = await chromeLauncher.launch({ chromeFlags: chromeFlags });
    const protocol = await CDP({port: chrome.port});
    
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: `http://localhost:${port}`});

    return new Promise((resolve: (x:any) => void) =>
    {
        Page.loadEventFired(async () =>
        {
            const {result: {value}} = await Runtime.evaluate({ expression: expr });
            protocol.close();
            chrome.kill(); 
            resolve(value);
        });
    });
}

const call_webglSimple = `(() =>
{
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl2");
    return webglSimple(gl);
})()`;

test("simple (chrome headless)", (async function()
{
    return remoteEval(call_webglSimple, 8080, ['--headless']).then(
        (result:any) =>
        {
            console.log(result);
            expect(`${result}`).not.toBe(``);
        });
}), 60000);

test("simple (chrome browser)", (async function()
{
    return remoteEval(call_webglSimple, 8080, []).then(
        (result:any) =>
        {
            console.log(result);
            expect(`${result}`).not.toBe(``);
        });
}), 60000);
