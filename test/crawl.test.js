const { normalizeUrl } = require('../src/crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL', () => {
    const input = ''
    const actual = normalizeUrl(input)
    const expected = ''
    expect(actual).toEqual(expected)
})