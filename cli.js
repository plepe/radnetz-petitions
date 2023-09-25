#!/usr/bin/env node

const platforms = require('./src/platforms')

const url = process.argv[2]

const matchingPlatforms = platforms.filter(p => p.match(url))

if (!matchingPlatforms.length) {
  console.error("Can't find matching Platform")
  return
}

matchingPlatforms[0].get(url, (err, result) => {
  console.log(JSON.stringify(result, null, '  '))
})
