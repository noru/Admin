var webpack = require('webpack')
var path = require('path')
var fs = require('fs')
var https = require('https')
var privateKey = fs.readFileSync(path.resolve(__dirname, './sslcert_for_local/server.key'), 'utf8')
var cert = fs.readFileSync(path.resolve(__dirname, './sslcert_for_local/server.crt'), 'utf8')
var express = require('express')
var config = require('../config')

var app = express()

// serve dev build as static file
app.use('/', express.static('./dist'))

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


