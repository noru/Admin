const $stg = window.localStorage
const SUFFIX = '--expire'
const expireIn = 1800000 // 30 mins

module.exports = {

  get(key) {
    let obj = $stg.getItem(key)
    if (!obj) return null
    const expireKey = key + SUFFIX
    if (new Date($stg.getItem(expireKey)) > Date.now()) {
      this.del(key, expireKey)
      obj = null
    }
    return obj
  },

  del(...keys) {
    keys.forEach(key => $stg.removeItem(key) || $stg.removeItem(key + SUFFIX))
  },

  set(key, obj, expire = expireIn) {
    $stg.setItem(key + SUFFIX, Date.now() + expire)
    $stg.setItem(key, obj)
  },

  clear() {
    $stg.clear()
  }
}
