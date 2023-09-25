const jsdom = require('jsdom')
const { JSDOM } = jsdom

module.exports = class PlatformGruene {
  match (url) {
    return url.match(/^https:\/\/.*\.gruene\.at\//)
  }

  get (url, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const m = body.match(/respond_form_([0-9]+)"/)
        
        if (!m) {
          return done(new Error("Can't parse petition ID"))
        }
        
        fetch('https://respond.gruene.at/include_petition/' + m[1] + '.js')
          .then(req => req.text())
          .then(body => {
            const m = body.match(/>([0-9]+) Menschen/)
            if (!m) {
              return done(new Error("Can't parse count"))
            }

            const result = {
              count: parseInt(m[1]),
              active: true
            }

            callback(null, result)
          })
     })
  }
}

function convertDate (date) {
  return date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
}
