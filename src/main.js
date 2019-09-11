import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import Panel from '@/components/Panel'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import { DatePicker } from 'element-ui'
import socket from '@/lib/socket'
import 'element-ui/lib/theme-chalk/index.css'
import 'vuescroll/dist/vuescroll.css'
import 'video.js/dist/video-js.css'
/*
import VueAMap from 'vue-amap'
VueAMap.initAMapApiLoader({
    key: '9e6a4e22adb5bdb4ee309524a01c8693',
    plugin: ['MapType']
})
Vue.use(VueAMap)
localStorage.clear()
*/
Vue.config.productionTip = false

Vue.prototype.$socket = socket
Vue.component('Panel', Panel)
Vue.use(vuescroll)
Vue.use(DatePicker)

new Vue({
    render: h => h(App),
    router,
    store
}).$mount('#app')
