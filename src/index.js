const WebCrawlerInit = require('./web-crawler-init');

const [nodeScript, file, website, format = 'plain', maxPagesToVisit = 10] = process.argv;
WebCrawlerInit(website, format, maxPagesToVisit, console);


