import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import axios from 'axios'
import './views/css/reset.less'
import './views/js/rem'
import api from './views/js/api'
import singerLog from './views/js/log';
import Toast from './views/js/toast';
import wxShare from './views/js/wx-share'
import wx from 'weixin-js-sdk';



Vue.config.productionTip = false

Vue.prototype.$http = axios;
Vue.prototype.$api = api;
Vue.prototype.$share = wxShare;
Vue.prototype.$wx = wx;
Vue.prototype.$log = singerLog; // log
Vue.use(Toast);

/* 注册title */
Vue.directive('title', (el, binding) => {
  document.title = binding.value;
})
/* 前置守卫 */
router.beforeEach((to, from, next) => {
  singerLog.enter();
  if(from.name) singerLog.leave();
  next();
});
/* 截获路由错误信息 */
router.onError((err) => {
  console.log('错误', err);
  singerLog.error(err);
});
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
