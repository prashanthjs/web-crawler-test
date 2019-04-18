const WebCrawler = require('./web-crawler');
const UrlParse = require('url-parse');
const X2JS = require('x2js');

/**
 * Initialises the web crawler and prints the info onto screen in xml or plain format
 * @param website
 * @param format
 * @param maxPagesToVisit
 * @param logger
 */
module.exports = function init(website, format, maxPagesToVisit = 10, logger) {
    const url = UrlParse(website);
    if (!url.hostname) {
        logger.error('invalid hostname');
        return;
    }

    if (!['xml', 'plain'].includes(format)) {
        logger.error('invalid format provided');
        return;
    }
    const webCrawler = new WebCrawler(website, maxPagesToVisit);
    webCrawler.start((error) => {
        if (error) {
            logger.error(error);
        }
        if (format === 'xml') {
            xmlFormatter(webCrawler.getPages(), webCrawler.getImages(), logger);
        } else {
            plainFormatter(webCrawler.getPages(), webCrawler.getImages(), logger);
        }
    });
}

/**
 * Web crawler info is printed onto the screen in plain format
 * @param pages
 * @param images
 * @param logger
 */
function plainFormatter(pages, images, logger) {
    pages.forEach(page => logger.log(page));
    images.forEach(image => logger.log(image));
}

/**
 * Web crawler info is printed onto the screen in xml format
 * @param pages
 * @param images
 * @param logger
 */
function xmlFormatter(pages, images, logger) {
    const x2js = new X2JS();

    const json = {
        sitemap: {
            url: [
                ...pages.map(page => ({loc: page})),
                ...images.map(image => ({image: image}))
            ]
        }
    };

    logger.log(x2js.js2xml(json));
}
