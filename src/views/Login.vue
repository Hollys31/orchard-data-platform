<template>
    <div class="login">
        <!-- <canvas ref="animation"></canvas> -->
        <canvas ref="bg"></canvas>
        <div class="login-form">
            <h1>智慧果园大数据综合分析平台</h1>
            <div class="user-name">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <label for="name"><span>用户名</span><input v-model="userName" @focus="onfocus('home')" id="name" type="text" disableautocomplete="" autofocus="autofocus" autocomplete="off"  maxlength="50" tabindex="1"></label>
                <div class="tips">{{userNameTips}}</div>
            </div>
            <div class="password">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <label for="password"><span>密码</span><input v-model="password" @focus="onfocus('password')" id="password" type="password" autocomplete="new-password"></label>
                <div class="tips">{{passwordTips}}</div>
            </div>
            <div class="verify-code">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
                <label for="verify"><span>验证码</span><input v-model="verifyCode" @focus="onfocus('verify')" id="verify" type="text" autocomplete="off"></label>
                <img ref="verifyImg" :src="'/orchard/bs/v1/getcode?time=' + time" @click="time = new Date().getTime()" alt="code">
                <div class="tips">{{verifyCodeTips}}</div>
            </div>
            <div class="remember" @click="remember = !remember"><i class="iconfont" v-show="remember">&#xe600;</i>记住密码</div>
            <div class="submit" @click="login()">
                <i></i>
                <i></i>
                <span>登录</span>
                <div class="tips">{{msg}}</div>
            </div>
        </div>
        <div v-if="showExit" class="exit iconfont" @click="exit()"><span>&#xe654;</span>退出</div>
    </div>
</template>

