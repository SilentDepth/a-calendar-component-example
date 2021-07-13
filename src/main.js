import Vue from 'vue'

import './assets/css/base.css'
import App from './app.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
