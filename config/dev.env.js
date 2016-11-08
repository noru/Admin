var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ENDPOINT: '"https://venus-dev.autodesk.com"',
  AUTH_SERVER: '"https://developer-stg.api.autodesk.com"',
  ACCOUNT_SERVER: '"https://accounts-staging.autodesk.com"',
  AUTH_PATH : '"/authentication/v1/authorize"',
  CLIENT_ID : '"2c6rWKnGy970NUm0eYTk7CfsSG3ck4fU"',
  REDIRECT_PATH : '"/admin/index.html%23!/callback/"'
})
