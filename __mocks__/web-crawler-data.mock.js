const mockLinks = `
        <div>
                <a href="/test1.html" />
                <a href="https://example.com/test2.html" />
                <a href="/test2.html" />
                <a href="https://external.com/test.html" />
                <a href="#" />
                <a href="javascript:void(0);" />
                 <a href="mailto:test@test.com;" />
              
        </div> 
`;

const expectedLinks = [
    'https://example.com/test1.html',
    'https://example.com/test2.html',
    'https://external.com/test.html',
];

const mockImages = `
        <div>
                <img src="/test1.jpg" />
                <img src="https://example.com/test2.jpg" />
                <img src="/test2.jpg" />
                <img src="https://external.com/test.jpg" />
        </div> 
`;

const expectedImages = [
    'https://example.com/test1.jpg',
    'https://example.com/test2.jpg',
    'https://external.com/test.jpg',
];

const mockSinglePageVisit = `
        <body>
        ${mockLinks}
        ${mockImages}
            </body>
`;


module.exports = {
    mockSinglePageVisit,
    mockLinks,
    expectedLinks,
    mockImages,
    expectedImages
}
