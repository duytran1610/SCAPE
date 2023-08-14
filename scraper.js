// get data navigation from existed web
const scrapeCategory = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        //browser new page
        let page = await browser.newPage();
        console.log('>>> Open new page ...');

        // Navigate the page to a URL
        await page.goto(url);
        console.log('>>> Access to ', url);

        // wait element id 'webpage' (element cha contain all element con) loaded in document (wait document load all elements)
        await page.waitForSelector('#webpage');
        console.log('>>> website loaded ...');

        // select all elements '#navbar-menu > ul > li'from page
        const dataCategory = await page.$$eval('#navbar-menu > ul > li', elements => {
            return elements.map(el => {
                return {
                    category: el.querySelector('a').innerText,
                    link: el.querySelector('a').href
                }
            })
        });

        // close tab
        await page.close();
        console.log('>>> Tab closed!');

        resolve(dataCategory);

    } catch (e) {
        console.log('Errol in scaper!', e);
        reject(e);
    }
})

// get data in 1 navbar
const scraper = (browser, url) => new Promise(async (resolve, reject) => {
    try {
        //browser new page
        let page = await browser.newPage();
        console.log('>>> Open new tab ...');

        // Navigate the page to a URL
        await page.goto(url);
        console.log('>>> Access to ', url);

        // wait element id 'main' (element cha contain all element con) loaded in document (wait document load all elements)
        await page.waitForSelector('#main');
        console.log('>>> Tab loaded ...');

        // object contain all data
        const scrapedData = {}

        // get header
        const headerData = await page.$eval('header', ele => {
            return {
                title: ele.querySelector('h1').innerText,
                descriptor: ele.querySelector('p').innerText
            }
        }); 
        scrapedData.header = headerData;

        // get links detail items
        const detailLinks = await page.$$eval('#left-col > section > ul > li', els => els.map(el => {
            return el.querySelector('.post-meta h3 > a').href
        }));
        
        const scraperDetail = (link) => new Promise(async (resolve, reject) => {
            try {
                let pageDetail = await browser.newPage();

                await pageDetail.goto(link);
                console.log('>>> Access to ', link);

                await pageDetail.waitForSelector('#main');

                // scrape data in link
                const detailData = {};

                // scrape imgs
                const imgs = await pageDetail.$$eval('#left-col > article > .post-images > .images-swiper-container > div.swiper-wrapper > div.swiper-slide', els => {
                    return els.map(el => el.querySelector('img')?.src).filter(el => el !== false);
                });
                detailData.imgs = imgs;

                // get header detail
                const header = await pageDetail.$eval('header', ele => {
                    return {
                        title: ele.querySelector('h1 > a').innerText,
                        star: ele.querySelector('h1 > span')?.className?.replace(/^\D+/g, ''),
                        class: {
                            content: ele.querySelector('p'),
                            classType: ele.querySelector('p > a > strong').innerText 
                        },
                        address: ele.querySelector('address').innerText,
                        attributes: {
                            price: ele.querySelector('div.post-attributes > .price > span').innerText,
                            acreage: ele.querySelector('div.post-attributes > .acreage > span').innerText,
                            published: ele.querySelector('div.post-attributes > .published > span').innerText,
                            hashtag: ele.querySelector('div.post-attributes > .hashtag > span').innerText
                        }
                    }
                });
                detailData.header = header;

                // get Thông tin mô tả
                const mainContentHeader = await pageDetail.$eval('#left-col > article > .post-main-content', 
                                                            el => el.querySelector('.section-header > h2').innerText
                                                            );
                const mainContentContent = await pageDetail.$$eval('#left-col > article > .post-main-content > .section-content > p', 
                                                            els => els.map(el => el.innerText)
                                                            );
                detailData.mainContent = {
                    header:  mainContentHeader,
                    content: mainContentContent
                }

                // get Đặc điểm tin đăng post-overview
                const overviewHeader = await pageDetail.$eval('#left-col > article > .post-overview', 
                                                            el => el.querySelector('.section-header > h3').innerText
                                                        );
                const overviewContent = await pageDetail.$$eval('#left-col > article > .post-overview > .section-content > table > tbody > tr', els => 
                                                            els.map(el => ({
                                                                name: el.querySelector('td:first-child').innerText,
                                                                content: el.querySelector('td:last-child').innerText
                                                            }))
                                                        );
                detailData.overview = {
                    header:  overviewHeader,
                    content: overviewContent
                }

                // get Thông tin liên hệ
                const contactHeader = await pageDetail.$eval('#left-col > article > .post-contact', 
                                                            el => el.querySelector('.section-header > h3').innerText
                                                        );
                const contactContent = await pageDetail.$$eval('#left-col > article > .post-contact > .section-content > table > tbody > tr', els => 
                                                            els.map(el => ({
                                                                name: el.querySelector('td:first-child').innerText,
                                                                content: el.querySelector('td:last-child').innerText
                                                            }))
                                                        );
                detailData.contact = {
                    header:  contactHeader,
                    content: contactContent
                }

                await pageDetail.close();
                console.log('>>> Tab closed! ', link);

                resolve(detailData);
            } catch (e) {
                console.log('Get data detail errol!');
                reject(e);
            }
        })

        const details = [];
        for (let link of detailLinks) {
            let detail = await scraperDetail(link);
            details.push(detail);
        }

        scrapedData.body = details;

        // close tab
        await page.close();
        console.log('>>> Tab closed!');

        resolve(scrapedData);

    } catch (e) {
        reject(e);
    }
})

export default {
    scrapeCategory,
    scraper
}