const WebCrawlerInit = require('./web-crawler-init');

describe('Web Crawler Init', () => {
    it('Should initialise correctly - plain text', () => {
        const logger = {
            log: jest.fn()
        };
        const webCrawler = WebCrawlerInit('https://example.com/mock-single-page','plain', 10, logger);
        expect(logger.log).toHaveBeenCalledTimes(8);
    });
    it('Should initialise correctly - xml', () => {
        const logger = {
            log: jest.fn()
        };
        const webCrawler = WebCrawlerInit('https://example.com/mock-single-page','xml', 10, logger);
        expect(logger.log).toHaveBeenCalledTimes(1);
    });

    it('Should log error - if invalid hostname', () => {
        const logger = {
            error: jest.fn()
        };
        const webCrawler = WebCrawlerInit('https://','xml', 10, logger);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('Should log error - if invalid format', () => {
        const logger = {
            error: jest.fn()
        };
        const webCrawler = WebCrawlerInit('https://example.com/mock-single-page','dfsdfsd', 10, logger);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });

    it('Should log error - max limit reached', () => {
        const logger = {
            error: jest.fn(),
            log: jest.fn()
        };
        const webCrawler = WebCrawlerInit('https://example.com/mock-single-page','xml', 1, logger);
        expect(logger.error).toHaveBeenCalledTimes(1);
    });
});
