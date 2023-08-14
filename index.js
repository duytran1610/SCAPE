import startBrowser from "./browser.js";
import scapeController from "./scrapeController.js";

let browser = startBrowser();
scapeController(browser);