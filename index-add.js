const puppeteer = require('puppeteer');
const weight = require('./dataWeight').weight;
const price = require('./dataPrice').price;

const country = 'Zone 30';
const username = 'webmaster@rakwireless.com';
const password = 'h2,z6CmLY,n2f9M3AAqqJJ5Dh!ps';
const profile = 'https://rak-wireless.myshopify.com/admin/settings/shipping/profiles/35390586925';
// console.log(price.length)

// https://rak-staging.myshopify.com/
// username: webmaster@rakwireless.com
// password: h2,z6CmLY,n2f9M3AAqqJJ5Dh!ps

(async () => {
    // const browser = await puppeteer.launch({headless:false});
    // const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 720 });
    // await page.goto('https://rak-wireless.myshopify.com/admin');
    // await page.waitForSelector('button')
    // await page.type('#account_email', username);
    
    // await page.waitForTimeout(4000)
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    //     page.click('button[type="submit"]')
    //   ]);
    // await page.waitForSelector('button')
    // await page.type('#account_password', password);
    // await page.waitForTimeout(4000)
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    //     page.click('button[type="submit"]')
    //   ]);


    // await page.waitForSelector('button')
    // await page.waitForTimeout(5000)
    const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/1c08d17f-a4ad-40ee-87d6-751c828542e4';
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
    });
    let pages = await browser.pages();
    let page = pages[0];
    // await page.waitForSelector('button')
    await page.waitForTimeout(5000)
    await page.goto(profile)
    await page.waitForSelector('button')
    await page.waitForTimeout(5000)
    if ((await page.$('.Polaris-Stack_32wu2.Polaris-Stack--distributionCenter_60gbr .Polaris-Button_r99lw.Polaris-Button--plain_2z97r')) !== null) {
        await page.click('.Polaris-Stack_32wu2.Polaris-Stack--distributionCenter_60gbr .Polaris-Button_r99lw.Polaris-Button--plain_2z97r')
        await page.waitForTimeout(10000)
    }

    for(let i=0;i<=price.length;i++){
        await page.evaluate(async (country)=>{
            async function delay(ms) {
                return new Promise(resolve => {
                    setTimeout(resolve, ms);
                });
            }
            
            console.log("card")
            let tab= document.querySelectorAll('.Polaris-Card__Section_1b1h1')
            let t = [...tab]
            let tb = t.find(tt=>{
            if(tt.querySelector('.rktcL')!=null){
            return tt.querySelector('.rktcL').innerHTML==country
            }
            })

            console.log("button")
            //finding add button
            let bt = tb.querySelectorAll('button')
            bt=[...bt]
            let btn = bt.find(b=>{
                if(b.querySelector('.Polaris-Button__Text_yj3uv')!=null){
                    return b.querySelector('.Polaris-Button__Text_yj3uv').innerHTML=='Add rate'
                }
            })


            // set up the mutation observer
            // await delay(1000)
            console.log('observing')
            var observer
            await new Promise(function(resolve, reject) {
                console.log('create observer')
                observer = new MutationObserver(function (mutations, me) {
                    for(let mutation of mutations){
                        if (mutation.type === 'childList') {
                            // `mutations` is an array of mutations that occurred
                            // `me` is the MutationObserver instance
                            console.log('looking')
                            let rate = document.querySelector('#RateNameSelector')
                            let adc = document.querySelector('.Polaris-Modal-Dialog__Modal_2v9yc .Polaris-Button_r99lw.Polaris-Button--plain_2z97r')
                            if (rate && adc) {
                                adc.click()
                                me.disconnect(); // stop observing
                                console.log('observer done')
                                resolve(rate)
                                return;
                            }
                        }
                    }
                });

                // start observing
                observer.observe(document, {
                    childList: true,
                    subtree: true
                });
                
                console.log('clicking add rate')
                btn.click()
            });
            console.log('observing done')
            observer = null
            return true
            
        },country)
        
        await page.type('#RateNameSelector','Standard Shipping (6-12 business days via DHL/UPS/FedEx)')
        const input = await page.$('#Rates-Cost-TextField');
        await input.click({ clickCount: 3 })
        await page.type('#Rates-Cost-TextField',price[i])
        await page.type('#minimum-condition-field',(weight[i])+'')
        await page.type('#maximum-condition-field',(weight[i+1]-.01)+'')
        await page.click('.Polaris-Modal-Dialog__Modal_2v9yc .Polaris-Button_r99lw.Polaris-Button--primary_7k9zs')
    }
})();