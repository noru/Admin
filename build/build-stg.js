// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'staging'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.stg.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for stg...')
spinner.start()

var assetsPath = path.join(config.stg.assetsRoot, config.stg.assetsSubDirectory)
rm('-rf', config.build.assetsRoot)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'assets/images/', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
