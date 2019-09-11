<template>
<div class="nav-menu" :style="'height: ' + ($store.state.windowSize.width / 19.2 ) + 'px;line-height: ' + ($store.state.windowSize.width / 19.2 * 0.33) +'px'">
    <div class="head-bg"></div>
    <ul class="menu-list menu-list-left">
        <router-link tag="li" :to="{ name: 'home' }" :class="{disabled: $store.state.orchardId}">首页</router-link>
        <router-link tag="li" :to="{ name: 'monitor' }">智慧源地</router-link>
        <router-link tag="li" :to="{ name: 'plant' }" :class="{disabled: $store.state.orchardId}">种植分布</router-link>
    </ul>
    <ul class="menu-list menu-list-right">
        <router-link tag="li" :to="{ name: 'farming' }" :class="{disabled: $store.state.orchardId}">农事活动</router-link>
        <router-link tag="li" :to="{ name: 'warehouse' }" :class="{disabled: $store.state.orchardId}">产品仓储</router-link>
        <router-link tag="li" :to="{ name: 'origin' }">溯源数据</router-link>
    </ul>
    <div class="logout" @click="logout">
        <ul>
            <li>退出登录</li>
        </ul>
    </div>
</div>
</template>
<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.LOGIN + '/'
export default {
    name: 'NavMenu',
    data() {
        return {
            
      }
    },
    computed: {
        ...mapState ( nameSpaced , {
            status: state => state.status,
        })
    },
    watch: {
        'status' () {
            const that = this
            if(that.status) {
                that.$store.state.orchardId ? that.$router.push('monitor') : that.$router.push('home')
            }else {
                that.$router.push('login')
            }
        },
    },
    methods: {
        logout() {
            const that = this
            if(that.$store.state.isPPC) {
                location.href = 'exitApp'
            }else {
                that.$store.dispatch(nameSpaced + types.LOGIN_GET_USER_OUT) //用户登出
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '@/style/views/nav-menu.1.scss';
</style>