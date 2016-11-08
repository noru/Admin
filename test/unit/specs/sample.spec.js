var conf = require('../../../scripts/OAuth2Config')
var Vue = require('vue')
var assert = chai.assert

describe('sample spec', function () {
    it('just a sample', function () {
        var config = conf('local')
        assert(config.clientId == 'tIbRNfTZKmdxOFs9WgzVnANqG8p7Gm0J', 'this is a sample assertion')
    })

    it('test Vue components', function (){
        var vm = new Vue({
            template: '<div><h1>test</h1></div>'
        }).$mount()
        expect(vm.$el.querySelector('h1').textContent).to.contains('test')
    })
})