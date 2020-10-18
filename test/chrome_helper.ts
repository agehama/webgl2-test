const puppeteer = require('puppeteer');

export async function remoteEval(expr: () => any, port: number, headless: boolean, chromeFlags: string[] = [])
{
    return new Promise(async (resolve: (x:any) => void) =>
    {
        const browser = await puppeteer.launch({ headless: headless, args: chromeFlags });
        const page = await browser.newPage();
        await page.goto(`http://localhost:${port}`);

        const result = await page.evaluate(expr);

        await browser.close();
        resolve(result);
    });
}
