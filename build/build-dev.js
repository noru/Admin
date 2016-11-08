// https://github.com/shelljs/shelljs
require('shelljs/global')
env.NODE_ENV = 'development'

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.dev.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for dev...')
spinner.start()

var assetsPath = path.join(config.dev.assetsRoot, config.dev.assetsSubDirectory)
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
