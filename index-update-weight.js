const puppeteer = require('puppeteer');
const weight = require('./dataWeight').weight;
const price = require('./dataPrice').price;

const country = 'Zone 5';
const profile = 'https://rak-wireless.myshopify.com/admin/settings/shipping/profiles/35390586925';
// console.log(price.length)

// https://rak-staging.myshopify.com/
// username: webmaster@rakwireless.com
// password: h2,z6CmLY,n2f9M3AAqqJJ5Dh!ps

(async () => {
    /* const browser = await puppeteer.launch({headless:false});
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(admin);
    await page.waitForSelector('button')
    await page.type('#account_email', username);
    
    await page.setDefaultNavigationTimeout(0); 

    await page.waitForNavigation();
    await page.waitForTimeout(4000)
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    //     page.click('button[type="submit"]')
    //   ]);
    await page.waitForSelector('button')
    await page.type('#account_password', password);
    await page.setDefaultNavigationTimeout(0); 

    await page.waitForNavigation();
    // await Promise.all([
    //     page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    //     page.click('button[type="submit"]')
    //   ]);
      await page.waitForTimeout(4000)

      //phone verification
      await page.setDefaultNavigationTimeout(0); 
      await page.waitForNavigation();
    */
    const wsChromeEndpointurl = 'ws://127.0.0.1:9222/devtools/browser/3c08c827-6f28-47a3-885e-9b6c95ac86be';
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

    await page.evaluate(async (country)=>{
        
        console.log("card")
        let tab= document.querySelectorAll('.Polaris-Card__Section_1b1h1') //get all cards
        let t = [...tab]
        let tb = t.find(tt=>{ //find cards that has country of
            if(tt.querySelector('.rktcL')!=null){
                return tt.querySelector('.rktcL').innerHTML==country
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

    for(let i=0;i<=252;i++){
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
                if(tt.querySelector('.rktcL')!=null){
                    return tt.querySelector('.rktcL').innerHTML==country
                }
            })

            
            console.log('select table')
            let table = tb.querySelector('.Polaris-DataTable_1pikz')

            //click option
            let tr = table.querySelectorAll('tr')[i+1]
            tr.querySelector('.Polaris-Button_r99lw.Polaris-Button--plain_2z97r.Polaris-Button--iconOnly_viazp').click()
            
            
            


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

           

            return true
            
        },country,i)
        
        //done

        let input = await page.$('#maximum-condition-field');
        await input.click({ clickCount: 3 })
        await page.type('#maximum-condition-field',(weight[i+1])+'')

        input = await page.$('#minimum-condition-field');
        await input.click({ clickCount: 3 })
        await page.type('#minimum-condition-field',(weight[i])+.01+'')

        await page.click('.Polaris-Modal-Dialog__Modal_2v9yc .Polaris-Button_r99lw.Polaris-Button--primary_7k9zs')
    }

})();