const chromeLauncher = require('chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');
const puppeteer = require('puppeteer');

test("simple test", (async function()
{
    const chrome = await chromeLauncher.launch(
    {
        chromeFlags: [
          '--headless',
        ]
    });

    const protocol = await chromeRemoteInterface({port: chrome.port});

    const {Page, Runtime, Log, Console} = protocol;
    await Promise.all([Page.enable(), Runtime.enable(), Log.enable(), Console.enable()]);

    Runtime.consoleAPICalled((text: any) =>
    {
        console.log(text);
    });

    Page.navigate({url: 'http://localhost:8080'});

    // await Page.loadEventFired();

    const js = `(()=>{
        const canvas = document.getElementById("gl");
        const gl = canvas.getContext("webgl2");
        if(!gl)
        {
            console.log("error: webgl2 context is null");
            return "error: webgl2 context is null";
        }
        return webgl2TestFunc(gl);})()`;
    
    // const result = await Runtime.evaluate({expression: js});

    // //console.log(`result: ${result.result.value}`);
    // console.log(`result: ${result.result.value}`);
    // protocol.close();
    // chrome.kill();

    const promise = new Promise((resolve: (x:boolean)=>void) =>
    {
        Page.loadEventFired(async () =>
        {
            const {result: {value}} = await Runtime.evaluate({ expression: js });
    
            console.log(`${value}`);
    
            protocol.close();
            chrome.kill(); 

            resolve(true);
        });
    });
    return promise.then((result:boolean)=>{expect(result).toBeTruthy();});
}), 60000);


/*
test("simple test", (async function()
{
    const js = `(()=>{
        const canvas = document.getElementById("gl");
        const gl = canvas.getContext("webgl2");
        if(!gl)
        {
            console.log("error: webgl2 context is null");
            return "error: webgl2 context is null";
        }
        return webgl2TestFunc(gl);})()`;

    const promise = new Promise(async (resolve: (x:boolean)=>void) =>
    {
        //const browser = await puppeteer.launch();
        const browser = await puppeteer.launch({
            headless: true,
            args: ['-—use-gl=egl']
          });

        const page = await browser.newPage();
        await page.goto('http://localhost:8080');
        const result = await page.evaluate(():any=>{
            return eval(`(()=>{
                const canvas = document.getElementById("gl");
                const gl = canvas.getContext("webgl2");
                if(!gl)
                {
                    console.log("error: webgl2 context is null");
                    return "error: webgl2 context is null";
                }
                return webgl2TestFunc(gl);})()`);
        });
        console.log(result);
        await browser.close();
        resolve(true);
    });
    return promise.then((result:boolean)=>{expect(result).toBeTruthy();});
}), 60000);*/