<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { ttof, ftot} from '@/lib/util'
import { mapState } from 'vuex'
const nameSpaced = ns.LOGIN + '/'
export default {
    name: 'Login',
    data() {
        return {
            bgCanvas: null, //背景
            //animationCanvs: null, //动画
            userName: '', //用户名
            password: '', //密码
            verifyCode: '', //验证码
            userNameTips: '',
            passwordTips: '',
            verifyCodeTips: '',
            remember: true, //是否记住密码
            time: 0,
            showExit: false, //是否显示退出按钮
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            status: state => state.status,
            verifyCodeTime: state => state.verifyCodeTime,
            msg: state => state.msg,
        })
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.draw()
        },
        'verifyCodeTime' () {
            this.time = this.verifyCodeTime
        }
    },
    mounted() {
        const that = this
        if(that.$store.state.isPPC) that.showExit = true
        const userName = ftot(localStorage.getItem('oun'))
        const password = ftot(localStorage.getItem('oup'))
        if(userName != null) {
            that.userName = userName
        }
        if(password != null) {
            that.password = password
        }
        document.onkeydown = function(e){
            if(window.event.keyCode === 13){
                that.login();
            }
        }
        that.draw()
        if(/flash=true/.test(document.URL)) {
            that.$store.commit(types.SET_FLASH, true)
        }
    },
    methods: {
        login() {
            const that = this
            const local = localStorage
            if(!that.verify()) {
                return
            }
            let data = {
                userName: that.userName,
                password: that.password,
                verifyCode: that.verifyCode
            }
            if(that.remember) {
                local.setItem('oun', ttof(that.userName))
                local.setItem('oup', ttof(that.password))
            }else {
                local.removeItem('oun')
                local.removeItem('oup')
            }
            that.$store.dispatch(nameSpaced + types.LOGIN_POST_USER_IN, data)
        },
        onfocus (str) {
            if(this.$store.state.isPPC) { //适配安卓平板
                location.href = 'loginInputOnfocus?' + str
            }
        },
        exit () {
            location.href = 'exitApp'
        },
        verify() {
            const that = this
            if(!that.userName) {
                that.userNameTips = '请填写用户名！'
                return false
            }else {
                that.userNameTips = ''
            }
            if(!that.password) {
                that.passwordTips = '请输入密码！'
                return false
            }else {
                that.passwordTips = ''
            }
            //return true
            if(!that.verifyCode) {
                that.verifyCodeTips = '请输入验证码！'
                return false
            }else {
                that.verifyCodeTips = ''
            }
            return true
        },
        draw() {
            const that = this
            const bgCanvas = that.bgCanvas = that.$refs.bg //背景图层
            const bgCtx = bgCanvas.getContext('2d')
            //const animationCanvs = that.animationCanvs = that.$refs.animation //动画图层
            //const animationCtx = animationCanvs.getContext('2d')
            const style = that.$el.getBoundingClientRect()
            let w = parseInt(style.width)
            let h = parseInt(style.height)
            if(isNaN(w)  || w === 0){
                setTimeout(that.draw(), 500)
            }else {
                /*
                if(w < 1024) {
                    w = 1024
                }
                if(h < 576) {
                    h = 576
                }
                */
                bgCanvas.width = w
                bgCanvas.height = h
                //animationCanvs.width = w
                //animationCanvs.height = h
                //背景开始
                //线框起点坐标
                const x = (w - 580) / 2
                const y = (h - 520) / 2 + 60
                
                bgCtx.strokeStyle = '#067fff'
                bgCtx.fillStyle = 'rgba(10, 1, 62, 0.2)'
                bgCtx.fillRect(0, 0, w, h)
                bgCtx.fillStyle = 'rgba(4, 13, 48, 0.5)'
                //外框线
                bgCtx.lineWidth = 2
                bgCtx.beginPath()
                bgCtx.moveTo(x + 30, y + 1)
                bgCtx.lineTo(x + 20, y + 1)
                bgCtx.lineTo(x + 1, y + 20)
                bgCtx.lineTo(x + 1, y + 440)
                bgCtx.lineTo(x + 20, y + 459)
                bgCtx.lineTo(x + 120, y + 459)
                bgCtx.stroke()

                bgCtx.beginPath()
                bgCtx.moveTo(x + 520, y + 459)
                bgCtx.lineTo(x + 560, y + 459)
                bgCtx.lineTo(x + 579, y + 440)
                bgCtx.lineTo(x + 579, y + 420)
                bgCtx.stroke()

                bgCtx.beginPath()
                bgCtx.moveTo(x + 579, y + 340)
                bgCtx.lineTo(x + 579, y + 180)
                bgCtx.stroke()

                bgCtx.beginPath()
                bgCtx.moveTo(x + 579, y + 45)
                bgCtx.lineTo(x + 579, y + 20)
                bgCtx.lineTo(x + 560, y + 1)
                bgCtx.lineTo(x + 560, y + 1)
                bgCtx.lineTo(x + 430, y + 1)
                bgCtx.stroke()

                //内线框
                bgCtx.lineWidth = 2
                bgCtx.beginPath()
                bgCtx.moveTo(x + 24, y + 6)
                bgCtx.lineTo(x + 555, y + 6)
                bgCtx.lineTo(x + 574, y + 25)
                bgCtx.lineTo(x + 574, y + 436)
                bgCtx.lineTo(x + 556, y + 454)
                bgCtx.lineTo(x + 24, y + 454)
                bgCtx.lineTo(x + 6, y + 436)
                bgCtx.lineTo(x + 6, y + 24)
                bgCtx.closePath()
                bgCtx.clip()
                bgCtx.fillRect(x, y, 580, 460)
                bgCtx.stroke()
                /*
                //动画开始
                let meteorArr = [] //流星对象
                
                const meteorImg1 = new Image()
                meteorImg1.src = '/images/meteor/1.png'
                meteorImg1.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg1, w))
                }
                const meteorImg2 = new Image()
                meteorImg2.src = '/images/meteor/2.png'
                meteorImg2.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg2, w))
                }
                const meteorImg3 = new Image()
                meteorImg3.src = '/images/meteor/3.png'
                meteorImg3.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg3, w))
                }
                const meteorImg4 = new Image()
                meteorImg4.src = '/images/meteor/4.png'
                meteorImg4.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg4, w))
                }
                const meteorImg5 = new Image()
                meteorImg5.src = '/images/meteor/5.png'
                meteorImg5.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg5, w))
                }
                const meteorImg6 = new Image()
                meteorImg6.src = '/images/meteor/6.png'
                meteorImg6.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg6, w))
                }
                const meteorImg7 = new Image()
                meteorImg7.src = '/images/meteor/7.png'
                meteorImg7.onload = function(){
                    meteorArr.push(that.createMeteor(meteorImg7, w))
                }
                function drawMeteor() {
                    animationCtx.clearRect(0, 0, w, h)
                    for(let i = 0; i < meteorArr.length; i++) {
                        let m = meteorArr[i]
                        animationCtx.drawImage(m.img, m.x, m.y)
                        m.x -= m.speed * 2
                        m.y += m.speed
                        if(m.x < -100 || m.y > h) {
                            meteorArr[i] = that.createMeteor(m.img, w)
                        }
                    }
                    window.requestAnimationFrame(drawMeteor)
                }
                //drawMeteor()
                */
            }
        },
        /*
        createMeteor(img, w) { //创建流星对象
            return {
                x: parseInt(Math.random() * w) + w/2,
                y: -100,
                speed: parseInt(Math.random() * 5) + 2,
                img: img,
            }
        },*/
    }
}
</script>

<style lang="scss" scoped>
@import '@/style/views/login.scss';
</style>
