// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VModal from 'vue-js-modal'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Popover from 'vue-js-popover'
import Session from 'vue-session'
import Tinymce from 'vue-tinymce-editor'

Vue.use(VueAxios, axios)

Vue.use(VModal)

Vue.use(Session)

Vue.use(Popover)

Vue.component('tinymce', Tinymce)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
