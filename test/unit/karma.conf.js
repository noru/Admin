// Karma configuration
// Generated on Sun Sep 18 2016 16:15:55 GMT+0800 (China Standard Time)

module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'browserify', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    plugins: [
      'karma-coverage',
      'karma-spec-reporter',
      'karma-mocha',
      'karma-phantomjs-launcher',
      'karma-browserify',
      'karma-sinon-chai'
    ],
    files: [
      './specs/*.spec.js'
    ],
    preprocessors: {
      './specs/*.spec.js': ['browserify']
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity,
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    }
  })
}
