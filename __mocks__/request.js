const mockData = require('./web-crawler-data.mock')

module.exports = (url, callback) => {
    let body = '<body></body>';
    let error = null;
    let statusCode = 200;

    if(url === 'https://example.com/mock-single-page') {
        body = mockData.mockSinglePageVisit;
    }

    if(url === 'https://example.com/mock-error-page') {
        statusCode = 400;
        body = mockData.mockSinglePageVisit
    }

    if(url === 'https://example.com/mock-network-error') {
        statusCode = 400;
        body = mockData.mockSinglePageVisit
    }

    if(url === 'https://example.com/test1.html') {
        body = '<div><a href="/test77.html"></a></div>'
    }

    return callback(error, {statusCode}, body);
};

