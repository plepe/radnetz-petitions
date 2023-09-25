const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class PlatformMeinAufstehn {
  match (url) {
    return url.match(/^https:\/\/mein\.aufstehn\.at\/petitions\//)
  }

  get (url, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const dom = new JSDOM(body)
        const document = dom.window.document

        const div = document.querySelector('.vue-component-loader.h-100')
        const data = JSON.parse(div.getAttribute('data-store-data'))
        console.log(JSON.stringify(data, null, '  '))

        const result = {
          count: data.progress.currentSignaturesCount,
          active: !data.petition.successful,
        }

        callback(null, result)
     })
  }
}

function convertDate (date) {
  return date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
}
