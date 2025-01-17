const { normalizeURL, getURLsFromHTML } = require('../src/crawl')
const { test, expect } = require('@jest/globals')

test("normalizeURL strip https protocol", () => {
    const input = "https://blog.boot.dev/path"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test("normalizeURL strip http protocol", () => {
    const input = "http://BLOG.boot.dev/path/"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test("normalizeURL capitals", () => {
    const input = "https://BLOG.boot.dev/path/"
    const actual = normalizeURL(input)
    const expected = "blog.boot.dev/path"
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML absolute", () => {
    const inputHTMLDoc = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/">
                Boot.dev Blog
            </a>
        </blog>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLDoc, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML relative", () => {
    const inputHTMLDoc = `
    <html>
        <body>
            <a href="/path/">
                Boot.dev Blog
            </a>
        </blog>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLDoc, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML absolute and relative", () => {
    const inputHTMLDoc = `
    <html>
        <body>
        <a href="https://blog.boot.dev/path1/">
            Boot.dev Blog
        </a>
        <a href="/path2/">
            Boot.dev Blog
        </a>
        </blog>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLDoc, inputBaseURL)
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]
    expect(actual).toEqual(expected)
})

test("getURLsFromHTML invalid", () => {
    const inputHTMLDoc = `
    <html>
        <body>
        <a href="invalid">
            Boot.dev Blog
        </a>
        </blog>
    </html>
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLDoc, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})