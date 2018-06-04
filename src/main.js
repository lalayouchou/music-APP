import Vue from 'vue'
import App from './App'
import router from './router'
import fastClick from 'fastclick'
import store from './store'
import 'common/stylus/index.styl'
let VueLazyload = require('vue-lazyload')

Vue.config.productionTip = false
fastClick.attach(document.body)
Vue.use(VueLazyload, {
  loading: require('./common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
