//adding Puppeteer library
import puppeteer from 'puppeteer';

const startBrowser = () => {
    let browser;
    try {
        // It is used to open new browsers and connect with an instance of Chromium. 
        browser = puppeteer.launch({
            // show UI chormium?, false: show UI 
            headless: true,
            // Chorme use multiple of sandbox để tránh những content web k đáng tin cậy
            // nếu tin tưởng content thì set như sau:
            args: ['--disable-setuid-sandbox'],
            // truy cập web bỏ qua lỗi liên quan http secure
            'ignoreHTTPSErrors': true
        });
    } catch (error) {
        console.log('Start browser error!');
    }
    return browser;
}

export default startBrowser;