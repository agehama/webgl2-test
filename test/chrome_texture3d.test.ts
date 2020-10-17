const puppeteer = require('puppeteer');

async function remoteEval(expr: ()=>any, port: number, headless: boolean, chromeFlags: string[] = [])
{
    return new Promise(async (resolve: (x:any) => void) =>
    {
        const browser = await puppeteer.launch({
            headless: headless,
            args: chromeFlags
        });
        const page = await browser.newPage();

        await page.goto(`http://localhost:${port}`);

        const result = await page.evaluate(expr);

        console.log(result);

        await browser.close();
        resolve(result);
    });
}

const call_webglTexture3d = ()=>eval(`(()=>
{
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl2");
    return webglTexture3d(gl);
})()`);

test("texture3d (chrome headless)", (async function()
{
    return remoteEval(call_webglTexture3d, 8080, true).then(
        (result:any) =>
        {
            expect(`${result}`).not.toBe([]);
        });
}), 60000);

test("texture3d (chrome browser)", (async function()
{
    return remoteEval(call_webglTexture3d, 8080, false).then(
        (result:any) =>
        {
            expect(`${result}`).not.toBe([]);
        });
}), 60000);
