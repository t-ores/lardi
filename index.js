const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')

let link = 'https://lardi-trans.ua/'

const customChrome = function() {
    let customChrome = path.resolve(__dirname, './customChrome');
    let prefs = fs.readFileSync(customChrome+'/Default/Preferences');
    let obj = JSON.parse(prefs);
    obj.savefile.default_directory = path.resolve(__dirname, './downloads');
    obj.download.default_directory = path.resolve(__dirname, './downloads');
    fs.writeFileSync(customChrome+'/Default/Preferences', JSON.stringify(obj));
    return customChrome;
};

async function getFreight(){
    try {
        let browser = await puppeteer.launch({
            userDataDir: customChrome,
            headless:false,
            ignoreHTTPSErrors:true,
            slowMo:100,
            devtools: true,
            args:['--no-sandbox']
        });

        const pages = await browser.pages()
        const page = pages[0]

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
        //GET LINKS
        // const result = await page.evaluate(() => {
        //     let data = [];
        //     let link = document.querySelector('div.ps_search-result_data-item');
        //     data.push({
        //         link
        //     });
        //     console.log(data)
        //     return data;
        // });
        //GET LINKS


    }catch (e) {
        console.log(e);
    }finally {
        console.log('Fin...');
    }
}

getFreight()