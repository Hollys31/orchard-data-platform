import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/store/mutations'
import modules from '@/store/modules'
import actions from '@/store/actions'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        currRouter: { // 当前页面路由信息
            from: '',
            to: '',
            query: null,
            instance: null // 路由实例
        },
        loading: false, // loading的状态
        windowResizeState: 0, //窗口大小变化状态
        windowSize: {
            width: 0,
            height: 0,
            rm: 0,
        },
        cameraToken: '',
        flash: false, //是否支持flash
        cropVariety: [], //农作物品种列表
        userType: localStorage.getItem('user_type'), //用户类型  1 -> 农户
        orchardId: localStorage.getItem('garden_id'), //果园id
        tips: '数据加载中。。。', //数据加载提示信息
        isPPC: /yfkjorchard/i.test(navigator.userAgent), //是否是平板
    },
    mutations,
    modules,
    actions
})
