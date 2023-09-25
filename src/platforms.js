const Platforms = [
  require('./PlatformWien')
]
const platforms = Platforms.map(P => new P())
