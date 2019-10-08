import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

import App from './App'
import router from './router'
import store from './store'

import './icons' // icon
import './permission' // permission control
import './mock'
Vue.use(ElementUI, {
    size: 'medium'
});
import * as filters from './filters' // global filters

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
router.beforeEach((to, from, next) => {
    const userId = localStorage.getItem("userId") || ""
    if (!userId && to.path != '/login') {
        next(`/login?redirect=${to.path}`)
    } else {
        next();
    }
})
Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})