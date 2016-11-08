require('../styles/artifakt.css')
require('../styles/common.css')

import Router from 'vue-router'
import Icon from 'vue-awesome'
import I18n from 'vue-i18n'
import Locales from '../i18n/all'
import VueResource from 'vue-resource'
import Service from './plugins/service'
import Toast from './plugins/toast/index'
import Dialog from './plugins/prompt/index'
import { MockServer } from '../mock/vue-resource-mock'
import { Headers } from '../src/helpers/headers'
import MockData from '../mock/mock-data'
import VuestrapBase from 'vuestrap-base-components'
import VueStrap from 'vue-strap'
import Header from 'components/Header'
import Neck from 'components/Neck'
import Main from 'components/Main'
import Callback from 'components/Callback'
import Vuetable from 'vuetable/Vuetable'

Vue.use(Router)
Vue.use(I18n)
Vue.config.lang = 'en' // TODO, set dynamically
Vue.config.fallbackLang = 'en'
Object.keys(Locales).forEach(lang => {
  Vue.locale(lang, Locales[lang])
})
Vue.use(VueResource)
Vue.http.interceptors.push(Headers)
if (process.env.USE_MOCK) {
  Vue.http.interceptors.push(MockServer(MockData))
}
Vue.use(Service)

// vue-awesome: https://github.com/Justineo/vue-awesome
Vue.component('icon', Icon)
// vuestrap base components: https://github.com/kzima/vuestrap-base-components/
Vue.component('vs-btn', VuestrapBase.buttons)
Vue.component('vs-input', VuestrapBase.formInput)
Vue.component('vs-radio', VuestrapBase.formRadio)
Vue.component('vs-ds', VuestrapBase.dropdownSelect)
Vue.component('vs-modal', VuestrapBase.modal)

// VueStrap components: https://yeche.github.io/vue-strap
Vue.component('vs-btn-group', VueStrap.buttonGroup)
Vue.component('vs-d', VueStrap.dropdown)
Vue.component('radio', VueStrap.radio)
Vue.component('spinner', VueStrap.spinner)

// https://github.com/ratiw/vue-table
Vue.component('vuetable', Vuetable)

// home made components
Vue.component('aes-header', Header)
Vue.component('neck', Neck)
Vue.use(Toast)
Vue.use(Dialog)

const app = Vue.extend({
  methods: {
    closeModal(id) {
      this.$broadcast('hide::modal', id)
    },
    showModal(id) {
      this.$broadcast('show::modal', id)
    },
    showSpinner() {
      this.$broadcast('show::spinner')
    },
    hideSpinner() {
      this.$broadcast('hide::spinner')
    }
  }
})
const router = new Router()

router.map({
  '/': {
    component: Main
  },
  '/callback/*authString': {
    component: Callback
  },

})

router.start(app, 'body')
