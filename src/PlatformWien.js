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

        const result = {
          title: data[0].titelHTML,
          shortText: data[6].value,
          text: data[13].value,
          count: parseInt(data[15].value),
          active: data[16].value === 'Freigegeben',
          startDate: convertDate(data[14].value)
        }

        callback(null, result)
     })
  }
}

function convertDate (date) {
  return date.substr(6, 4) + '-' + date.substr(3, 2) + '-' + date.substr(0, 2)
}
