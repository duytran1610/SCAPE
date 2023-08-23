import scraper from './scraper.js';
import fs from 'fs';

const scrapeController = async (Browser) => {
    const url = 'https://phongtro123.com/';
    const indexs = [1, 2, 3, 4];
    try {
        let browser = await Browser;

        // call scraper
        let categories = await scraper.scrapeCategory(browser, url);
        let selectedCategories = categories.filter((item, index) => indexs.some(i => i === index));

        let result0 = await scraper.scraper(browser, selectedCategories[0].link);

        await fs.writeFile('data0.json', JSON.stringify(result0), err => {
            if (err) console.log('Write data in file .json errol: ', err);
            else console.log('Add data success!');
        });

        let result1 = await scraper.scraper(browser, selectedCategories[1].link);

        await fs.writeFile('data1.json', JSON.stringify(result1), err => {
            if (err) console.log('Write data in file .json errol: ', err);
            else console.log('Add data success!');
        });

        let result2 = await scraper.scraper(browser, selectedCategories[2].link);

        await fs.writeFile('data2.json', JSON.stringify(result2), err => {
            if (err) console.log('Write data in file .json errol: ', err);
            else console.log('Add data success!');
        });

        let result3 = await scraper.scraper(browser, selectedCategories[3].link);

        await fs.writeFile('data3.json', JSON.stringify(result3), err => {
            if (err) console.log('Write data in file .json errol: ', err);
            else console.log('Add data success!');
        });

    } catch (e) {
        console.log('Error in scapeController!');
    }
}

export default scrapeController;