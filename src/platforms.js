const Platforms = [
  require('./PlatformWien'),
  require('./PlatformMeinAufstehn'),
  require('./PlatformOpenPetition'),
  require('./PlatformGruene')
]
module.exports = Platforms.map(P => new P())
