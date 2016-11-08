var webpack = require('webpack')
var path = require('path')
var fs = require('fs')
var https = require('https')
var privateKey = fs.readFileSync(path.resolve(__dirname, './sslcert_for_local/server.key'), 'utf8')
var cert = fs.readFileSync(path.resolve(__dirname, './sslcert_for_local/server.crt'), 'utf8')
var express = require('express')
var config = require('../config')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.local.conf')

var app = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)

compiler.plugin('compilation', (compilation) => {
  compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
    hotMiddleware.publish({action: 'reload'})
    cb()
  })
})

app.use(devMiddleware)
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.local.assetsPublicPath, config.local.assetsSubDirectory)
app.use(staticPath, express.static('./assets'))

var credentials = { key: privateKey, cert: cert }
var httpsServer = https.createServer(credentials, app)
httpsServer.listen(8443, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at https://localhost:8443\n')
})

app.listen(8080, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:8080\n')
})


