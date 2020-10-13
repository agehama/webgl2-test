const chromeLauncher = require('chrome-launcher');
const chromeRemoteInterface = require('chrome-remote-interface');

test("simple test", (async function()
{
    const chrome = await chromeLauncher.launch(
    {
        port: 9874,
        chromeFlags: [
          '--headless',
        ]
    });

    const protocol = await chromeRemoteInterface({port: chrome.port});

    const {Page, Runtime} = protocol;
    await Promise.all([Page.enable(), Runtime.enable()]);

    Page.navigate({url: 'http://localhost:8080'});

    await Page.loadEventFired();

    const result = await Runtime.evaluate({expression: `getString()`});

    console.log(`result: ${result.result.value}`);

    protocol.close();
    chrome.kill();

}), 60000);
