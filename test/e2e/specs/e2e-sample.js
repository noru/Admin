module.exports = {

    'sample e2e test': function(browser) {
        browser
        .url('http://localhost:8080')
        .waitForElementVisible('#search-size-sel', 5000)
        .assert.elementPresent('title')
        .assert.title('VISUALIZATION ASSET CONSOLE')
        .assert.containsText('#search-btn', 'Search')
        .end()
    }

}