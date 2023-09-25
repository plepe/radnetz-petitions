const Platforms = [
  require('./PlatformWien')
]
module.exports = Platforms.map(P => new P())
