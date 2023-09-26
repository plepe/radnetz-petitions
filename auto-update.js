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

  drupal.loadRestExport('petitionen.json', { paginated: true }, (err, data) => {
    async.eachSeries(data, (item, done) => {
      const url = item.field_url[0].uri

      const matchingPlatforms = platforms.filter(p => p.match(url))

      if (!matchingPlatforms.length) {
        console.error("Can't find matching Platform")
        return done()
      }

      matchingPlatforms[0].get(url, (err, result) => {
        console.log(item.nid[0].value, url)
        const update = {}

        if ('count' in result) {
          if (!item.field_count.length || result.count !== item.field_count[0].value) {
            update.field_count = [{ value: result.count }]
            update.field_snapshots = item.field_snapshots.concat([{
              value: new Date().toISOString().substr(0, 19) + 'Z ' + result.count
            }])
          }
        }

        if ('active' in result) {
          if (!item.field_offen.length || result.active !== item.field_offen[0].value) {
            update.field_offen = [{ value: result.active }]
          }
        }

        if (Object.keys(update).length) {
          update.type = item.type
          drupal.nodeSave(item.nid[0].value, update, {}, done)
        } else {
          done()
        }
      })
    }, (err) => {
      console.error(err)
    })
  })
})


