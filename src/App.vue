<template>
    <div id="app">
        <div class="bg"></div>
        <NavMenu />
        <router-view class="main" :style="'height: calc(100% - ' + ($store.state.windowSize.width / 19.2  + 30) + 'px);'"/>
        <Spinner v-show="$store.state.loading" />
    </div>
</template>

<script>
import NavMenu from './views/NavMenu.1'
import Spinner from './components/Spinner'
import types from './store/constants/types'
import { fullScreen, exitFullScreen } from './lib/util'

export default {
    name: 'app',
    components: { NavMenu, Spinner },
    data() {
        return {
            marginTop: 0,
            isFull: false, //是否全屏
        }
    },
    watch: {
        '$store.state.windowSize' () { //监听浏览器窗口变化
            const that = this
            that.marginTop = that.$store.state.windowSize.rm * 9 + 40
        }
    },
    mounted () {
        const that = this
        that.listenWinSize()
        that.$store.dispatch(types.GET_CAMERA_TOKEN)
        document.addEventListener('dblclick', that.handleDblclick)
    },
    methods: {
        listenWinSize () {
            const that = this
            that.$store.commit(types.GET_WINDOW_SIZE)
            window.addEventListener('resize', () => {
                that.$store.commit(types.GET_WINDOW_SIZE)
            })
        },
        handleDblclick () {
            const that = this
            that.isFull ? exitFullScreen() : fullScreen()
            that.isFull = !that.isFull
        }
    },
}
</script>

<style lang="scss">
@import './style/common/app.scss';
</style>
