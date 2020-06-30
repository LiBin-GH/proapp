import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import Vant from 'vant';
import 'vant/lib/index.css';

//引入vuex文件
import store from './store'

Vue.use(Vant);
Vue.use(Mint);
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
