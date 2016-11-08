var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  USE_MOCK: 'true',
  API_ENDPOINT: '"https://venus-dev.autodesk.com"',
  AUTH_SERVER: '"https://developer-stg.api.autodesk.com"',
  ACCOUNT_SERVER: '"https://accounts-staging.autodesk.com"',
  AUTH_PATH : '"/authentication/v1/authorize"',
  CLIENT_ID : '"tIbRNfTZKmdxOFs9WgzVnANqG8p7Gm0J"',
  REDIRECT_PATH : '"/index.html%23!/callback/"'
})
