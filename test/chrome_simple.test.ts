const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');

async function remoteEval(expr: string, port: number, chromeFlags: string[] = [])
{
    const chrome = await chromeLauncher.launch({ chromeFlags: chromeFlags });
    const protocol = await CDP({port: chrome.port});
    
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Runtime.consoleAPICalled(({args: [{value}]}: any) =>
    {
        console.log(value);
    });

    Page.navigate({url: `http://localhost:${port}`});

    return new Promise((resolve: (x:any) => void) =>
    {
        Page.loadEventFired(async () =>
        {
            const {result: {value}} = await Runtime.evaluate({ expression: expr });

            console.log(value);
    
            protocol.close();
            chrome.kill(); 
            resolve(value);
        });
    });
}

const expr = `(()=>
{
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl2");
    return webglSimple(gl);
})()`;

test("simple (chrome headless)", (async function()
{
    return remoteEval(expr, 8080, ['--headless']).then(
        (result:any) =>
        {
            expect(`${result}`).not.toBe(``);
        });
}));

test("simple (chrome browser)", (async function()
{
    return remoteEval(expr, 8080, []).then(
        (result:any) =>
        {
            expect(`${result}`).not.toBe(``);
        });
}));
/*test("chrome - simple", (async function()
{
    const chrome = await chromeLauncher.launch(
    {
        chromeFlags: [
          '--headless',
        ]
    });
    const protocol = await CDP({port: chrome.port});
    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);
    Runtime.consoleAPICalled(({args: [{value}]}: any) =>
    {
        console.log(value);
    });
    Page.navigate({url: 'http://localhost:8080'});
    // await Page.loadEventFired();
    const js = `(()=>{
        const canvas = document.querySelector("canvas");
        const gl = canvas.getContext("webgl2");
        return webglSimple(gl);})()`;
    
    // const result = await Runtime.evaluate({expression: js});
    // //console.log(`result: ${result.result.value}`);
    // console.log(`result: ${result.result.value}`);
    // protocol.close();
    // chrome.kill();
    const promise = new Promise((resolve: (x:string)=>void) =>
    {
        Page.loadEventFired(async () =>
        {
            const {result: {value}} = await Runtime.evaluate({ expression: js });
            const resultString = `${value}`;

            console.log(resultString);
    
            protocol.close();
            chrome.kill(); 
            resolve(resultString);
        });
    });
    return promise.then((result:string)=>{expect(result).toBeTruthy();});
}));*/