const puppeteer = require('puppeteer');
const weight = require('./dataWeight').weight;
const price = require('./dataPrice').price;

const country = 'Zone 2';
const username = 'conrad@rakwireless.com';
const password = 'conradrakwireless';
const profile = 'https://rak-staging.myshopify.com/admin/settings/shipping/profiles/64283607207';
const admin = 'https://rak-staging.myshopify.com/admin';
// console.log(price.length)

// https://rak-staging.myshopify.com/
// username: webmaster@rakwireless.com
// password: h2,z6CmLY,n2f9M3AAqqJJ5Dh!ps

(async () => {
    // const browser = await puppeteer.launch({headless:false});
    // const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 720 });
    // await page.goto(admin);
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


    const wsChromeEndpointurl = "ws://127.0.0.1:9222/devtools/browser/c19f7e4d-de6a-499f-9a44-9776cf1c4dbf";
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsChromeEndpointurl,
        defaultViewport: {
            width:1080,
            height:720
          }
    });
    // let pages = await browser.pages();
    let page = await browser.newPage();



    await page.waitForTimeout(5000)
    await page.goto(profile)
    await page.waitForSelector('button')
    await page.waitForTimeout(10000)
    if ((await page.$('.Polaris-Stack_32wu2.Polaris-Stack--distributionCenter_60gbr .Polaris-Button_r99lw.Polaris-Button--plain_2z97r')) !== null) {
        await page.click('.Polaris-Stack_32wu2.Polaris-Stack--distributionCenter_60gbr .Polaris-Button_r99lw.Polaris-Button--plain_2z97r')
        await page.waitForTimeout(10000)
    }

    await page.evaluate(async (country)=>{
        
        console.log("card")
        let tab= document.querySelectorAll('.Polaris-Card__Section_1b1h1') //get all cards
        let t = [...tab]
        let tb = t.find(tt=>{ //find cards that has country of
            if(tt.querySelector('.gDWFh')!=null){
                return tt.querySelector('.gDWFh').innerHTML==country
            }
        })

        console.log("button")
        //finding add button
        let bt = tb.querySelectorAll('button') //select all buttons in selected card
        bt=[...bt]
        let loadRates = bt.find(b=>{ //find button that has button content of
            if(b.querySelector('.Polaris-Button__Text_yj3uv')!=null){
                return b.querySelector('.Polaris-Button__Text_yj3uv').innerHTML=='Load more rates'
            }
        })
        if(loadRates != null){
            loadRates.click()
        }
    },country)

    for(let i=0;i<=300;i++){
        await page.evaluate(async (country,i)=>{
            async function delay(ms) {
                return new Promise(resolve => {
                    setTimeout(resolve, ms);
                });
            }
            
            console.log("card")
            let tab= document.querySelectorAll('.Polaris-Card__Section_1b1h1') //get all cards
            let t = [...tab]
            let tb = t.find(tt=>{ //find cards that has country of
                if(tt.querySelector('.gDWFh')!=null){
                    return tt.querySelector('.gDWFh').innerHTML==country
                }
            })

            
            console.log('select table')
            let table = tb.querySelector('.Polaris-DataTable_1pikz')

            //click option
            console.log('select row')
            // let tr = table.querySelectorAll('tr')[1]
            let tr = table.querySelectorAll('tr')
            let selectedtr = tr[tr.length-1]
            selectedtr.querySelector('.Polaris-Button_r99lw.Polaris-Button--plain_2z97r.Polaris-Button--iconOnly_viazp').click()
            console.log('select row option')
            
            
            


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
                            if (rate) {
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
                
                console.log('clicking edit rate')                
                //click edit
                document.getElementsByClassName('Polaris-ActionList__Item_yiyol')[0].click()
            });
            console.log('observing done')
            observer = null

            let input = document.getElementById("RateNameSelector"); 
            let lastValue = input.value;
            input.value = 'Standard Shipping';
            let event = new Event('input', { bubbles: true });
            event.simulated = true;
            let tracker = input._valueTracker;
            if (tracker) {
            tracker.setValue(lastValue);
            }
            input.dispatchEvent(event);

            return true
            
        },country,i)
        
        await page.click('.Polaris-Modal-Dialog__Modal_2v9yc .Polaris-Button_r99lw.Polaris-Button--primary_7k9zs')
    }

})();