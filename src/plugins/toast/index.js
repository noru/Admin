/*
* ON-GOING COMPONENT!
* TODO:
*  1. styling, theme
*  2. more config options: position, delay, toast queue...
*  3. transitions, in and out.
*  4. font-awesome? emoji?
* */

/* eslint-disable */
import * as EasyToast from './EasyToast'

const Constructor = Vue.extend(EasyToast)

function toast(msg, options) {
  let toast = new Constructor({
    data: function() {
      return {
        msg: msg
      }
    }
  })
  toast.$mount().$appendTo('body')
  setTimeout(function() {
    toast.$destroy(true)
  }, 5000)
}

export default {
  install(Vue, options) {
    Vue.toast = Vue.prototype.$toast = toast
  }
}
