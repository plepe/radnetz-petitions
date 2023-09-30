const pad = n => ('0' + n).slice(-2)

module.exports = function () {
  const d = new Date()

  return d.getFullYear() + '-' +
    pad(d.getMonth() + 1) + '-' +
    pad(d.getDate())
}
