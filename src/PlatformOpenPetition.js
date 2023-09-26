const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class PlatformOpenPetition {
  match (url) {
    return url.match(/^https:\/\/www\.openpetition\.eu\//)
  }

  get (url, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document

        const div = document.querySelector('span.signer-votes strong')

        const result = {
          count: parseInt(div.textContent.trim())
        }

        callback(null, result)
     })
  }
}

function convertDate (date) {
  return date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
}
