/*
 * ON-GOING COMPONENT!
 *
 * Dependency: vueStrapBaseComponent(buttons & modal), vue-awesome
 *
 * */

/* eslint-disable */
import * as Dialog from './Prompt'

const Component = Vue.extend(Dialog)

const _options = {
  type: 'alert', // warning, info, confirm
  onOk: undefined,
  onCancel: undefined

}
let _instance = null

function prompt(title, msg, options = {}) {
  if (!_instance) {
    _instance = new Component()
    _instance.$mount().$appendTo('body')
  }
  options = Object.assign({}, _options, options)
  _instance.$data.title = title
  _instance.$data.msg = msg
  _instance.$data.options = options
  Vue.nextTick(() => _instance.$broadcast('show::modal','prompt-dialog'))
}

function _factory(type) {
  let _type = type
  return (title, msg, options = {}) => {
    options.type = _type
    prompt(title, msg, options)
  }
}

export default {
  install(Vue, options) {
    Vue.alert = Vue.prototype.$alert = _factory('alert')
    Vue.warn = Vue.prototype.$warn = _factory('warn')
    Vue.info = Vue.prototype.$info = _factory('info')
    Vue.confirm = Vue.prototype.$confirm = _factory('confirm')
  }
}
