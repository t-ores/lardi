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
            const button = await page.$('li.paginator_next')
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
                })
            })
            console.log('res:', res);
            return res
        })


        for(let i = 0; i < html.length; i++){
            await page.goto(html[i].link, {waitUntil: 'domcontentloaded'})
            await page.waitForSelector('article.ocp-body').catch(e => console.log(e))
            console.log(i)

            let from = await page.evaluate(async () => {
                let from = null
                try {
                    from = document.querySelector('#button-show-to-waypoints-map > div > div > ul > li > a').innerText
                }catch (e) {
                    console.log(e)
                    from = null
                }
                return from
            })

            let to = await page.evaluate(async () => {
                let to = null
                try {
                    to = document.querySelector('#button-show-to-waypoints-map > div > div > ul > li > a').innerText
                }catch (e) {
                    console.log(e)
                    to = null
                }
                return to
            })

            html[i]['from'] = from
            html[i]['to'] = to
            //#button-show-to-waypoints-map > div > div > ul > li > a

        }
        console.log('Заявок по вантажу:', html.length)



        //await browser.close()
        //fs.writeFile("medusa.json", JSON.stringify(html), function (err) {
        fs.writeFile("lardi-trans.json", JSON.stringify(html), function (err) {
            if(err) throw err
            console.log('Всі данні записані в файл "lardi-trans.json"')// + path.dirname(__filename))
        })
    }catch (e) {
        //await browser.close()
        console.log(e);
    }
}

getFreight(0)