<template>
<div class="nav-menu" :style="'height: ' + h/ratio + 'px;'">
    <canvas ref="bg"></canvas>
    <canvas ref="animation"></canvas>
    <canvas ref="menuBg"></canvas>
    <canvas ref="menu" @click="drawMenu($event)" @mousemove="drawMenu($event, true)"></canvas>
    <div class="logout" :style="'top: ' + (4 * rm)/2 + 'px; right:' + (5.4 * rm)/2 + 'px'" @click="logout">
        <ul>
            <li>退出登录</li>
        </ul>
    </div>
</div>
</template>
<script>
import { setTimeout } from 'timers';
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { getBrowserType, formatTime } from '@/lib/util'
import { mapState } from 'vuex'
const nameSpaced = ns.LOGIN + '/'
const pi = Math.PI
export default {
    name: 'NavMenu',
    data() {
        return {
            bgCanvas: null, //背景图层
            animationCanvas: null, //动画图层
            menuCanvas: null, //菜单图层
            menuCtx: null,
            menuBgCanvas: null, //菜单文字背景图层
            menuBgCanvasCtx: null, 
            menuBg: null, //菜单文字背景
            oldCoord: {x: 0, y: 0},
            w: 0,
            h: 0,
            rm: 0,
            checkedMenu: 0, //当前选中的菜单 417行 menuList中的索引
            hoverMenu: -1,
            menuList: [],
            hash: 'home', //当前所处的路由
            ratio: 1, //画布渲染倍数
      }
    },
    computed: {
        ...mapState ( nameSpaced , {
            status: state => state.status,
        })
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.draw()
        },
        '$store.state.currRouter.to' () {
            const that = this
            that.hash = that.$store.state.currRouter.to
            that.drawMenu()
        },
        'status' () {
            const that = this
            if(that.status) {
                that.$router.push('home')
                that.hoverMenu = -1
                that.draw()
            }else {
                that.$router.push('login')
            }
        },
    },
    mounted () {
        const that = this
        that.hash = that.$store.state.currRouter.to
        that.draw()
    },
    methods: {
        logout() {
            const that = this
            that.$store.dispatch(nameSpaced + types.LOGIN_GET_USER_OUT) //用户登出
        },
        draw () {
            const that = this
            that.bgCanvas = that.$refs.bg //背景图层
            that.animationCanvas = that.$refs.animation //动画图层
            that.menuBgCanvas = that.$refs.menuBg //菜单文字背景图层
            that.menuCanvas = that.$refs.menu //菜单图层
            const ctx = that.bgCanvas.getContext('2d')
            const animationCtx = that.animationCanvas.getContext('2d')
            const menuCtx = that.menuCtx = that.menuCanvas.getContext('2d')
            that.menuBgCanvasCtx = that.menuBgCanvas.getContext('2d')
            //获取设备像素比
            let devicePixelRatio = window.devicePixelRatio || 1
            //浏览器在渲染canvas之前存储画布信息的像素比
            let backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1
            // canvas的实际渲染倍率
            that.ratio = devicePixelRatio / backingStoreRatio * 2

            const style = that.$el.getBoundingClientRect()
            //浏览器渲染元素尺寸
            let w = parseInt(style.width)
            let h = parseInt(10 * (w + 40)/192)
            let rm = w / 192
            if(isNaN(w) || w === 0) {
                setTimeout(that.draw(), 500)
            }else {
                const browserType = getBrowserType() //浏览器类型
                that.bgCanvas.setAttribute('style', 'width: ' + w + 'px;height: ' + h + 'px;')
                that.animationCanvas.setAttribute('style', 'width: ' + w + 'px;height: ' + h + 'px;')
                that.menuBgCanvas.setAttribute('style', 'width: ' + w + 'px;height: ' + h + 'px;')
                that.menuCanvas.setAttribute('style', 'width: ' + w + 'px;height: ' + h + 'px;')

                //画布尺寸
                that.w = w = w * that.ratio
                that.h = h = h * that.ratio
                rm = that.rm = w / 192
                that.bgCanvas.width = that.animationCanvas.width = that.menuCanvas.width = that.menuBgCanvas.width = w
                that.bgCanvas.height = that.animationCanvas.height = that.menuCanvas.height = that.menuBgCanvas.height = h
                ctx.clearRect(0, 0, w, h)
                animationCtx.clearRect(0, 0, w, h)
                menuCtx.clearRect(0, 0, w, h)
                if(!that.status) {
                    return
                }

                /**********************背景图层开始*************************/
                ctx.strokeStyle = 'rgba(28, 68, 169, 1)'
                ctx.lineWidth = 1
                //左边线框
                ctx.beginPath()
                ctx.moveTo(rm/2, 7 * rm)
                ctx.lineTo(0, 6.6 * rm)
                ctx.lineTo(0, 4 * rm)
                ctx.lineTo(2 * rm, 2 * rm)
                ctx.lineTo(38 * rm, 2 * rm)
                ctx.lineTo(38.5 * rm, 1.5 * rm)
                ctx.lineTo(51.5 * rm, 1.5 * rm)
                ctx.lineTo(52.5 * rm, rm/2)
                ctx.lineTo(66.5 * rm, rm/2)
                ctx.lineTo(67 * rm, rm)
                ctx.lineTo(80 * rm, rm)
                ctx.lineTo(80.5 * rm, 1.5 * rm)
                ctx.lineTo(w - 38 * rm, 1.5 * rm)
                ctx.lineTo(w - 38 * rm, 4 * rm)
                ctx.bezierCurveTo(w - 40.5 * rm, 5 * rm, w - 40.5 * rm, 7.5 * rm, w - 40.5 * rm, 7.5 * rm)
                //ctx.arc(w - 370, 75, 35, 0, pi * 2)
                ctx.lineTo(w - 40.5 * rm, 7.5 * rm)
                ctx.lineTo(w - 40.5 * rm, 8 * rm)
                ctx.lineTo(78 * rm, 8 * rm)
                ctx.lineTo(77 * rm, 9 * rm)
                ctx.lineTo(62 * rm, 9 * rm)
                ctx.lineTo(61 * rm, 8 * rm)
                ctx.lineTo(9 * rm, 8 * rm)
                ctx.lineTo(8 * rm, 9 * rm)
                ctx.lineTo(7 * rm, 9 * rm)
                //ctx.bezierCurveTo(98, 35, 8, 10, 5, 70)
                ctx.bezierCurveTo(11 * rm, 1.8 * rm, -rm/5, rm/2, rm/2, 7 * rm)
                //ctx.arc(40, 70, 35, 0, pi * 2)
                ctx.stroke()
                //标题
                let titleCanvas = document.createElement('canvas')
                titleCanvas.width = 41 * rm
                titleCanvas.height = 4.2 * rm
                let ctx6 = titleCanvas.getContext('2d')
                ctx6.strokeStyle = 'rgba(28, 68, 169, 1)'
                ctx6.beginPath()
                ctx6.moveTo(rm/2, 1)
                ctx6.lineTo(40.5 * rm , 1)
                ctx6.lineTo(40.9 * rm , rm/2)
                ctx6.lineTo(40.9 * rm , 3.5 * rm)
                ctx6.lineTo(40.5 * rm , 4.1 * rm)
                ctx6.lineTo(rm/2 , 4.1 * rm)
                ctx6.lineTo(1 , 3.5 * rm)
                ctx6.lineTo(1 , rm/2)
                ctx6.closePath()
                ctx6.stroke()
                ctx6.clip() //剪切路径 隐藏路径外阴影
                ctx6.shadowBlur = 0.8 * rm //阴影模糊尺寸
                ctx6.shadowColor = 'rgba(200, 200, 200, 0.5)' //阴影颜色
                ctx6.beginPath()
                ctx6.moveTo(rm/2, 1)
                ctx6.lineTo(40.5 * rm , 1)
                ctx6.lineTo(40.9 * rm , rm/2)
                ctx6.lineTo(40.9 * rm , 3.5 * rm)
                ctx6.lineTo(40.5 * rm , 4.1 * rm)
                ctx6.lineTo(rm/2 , 4.1 * rm)
                ctx6.lineTo(1 , 3.5 * rm)
                ctx6.lineTo(1 , rm/2)
                ctx6.closePath()
                ctx6.stroke()
                ctx6.shadowBlur = 0 //阴影模糊尺寸
                let gradient2
                //IE Chrome 文字渐变不一样
                if(browserType != 'Chrome') {
                    gradient2 = ctx6.createLinearGradient(0, 1 * rm, 0, 3.2 * rm)
                    gradient2.addColorStop(0,'rgba(191, 233, 254, 1)')
                    gradient2.addColorStop(1,'rgba(7, 103, 216, 1)')
                }else {
                    gradient2 = ctx6.createLinearGradient(0, 0, 0, -2 * rm)
                    gradient2.addColorStop(0,'rgba(7, 103, 216, 1)')
                    gradient2.addColorStop(1,'rgba(191, 233, 254, 1)')
                }
                ctx6.font = '700 ' + (2.6 * rm) + 'px "Microsoft YaHei", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB"'
                ctx6.textAlign = 'center'
                ctx6.fillStyle = gradient2
                ctx6.fillText('智 慧 源 地 大 数 据 综 合 分 析 平 台', 20.5 * rm, 3 * rm, 39 * rm)
                ctx.drawImage(titleCanvas, 9 * rm, 2.9 * rm)

                //左边中间梯形
                ctx.beginPath()
                ctx.moveTo(61.6 * rm, 8.1 * rm)
                ctx.lineTo(77.4 * rm , 8.1 * rm)
                ctx.lineTo(76.8 * rm , 8.7 * rm)
                ctx.lineTo(62.2 * rm , 8.7 * rm)
                ctx.closePath()
                ctx.stroke()
                //右边线框
                ctx.beginPath()
                ctx.moveTo(w - 33.5 * rm, 7.5 * rm)
                ctx.lineTo(w - 33.5 * rm, 8 * rm)
                ctx.lineTo(w - 21 * rm, 8 * rm)
                ctx.lineTo(w - 20 * rm, 9 * rm)
                ctx.lineTo(w - 3 * rm, 9 * rm)
                ctx.lineTo(w - 3 * rm, 4 * rm)
                ctx.lineTo(w - 4.5 * rm, 2.5 * rm)
                ctx.lineTo(w - 12 * rm, 2.5 * rm)
                ctx.lineTo(w - 13 * rm, 1.5 * rm)
                ctx.lineTo(w - 37 * rm, 1.5 * rm)
                ctx.lineTo(w - 37 * rm, 4 * rm)
                ctx.bezierCurveTo(w - 33.5 * rm, 4 * rm, w - 33.5 * rm, 7.5 * rm, w - 33.5 * rm, 7.5 * rm)
                //ctx.arc(w - 370, 75, 35, 0, pi * 2)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w - 3 * rm, 7.5 * rm)
                ctx.lineTo(w - 10 * rm, 7.5 * rm)
                ctx.lineTo(w - 11 * rm, 6.5 * rm)
                ctx.lineTo(w - 32.5 * rm, 6.5 * rm)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w - 9 * rm, rm/2)
                ctx.lineTo(w - rm, rm/2)
                ctx.lineTo(w - 1, 1.5 * rm)
                ctx.lineTo(w - 1, 4 * rm)
                ctx.lineTo(w - rm, 5 * rm)
                ctx.lineTo(w - rm, 9 * rm)
                ctx.lineTo(w - 1, 9.7 * rm)
                ctx.lineTo(w - 1, 9.9 * rm)
                ctx.lineTo(w - 2 * rm, 9.9 * rm)
                ctx.lineTo(w - 2 * rm, 3.5 * rm)
                ctx.lineTo(w - 4 * rm, 1.5 * rm)
                ctx.lineTo(w - 8 * rm, 1.5 * rm)
                ctx.closePath()
                ctx.stroke()

                //左边菱形
                ctx.lineWidth = 1
                let rhombus10 = document.createElement('canvas')
                rhombus10.width = 23 * rm
                rhombus10.height = rm
                let ctx2 = rhombus10.getContext('2d')
                let gradient = ctx2.createLinearGradient(0, 0, 22 * rm, 0)
                gradient.addColorStop(0,'rgba(0, 204, 255, 1)')
                gradient.addColorStop(1,'rgba(0, 204, 255, 0.2)')
                ctx2.fillStyle = gradient
                ctx2.transform(1, 0, -1, 1, 0, 0)
                for(let i = 0; i < 10; i++) {
                    ctx2.fillRect(rm + (i * 2.2 * rm), 0, 1.5 * rm, 0.6 * rm)
                }
                ctx.drawImage(rhombus10, 8.2 * rm, 8.4 * rm)

                let rhombus6 = document.createElement('canvas')
                rhombus6.width = 7 * rm
                rhombus6.height = rm/2
                let ctx3 = rhombus6.getContext('2d')
                let gradient1 = ctx3.createLinearGradient(0, 0, 7 * rm, 0)
                gradient1.addColorStop(0,'rgba(0, 204, 255, 1)')
                gradient1.addColorStop(1,'rgba(0, 204, 255, 0.2)')
                ctx3.fillStyle = gradient1
                ctx3.transform(1, 0, -1, 1, 0, 0)
                for(let j = 0; j < 6; j++) {
                    ctx3.fillRect(10 + (j * rm), 0, 0.6 * rm, rm/2)
                }
                ctx.drawImage(rhombus6, 51.8 * rm, rm)

                //右边菱形 方块
                ctx.fillStyle = 'rgba(0, 204, 255, 1)'
                ctx.transform(1, 0, 1, 1, 0, 0)
                for(let k = 0; k < 5; k++) {
                    ctx.fillRect(w - 8.6 * rm - (k * 1.3 * rm), 1.9 * rm, rm, 0.3 * rm)
                }
                ctx.fillRect(w - 28.5 * rm, 8.2 * rm, 1.5 * rm, rm/2)

                ctx.transform(1, 0, -1, 1, 0, 0)
                ctx.fillRect(w - 36.4 * rm, 2.2 * rm, rm/2, rm/2)
                ctx.fillRect(w - 35.6 * rm, 2.2 * rm, rm/2, rm/2)
                ctx.fillRect(w - 34.8 * rm, 2.2 * rm, rm/2, rm/2)
                ctx.fillRect(w - 34 * rm, 2.2 * rm, rm/2, rm/2)
                ctx.fillRect(w - 19.2 * rm, 8.2 * rm, 16 * rm, rm/2)

                //右边六边形
                ctx.strokeStyle = 'rgba(0, 204, 255, 1)'
                ctx.shadowBlur = 4 //阴影模糊尺寸
                ctx.shadowColor = 'rgba(0, 204, 255, 1)' //阴影颜色
                ctx.beginPath()
                ctx.moveTo(w - 7 * rm, 4 * rm)
                ctx.lineTo(w - 5.8 * rm, 4 * rm)
                ctx.lineTo(w - 5.3 * rm, 5 * rm)
                ctx.lineTo(w - 5.8 * rm, 6 * rm)
                ctx.lineTo(w - 7 * rm, 6 * rm)
                ctx.lineTo(w - 7.5 * rm, 5 * rm)
                ctx.closePath()
                ctx.stroke()
                ctx.shadowBlur = 2 //阴影模糊尺寸
                ctx.beginPath()
                ctx.arc(w - 6.4 * rm, 5 * rm, 0.6 * rm, pi * 0.2, pi * 1.8)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w - 6.7 * rm, 5 * rm)
                ctx.lineTo(w - 6 * rm, 5 * rm)
                ctx.stroke()
                ctx.beginPath()
                ctx.moveTo(w - 6.1 * rm, 4.8 * rm)
                ctx.lineTo(w - 5.8 * rm, 5 * rm)
                ctx.lineTo(w - 6.1 * rm, 5.2 * rm)
                ctx.stroke()
                ctx.shadowBlur = 0 

                /**********************背景图层结束*************************/

                /**********************动画图层开始*************************/
                //右边圆圈
                let canvas1 = document.createElement('canvas')
                canvas1.width = 5.3 * rm
                canvas1.height = 5.3 * rm
                let ctx4 = canvas1.getContext('2d')
                ctx4.strokeStyle = 'rgba(0, 204, 255, 1)'
                //左边圆圈
                let canvas2 = document.createElement('canvas')
                canvas2.width = 7 * rm
                canvas2.height = 7 * rm
                let ctx5 = canvas2.getContext('2d')
                //时间
                let canvas3 = document.createElement('canvas')
                canvas3.width = 20 * rm
                canvas3.height = 4 * rm
                let ctx7 = canvas3.getContext('2d')
                let gradient3
                if(browserType != 'Chrome') {
                    gradient3 = ctx7.createLinearGradient(0, 1.6 * rm, 0, 3 * rm)
                    gradient3.addColorStop(0,'rgba(191, 233, 254, 1)')
                    gradient3.addColorStop(1,'rgba(7, 103, 216, 1)')
                }else {
                    gradient3 = ctx7.createLinearGradient(0, 0, 0, -1.5 * rm)
                    gradient3.addColorStop(0,'rgba(7, 103, 216, 1)')
                    gradient3.addColorStop(1,'rgba(191, 233, 254, 1)')
                }
                ctx7.font = '700 ' + (2.2 * rm) + 'px "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"'
                ctx7.textAlign = 'center'
                ctx7.fillStyle = gradient3
                let space = pi/15
                let count = 1
                let radian, angle, start, end, date, year, month, day, hours, minutes, seconds, dateStr, a
                function animation(){
                    animationCtx.clearRect(0, 0, w, h)
                    radian = count * pi/180
                    ctx4.lineWidth = 0.5 * rm
                    ctx4.clearRect(0, 0, 5.2 * rm, 5.2 * rm)
                    ctx4.beginPath()
                    ctx4.arc(2.6 * rm, 2.6 * rm, 2.1 * rm, 0 + radian, pi/2 - space + radian)
                    ctx4.stroke()
                    ctx4.lineWidth = 0.3 * rm
                    ctx4.beginPath()
                    ctx4.arc(2.6 * rm, 2.6 * rm, 2.2 * rm, pi + radian, pi*1.5 - space + radian)
                    ctx4.stroke()
                    ctx4.lineWidth = 1
                    ctx4.beginPath()
                    ctx4.arc(2.6 * rm, 2.6 * rm, 2.3 * rm, pi/2 + radian, pi - space + radian)
                    ctx4.stroke()
                    ctx4.beginPath()
                    ctx4.arc(2.6 * rm, 2.6 * rm, 2.3 * rm, pi*1.5 + radian, pi*2 - space + radian)
                    ctx4.stroke()
                    ctx4.beginPath()
                    ctx4.arc(2.6 * rm, 2.6 * rm, 1.4 * rm, 0, pi*2)
                    ctx4.save()
                    ctx4.clip() //剪切路径 隐藏路径外阴影
                    ctx4.shadowBlur = 0.8 * rm //阴影模糊尺寸
                    ctx4.shadowColor = 'rgba(200, 200, 200, 0.5)' //阴影颜色
                    ctx4.beginPath()
                    ctx4.arc(2.6 * rm, 2.6 * rm, 1.3 * rm, 0, pi*2)
                    ctx4.stroke()
                    ctx4.restore()
                    
                    ctx5.clearRect(0, 0, 7 * rm, 7 * rm)
                    ctx5.strokeStyle = 'rgba(0, 204, 255, 1)'
                    ctx5.lineWidth = 2
                    ctx5.beginPath()
                    ctx5.arc(3.2 * rm, 3.2 * rm, 3 * rm, 0, pi * 2)
                    ctx5.stroke()
                    ctx5.strokeStyle = 'rgba(28, 68, 169, 1)' //'rgba(19, 51, 123, 1)'
                    space = pi * 0.02
                    angle = pi/8
                    end = angle - space
                    for(a = 0; a < 16; a++) {
                        start = angle * a + radian
                        ctx5.lineWidth = 1
                        ctx5.beginPath()
                        ctx5.arc(3.2 * rm, 3.2 * rm, 2.2 * rm, 0 + start, end + start)
                        ctx5.stroke()
                        ctx5.beginPath()
                        ctx5.arc(3.2 * rm, 3.2 * rm, 2.6 * rm, 0 + start, end + start)
                        ctx5.stroke()
                        ctx5.lineWidth = 2
                        ctx5.beginPath()
                        ctx5.arc(3.2 * rm, 3.2 * rm, 2.4 * rm, 0 + start, start + space)
                        ctx5.stroke()
                        ctx5.beginPath()
                        ctx5.arc(3.2 * rm, 3.2 * rm, 2.4 * rm, 0 + start + end - space, start + end)
                        ctx5.stroke()
                    }
                    ctx5.strokeStyle = 'rgba(0, 204, 255, 1)'
                    ctx5.lineWidth = 1
                    ctx5.beginPath()
                    ctx5.arc(3.2 * rm, 3.2 * rm, 1.6 * rm, 0, pi * 2)
                    ctx5.save()
                    ctx5.clip() //剪切路径 隐藏路径外阴影
                    ctx5.shadowBlur = 8 //阴影模糊尺寸
                    ctx5.shadowColor = 'rgba(200, 200, 200, 0.5)' //阴影颜色
                    ctx5.beginPath()
                    ctx5.arc(3.2 * rm, 3.2 * rm, 1.5 * rm, 0, pi * 2)
                    ctx5.stroke()
                    ctx5.restore()

                    ctx7.clearRect(0, 0, 20 * rm, 4 * rm)
                    dateStr = formatTime(new Date, 'yyyy.MM.dd hh:mm:ss')
                    ctx7.fillText(dateStr, 10 * rm, 3 * rm, 20 * rm);
                    animationCtx.drawImage(canvas1, w - 39.5 * rm, 5 * rm)
                    animationCtx.drawImage(canvas2, rm, 3.4 * rm)
                    animationCtx.drawImage(canvas3, w - 32 * rm, 2.5 * rm)
                    count++
                    if(count > 360) {
                        count = 1
                    }
                    window.requestAnimationFrame(animation)
                }
                animation()
                /**********************动画图层结束*************************/

                /**********************菜单文字背景图层开始*************************/
                that.menuBg = document.createElement('canvas')
                that.menuBg.width = 12 * rm
                that.menuBg.height = 3.6 * rm
                let menuBgCtx = that.menuBg.getContext('2d')
                let menuBgGradient = menuBgCtx.createRadialGradient(6 * rm, 1.5 * rm, rm, 6 * rm, rm, 6 * rm)
                menuBgGradient.addColorStop(0,'rgba(27, 74, 157, 0.5)')
                menuBgGradient.addColorStop(1,'rgba(27, 74, 157, 1)')
                menuBgCtx.strokeStyle = 'rgba(0, 204, 255, 1)'
                menuBgCtx.fillStyle = menuBgGradient
                menuBgCtx.beginPath()
                menuBgCtx.moveTo(rm, 1)
                menuBgCtx.lineTo(11 * rm, 1)
                menuBgCtx.lineTo(12 * rm, 1.8 * rm)
                menuBgCtx.lineTo(11 * rm, 3.5 * rm)
                menuBgCtx.lineTo(rm, 3.5 * rm)
                menuBgCtx.lineTo(1, 1.8 * rm)
                menuBgCtx.closePath()
                menuBgCtx.fill()
                menuBgCtx.stroke()
                //menuBg.fillStyle = '#02eeff'
                /**********************菜单文字背景图层结束*************************/

                that.drawMenu()
            }
        },
        isPointInPath (menuList, x, y, hover) {
            /**********************菜单图层开始*************************/
            const that = this
            for(let i = 0; i < menuList.length; i++) {
                const menu = menuList[i]
                const menuX = menu.x/that.ratio
                const menuWidth = (menu.x + menu.width)/that.ratio
                const menuY = menu.y/that.ratio
                const menuHeight = (menu.y + menu.height)/that.ratio
                if(event && x > menuX && x < menuWidth && y > menuY && y < menuHeight) {
                    if(hover) {
                        if(that.hoverMenu != i) {
                            that.menuCanvas.style.cursor = 'pointer'
                            that.hoverMenu = i
                            that.drawMenu()
                        }
                    }else{
                        that.hash = menu.name
                        if(that.checkedMenu != i) {
                            that.checkedMenu = i
                            that.$store.commit('SWITCH_LOADING', true)
                        }
                        that.$router.push(menu.name)
                    }
                    return
                }
            }
            if(that.hoverMenu != -1) {
                that.menuCanvas.style.cursor = 'default'
                that.hoverMenu = -1
                that.drawMenu()
            }
        },
        drawMenu (event, hover) {
            const that = this
            if(that.w === 0) {
                return
            }
            const rm = that.rm
            const menuList = [
                {x:55 * rm, y:3 * rm, width:12 * rm, height:3.6 * rm, content:'首 页', name: 'home'},
                {x:71 * rm, y:3 * rm, width:12 * rm, height:3.6 * rm, content:'智 慧 源 地', name: 'monitor'},
                {x:87 * rm, y:3 * rm, width:12 * rm, height:3.6 * rm, content:'种 植 分 布', name: 'plant'},
                {x:103 * rm, y:3 * rm, width:12 * rm, height:3.6 * rm, content:'农 事 活 动', name: 'farming'},
                {x:119 * rm, y:3 * rm, width:12 * rm, height:3.6 * rm, content:'产 品 仓 储', name: 'warehouse'},
                {x:135 * rm, y:3 * rm, width:12 * rm, height:3.6 * rm, content:'溯 源 动 态', name: 'origin'}
            ]
            if(event) {
                that.isPointInPath(menuList, event.offsetX, event.offsetY, hover)
            }else {
                let menuCtx = that.menuCtx
                let w = that.w
                let h = that.h
                menuCtx.clearRect(0, 0, w, h)
                let oldX = that.oldCoord.x
                let x, y
                function moveRight() {
                    if(oldX > x) {
                        that.menuBgCanvasCtx.clearRect(0, 0, w, h)
                        that.menuBgCanvasCtx.drawImage(that.menuBg, x, y)
                        that.oldCoord.x = x
                        return
                    }
                    that.menuBgCanvasCtx.clearRect(0, 0, w, h)
                    that.menuBgCanvasCtx.drawImage(that.menuBg, oldX, that.oldCoord.y)
                    oldX += 10
                    window.requestAnimationFrame(moveRight)
                }
                function moveLeft() {
                    if(oldX < x) {
                        that.menuBgCanvasCtx.clearRect(0, 0, w, h)
                        that.menuBgCanvasCtx.drawImage(that.menuBg, x, y)
                        that.oldCoord.x = x
                        return
                    }
                    that.menuBgCanvasCtx.clearRect(0, 0, w, h)
                    that.menuBgCanvasCtx.drawImage(that.menuBg, oldX, that.oldCoord.y)
                    oldX -= 10
                    window.requestAnimationFrame(moveLeft)
                }

                //文字 
                menuCtx.font = '700 ' + (2 * rm) + 'px "Microsoft YaHei", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB"'
                menuCtx.textAlign = 'center'
                for(let i = 0; i < menuList.length; i++) {
                    let menu = menuList[i]
                    menuCtx.fillStyle = '#fff'
                    if(menu.name === that.hash || (menu.name === 'home' && that.hash === 'login')) {
                        menuCtx.fillStyle = '#02eeff'
                        x = menu.x
                        y = that.oldCoord.y = menu.y
                        that.menuBgCanvasCtx.clearRect(0, 0, w, h)
                        that.menuBgCanvasCtx.drawImage(that.menuBg, x, y)
                        //menu.x < oldX ? moveLeft() : moveRight()
                    }
                    if(that.hoverMenu === i){
                        menuCtx.fillStyle = '#02eeff'
                    }
                    menuCtx.fillText(menu.content, menu.x + menu.width / 2, menu.y + 2.4 * rm, menu.width - 2 * rm)
                }
            }
        }
    },
    beforeDestroy() {
        const that = this
        that.bgCanvas = null
        that.animationCanvas = null
        that.menuCanvas = null
        that.menuCtx = null
        that.menuBgCanvas = null
        that.menuBgCanvasCtx = null
        that.menuBg = null
    }
}
</script>

<style lang="scss" scoped>
@import '@/style/views/nav-menu.scss';
</style>