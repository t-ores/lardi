const fs = require('fs')
const path = require('path')
const puppeteer = require ('puppeteer')

const link = 'https://lardi-trans.ua/'

/*-------------customChrome----------------------------------*/
// let customChrome = path.resolve(__dirname, './customChrome');
// let prefs = fs.readFileSync(customChrome+'/Default/Preferences');
// let obj = JSON.parse(prefs);
// obj.savefile.default_directory = path.resolve(__dirname, './downloads');
// obj.download.default_directory = path.resolve(__dirname, './downloads');
// fs.writeFileSync(customChrome+'/Default/Preferences', JSON.stringify(obj));
/*-------------customChrome----------------------------------*/
const customChrome = '.config/google-chrome'


const getFreight = async click => {
    try{
        let browser = await puppeteer.launch({
            userDataDir: customChrome,
            headless:false,
            slowMo: 1,
            ignoreHTTPSErrors:true,
            devtools: true
            //args:[--mute-audio]
        })
        let page = await browser.newPage()
        await page.setViewport({
            width: 1024,
            height: 1024
        })
        //GO TO & WAIT FOR SELECTOR
        await page.goto(link, {waitUntil: 'domcontentloaded' })
        await page.waitForSelector('div#main-page-search')
        //GO TO & WAIT FOR SELECTOR

        //ENTER CITY IN SEARCH COLUMN LEFT
        const search_column_left = await page.$('div.main-page-search__column_left input')
        await search_column_left.click()
        await search_column_left.type('Україна')
        await page.keyboard.press('Enter');
        //ENTER CITY IN SEARCH COLUMN LEFT

        //ENTER CITY IN SEARCH COLUMN RIGHT
        const search_column_right = await page.$('div.main-page-search__column_right input')
        await search_column_right.click()
        await search_column_right.type('Україна')
        await page.keyboard.press('Enter');
        //ENTER CITY IN SEARCH COLUMN RIGHT

        //SEARCH START
        //main-page-search__submit
        const search_submit = await page.$('button.main-page-search__submit')
        await search_submit.click()
        //SEARCH END

        await page.waitForSelector('div.ps_search-result_data')
        await console.log('search result data loaded')


        for (let i = 0; i < click; i++){
            const button = await page.$('a.tp_next-page')
            //const button = await page.$('button[data-testid="button"]')
            await button.click()
            console.log('button clicked!!!')
        }

        let html = await page.evaluate(async () => {
            let res = []
            let container = await document.querySelectorAll('div.ps_search-result_data-item')

            container.forEach(item =>{
                let data_ps_id = item.querySelector('div.ps_data_wrapper').getAttribute('data-ps-id')
                console.log(data_ps_id)

                let link = `https://lardi-trans.ua/gruz/view/${data_ps_id}/`
                // let countries = item.querySelector('div.ps_data_wrapper > div.ps_data-countries > span.ps_data_direction').innerText
                // let date = item.querySelector('div.ps_data_wrapper > div.ps_data-date').innerText
                // let from = item.querySelector('div.ps_data_wrapper > div.ps_data-from').innerText
                // let where = item.querySelector('div.ps_data_wrapper > div.ps_data-where').innerText
                // let distance = item.querySelector('div.ps_data_wrapper > div.ps_data.ps_data-countries > a > span').getAttribute('data-distance')
                // let cargo = item.querySelector('div.ps_data_wrapper > div.ps_data-cargo').innerText
                
                //ps_data-cargo
                //let cargo = item.querySelector('div.ps_data_wrapper > div.').innerText
                
                /*
                try {
                    img = item.querySelector('div.ChronologyItem-image').getAttribute('style')
                }catch (e) {
                    img = null
                }
                */

                res.push({
                    link
                    // countries,
                    // date,
                    // from,
                    // where,
                    // distance,
                    // cargo
                    // time,
                    // link,
                    // img
                })
            })
            console.log('res:', res);
            return res
        })


        for(let i = 0; i < html.length; i++){
            await page.goto(html[i].link, {waitUntil: 'domcontentloaded'})
            await page.waitForSelector('div.GeneralMaterial-article').catch(e => console.log(e))
            console.log(i)
            let article = await page.evaluate(async () => {
                let article = null
                try {
                    article = document.querySelector('div.GeneralMaterial-article').innerText
                }catch (e) {
                    article = null
                }
                return article
            })
            let posttime = await page.evaluate(async () => {
                let posttime = null
                try {
                    posttime = document.querySelector('time.Timestamp-module_root__coOvT').innerText
                }catch (e) {
                    posttime = null
                }
                return posttime
            })
            html[i]['text'] = article
            html[i]['posttime'] = posttime
        }
        console.log('news lenght - ', html.length)



        //await browser.close()
        //fs.writeFile("medusa.json", JSON.stringify(html), function (err) {
        fs.writeFile("lardi-trans.json", JSON.stringify(html), function (err) {
            if(err) throw err
            console.log('lardi-trans.json saved in ' + path.dirname(__filename))
        })
    }catch (e) {
        //await browser.close()
        console.log(e);
    }
}

getFreight(0)