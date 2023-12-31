#!/usr/bin/env node
const async = require('async')

const DrupalRest = require('drupal-rest')
const platforms = require('./src/platforms')
const getCurrentDay = require('./src/getCurrentDay')
const config = require('./config.json')

let dryRun = false

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

            // just switching to closed -> record date
            if (result.active === false) {
              update.field_datum_ende = [{ value: getCurrentDay() }]
            }
          }
        }

        if ('startDate' in result) {
          if (!item.field_datum_start.length || result.startDate !== item.field_datum_start[0].value) {
            update.field_datum_start = [{ value: result.startDate }]
          }
        }

        if (Object.keys(update).length) {
          update.type = item.type
          if (dryRun) {
            console.log(item.nid[0].value, JSON.stringify(update, null, '  '))
            done()
          } else {
            drupal.nodeSave(item.nid[0].value, update, {}, done)
          }
        } else {
          done()
        }
      })
    }, (err) => {
      console.error(err)
    })
  })
})
