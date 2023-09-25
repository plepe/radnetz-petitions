const Platforms = [
  require('./PlatformWien'),
  require('./PlatformMeinAufstehn'),
  require('./PlatformGruene')
]
module.exports = Platforms.map(P => new P())
