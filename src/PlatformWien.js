module.exports = class PlatformWien {
  match (url) {
    return url.match(/^https:\/\/petitionen\.wien\.gv\.at\/petition\/online\/PetitionDetail\.aspx\?PetID=/)
  }

  get (url, callback) {
    fetch(url)
      .then(req => req.text())
      .then(body => {
        const data = body.split(/\n/)
          .map(l => {
            const m = l.match(/^[, ]\/\*\[[0-9]+\]\*\//)
            if (m) {
              return JSON.parse(l.substr(m[0].length))
            }
          })
          .filter(v => v)

        const done = data[12].readOnlyLikeText ? 1 : 0

        const result = {
          title: data[0].titelHTML,
          shortText: data[6].value,
          text: data[12 + done].value,
          count: parseInt(data[14 + done].value),
          active: data[15 + done].value === 'Freigegeben',
          startDate: convertDate(data[13 + done].value)
        }

        callback(null, result)
     })
  }
}

function convertDate (date) {
  return date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
}
