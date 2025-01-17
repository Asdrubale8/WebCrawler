const { JSDOM } = require('jsdom')

async function crawlPage(baseURL, currentURL, pages) {
    console.log(`Crawling: ${currentURL}`)
    
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    } 

    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    } else {
        pages[normalizedCurrentURL] = 1
    }

    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399) {
            console.log(`Error in fetch with status code: ${resp.status}, on page: ${currentURL}`)
        }

        const contentType = resp.headers.get("content-type")
        
        if (!contentType.includes("text/html")) {
            console.log(`Non html response, content type: ${contentType}, on page: ${currentURL}`)
        }

        const htmlDoc = await resp.text()
        const nextURLs = getURLsFromHTML(htmlDoc, baseURL)
        
        for (nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }
         
    } catch (err) {
        console.log(err)
        console.log(`Error in fetch: ${currentURL}`)
    }

    return pages
    
}

function getURLsFromHTML(htmlDoc, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlDoc)
    const linkElements = dom.window.document.querySelectorAll('a') 
    for (const linkElement of linkElements) {
        try {
            if (linkElement.href.slice(0, 1) === '/') {
                // relative
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
            } else {
                // absolute
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
            }
        } catch (err) {
            console.log(`Error with url: ${err.message}`)
        }
    }
    return urls
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    return hostPath
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage
}