import Vue from 'vue'
import Store from '@/store'
import Router from 'vue-router'    
import { cookie } from '@/lib/util'
import Types from '@/store/constants/types'
import ns from '@/store/constants/ns'
const nameSpaced = ns.LOGIN + '/'

Vue.use(Router)
const router = new Router({
    // mode: 'history',
    base: '',
    linkActiveClass: 'active',
    routes: [
        {
            path: '/home',
            name: 'home', // 智慧全息
            component: () => import('./views/home/Index.vue')
        },
        {
            path: '/monitor',
            name: 'monitor', // 物联监控
            component: () => import('./views/monitor/Index.vue')
        },
        {
            path: '/plant',
            name: 'plant', // 种植分布
            component: () => import('./views/plant/Index.vue')
        },
        {
            path: '/farming',
            name: 'farming', // 农事活动
            component: () => import('./views/farming/Index.vue')
        },
        {
            path: '/warehouse',
            name: 'warehouse', // 出库入库
            component: () => import('./views/warehouse/Index.vue')
        },
        {
            path: '/origin',
            name: 'origin', // 溯源数据
            component: () => import('./views/origin/Index.vue')
        },
        {
            path: '/login',
            name: 'login', // 用户登录
            component: () => import('./views/Login.vue')
        },
        {
            path: '/error',
            name: 'error', // 服务器升级 or 服务器错误
            component: () => import('./views/Error.vue')
        },
        {
            path: '*',
            redirect: { name: 'home' }
        }
    ]
})

router.beforeEach((to, from, next) => {
    const status = cookie('status')
    if( (Store.state.login.status && status) || to.name === 'login' || to.name === 'error' ) {
        if(Store.state.orchardId && (to.name === 'home' || to.name === 'plant' || to.name === 'farming' || to.name === 'warehouse')) return
        Store.commit({
            type: Types.SET_CURR_ROUTER,
            from: from.name,
            to: to.name,
            query: to.query,
            instance: router
        })
        next(true)
    }else {
        router.push('login')
    }
})

export default router
