var express = require('express')

// default port where dev server listens for incoming traffic
var port = 8080
var app = express()

app.get('/', function(req, res) {
    res.sendfile('./Index.html')
})
app.use('/admin/dist', express.static('./dist'))

module.exports = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    console.log('Listening at http://localhost:' + port + '\n')
})


