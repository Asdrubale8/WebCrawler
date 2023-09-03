const { crawlPage } = require("./crawl")
const { printReport } = require("./report")
async function main() {
    if (process.argv.length < 3) {
        console.log("No argument provided")
        process.exit(1)
    }
    if(process.argv.length > 3) {
        console.log("Only one argument is admitted")
        process.exit(1)
    }
    const baseUrl = process.argv[2]
    const pages = await crawlPage(baseUrl, baseUrl, {})

    printReport(pages)
}

main()