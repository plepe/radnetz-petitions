#!/usr/bin/env node
const async = require('async')

const DrupalRest = require('drupal-rest')
const platforms = require('./src/platforms')
const config = require('./config.json')

const drupal = new DrupalRest(config.drupal)
drupal.login((err) => {
  if (err) {
    console.error(err)
  }

  drupal.loadRestExport('petitionen.json', {}, (err, data) => {
    async.eachSeries(data, (item, done) => {
      const url = item.field_url[0].uri

      const matchingPlatforms = platforms.filter(p => p.match(url))

      if (!matchingPlatforms.length) {
        console.error("Can't find matching Platform")
        return done()
      }

      matchingPlatforms[0].get(url, (err, result) => {
        console.log(item.nid, url)
        console.log(JSON.stringify(result, null, '  '))
        done()
      })
      //update(item.nid, done)
    })
  })
})


