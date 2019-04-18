const WebCrawler = require('./web-crawler');
const Cheerio = require('cheerio');
const mockWebCrawlerData = require('../__mocks__/web-crawler-data.mock');

describe('Web Crawler', () => {
    it('Should initialise correctly', () => {
        const webCrawler = new WebCrawler('https://example.com/test-start-url', 10);
        expect(webCrawler.baseUrl).toBe('https://example.com');
        expect(webCrawler.startUrl).toBe('https://example.com/test-start-url');
        expect(webCrawler.pagesVisited).toEqual({});
        expect(webCrawler.pagesToVisit).toEqual([]);
        expect(Array.from(webCrawler.imageLinks)).toEqual([]);
        expect(Array.from(webCrawler.externalLinks)).toEqual([]);
        expect(webCrawler.numPagesVisited).toBe(0);
        expect(webCrawler.maxPagesToVisit).toBe(10);
    });

    it('Should collect image links correctly', () => {
        const webCrawler = new WebCrawler('https://example.com/test-start-url', 10);
        const mockImageLinks = mockWebCrawlerData.mockImages;
        const $ = Cheerio.load(mockImageLinks);
        webCrawler.collectImageLinks($);
        expect(webCrawler.getImages()).toEqual(mockWebCrawlerData.expectedImages);
    });

    it('Should collect page links correctly', () => {
        const webCrawler = new WebCrawler('https://example.com/test-start-url', 10);
        const mockPageLinks = mockWebCrawlerData.mockLinks;
        const $ = Cheerio.load(mockPageLinks);
        webCrawler.collectLinks($);
        expect(webCrawler.getPages()).toEqual(mockWebCrawlerData.expectedLinks);
    });

    it('Should visit page correctly - success', (done) => {
        const webCrawler = new WebCrawler('https://example.com/test', 10);
        webCrawler.visitPage('https://example.com/mock-single-page', () => {
            expect(webCrawler.getPages()).toEqual(['https://example.com/mock-single-page', ...mockWebCrawlerData.expectedLinks]);
            expect(webCrawler.getImages()).toEqual(mockWebCrawlerData.expectedImages);
            done();
        });
    });

    it('Should visit page correctly - error page', (done) => {
        const webCrawler = new WebCrawler('https://example.com/test', 10);
        webCrawler.visitPage('https://example.com/mock-error-page', () => {
            expect(webCrawler.getPages()).toEqual(['https://example.com/mock-error-page']);
            expect(webCrawler.getImages()).toEqual([]);
            done();
        });
    });

    it('Should visit page correctly - network issue', (done) => {
        const webCrawler = new WebCrawler('https://example.com/test', 10);
        webCrawler.visitPage('https://example.com/mock-network-error', () => {
            expect(webCrawler.getPages()).toEqual(['https://example.com/mock-network-error']);
            expect(webCrawler.getImages()).toEqual([]);
            done();
        });
    });

    it('Should start & crawl', (done) => {
        const webCrawler = new WebCrawler('https://example.com/mock-single-page', 10);
        webCrawler.start((error) => {
            expect(error).toBeUndefined();

            const pages = webCrawler.getPages();
            const expectedValues = [
                'https://example.com/mock-single-page',
                'https://example.com/test77.html',
                ...mockWebCrawlerData.expectedLinks
            ];

            expectedValues.map((page) => {
                expect(webCrawler.getPages()).toContain(page);
            });
            expect(webCrawler.getPages().length).toEqual(5);
            expect(webCrawler.getImages()).toEqual(mockWebCrawlerData.expectedImages);
            done();
        });
    });

    it('Should start & crawl - should exceed limit', (done) => {
        const webCrawler = new WebCrawler('https://example.com/mock-single-page', 1);
        webCrawler.start((error) => {
            expect(error).toBeDefined();

            const pages = webCrawler.getPages();
            const expectedValues = [
                'https://example.com/mock-single-page',
                ...mockWebCrawlerData.expectedLinks
            ];

            expectedValues.map((page) => {
                expect(webCrawler.getPages()).toContain(page);
            });
            expect(webCrawler.getPages().length).toEqual(4);
            expect(webCrawler.getImages()).toEqual(mockWebCrawlerData.expectedImages);
            done();
        });
    });
});
