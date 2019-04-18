const Request = require('request');
const Cheerio = require('cheerio');
const UrlParse = require('url-parse');

/**
 * Used to Crawl through the pages
 */
class WebCrawler {

    baseUrl = '';
    startUrl = '';
    pagesVisited = {};
    imageLinks = new Set([]);
    externalLinks = new Set([]);
    numPagesVisited = 0;
    pagesToVisit = [];
    maxPagesToVisit = 10;
    doneCallback;

    constructor(startUrl, maxPagesToVisit = 30) {
        this.maxPagesToVisit = maxPagesToVisit;
        this.startUrl = startUrl;
        const url = new UrlParse(this.startUrl);
        this.baseUrl = `${url.protocol}//${url.hostname}`;
        this.numPagesVisited = 0;
    }

    /**
     * Starts the crawling
     *
     * @param doneCallback
     */
    start(doneCallback) {
        this.numPagesVisited = 0;
        this.pagesToVisit = [];
        this.pagesVisited = {};
        this.imageLinks = new Set([]);
        this.externalLinks = new Set([]);
        this.pagesToVisit.push(this.startUrl);
        this.doneCallback = doneCallback;
        this.crawl();
    }

    /**
     * Checks if pages has been crawled already or not. if not crawls
     * Also checks whether it has reached the max page visit limit
     */
    crawl = () => {
        if (this.numPagesVisited >= this.maxPagesToVisit) {
            this.doneCallback('Reached max limit');
            return;
        }

        const nextPage = this.pagesToVisit.pop();
        if (!nextPage) {
            this.doneCallback();
        } else if (nextPage in this.pagesVisited) {
            this.crawl();
        } else {
            this.visitPage(nextPage, this.crawl);
        }
    };

    /**
     * Visits the page and collects the links
     * @param url
     * @param callback
     */
    visitPage(url, callback) {
        this.pagesVisited[url] = true;
        this.numPagesVisited++;

        Request(url, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                callback();
                return;
            }
            const $ = Cheerio.load(body);
            this.collectLinks($);
            this.collectImageLinks($);
            callback();
        });
    }

    /**
     * collects the links from the passed cheerio dom object
     * @param $
     */
    collectLinks($) {
        const __self = this;
        const links = $("a");
        links.each(function () {
            const link = $(this).attr('href');
            if (typeof link !== 'string' || link.startsWith('#') || link.startsWith('mailto:') || link.startsWith('javascript:')) {
                return;
            } else if (link.startsWith('/')) {
                __self.pagesToVisit.push(__self.baseUrl + link);
            } else if (link.startsWith(__self.baseUrl)) {
                __self.pagesToVisit.push(link);
            } else {
                __self.externalLinks.add(link);
            }
        });
    }

    /**
     * collects the image links from the passed cheerio dom object
     * @param $
     */
    collectImageLinks($) {
        const __self = this;
        const imageLinks = $("img");
        imageLinks.each(function () {
            const link = $(this).attr('src');
            if (typeof link !== 'string') {
                return;
            } else if (link.startsWith('/')) {
                __self.imageLinks.add(__self.baseUrl + link);
            } else if (link.startsWith(__self.baseUrl)) {
                __self.imageLinks.add(link);
            } else {
                __self.imageLinks.add(link);
            }
        });
    }

    /**
     * Returns all the page links found
     * @returns {string[]}
     */
    getPages() {
        return Array.from(new Set([...Object.keys(this.pagesVisited), ...this.pagesToVisit, ...Array.from(this.externalLinks)]));
    }

    /**
     * Returns all the image links found
     * @returns {string[]}
     */
    getImages() {
        return Array.from(this.imageLinks);
    }
}

module.exports = WebCrawler;
