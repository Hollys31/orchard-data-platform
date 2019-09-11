<template>
    <div class="talk">
        <div class="talk-button" @click="showInfo = !showInfo" :style="talkStart ? 'background-position: 0 -75px;' : 'background-position: 0 0;'">
            <div v-show="showInfo" class="talk-info" @click.stop="">
                <h3>语音通话</h3>
                <p>
                    可与摄像区域农户通话<br>
                    可用键盘上下左右键移动摄像头<br>
                    点击右下方按钮关闭本对话框<br>
                    <span>{{talkStart ? '正在与农户通话中...' : '点击麦克风按钮与农户通话'}}</span>
                </p>
                <div>
                    <span @click="startTalk()" :style="talkStart ? 'background-position: center -40px;' : 'background-position: center 0;'"></span>
                    <span @click="showInfo = false"></span>
                </div>
            </div>
        </div>
        <audio id="ezui-talk"></audio>
    </div>
</template>

<script>
import { constants } from 'crypto';
import { sRecorder } from '@/lib/sRecorder';
import { setInterval, clearInterval } from 'timers';
export default {
    name: 'Talk',
    props: ['deviceSerial'],
    data () {
        return {
            talk: null,
            showInfo: false, //是否显示语音通话提示信息框
            talkStart: false, //是否开启开始通话
            talking: false, //是否正在通话
            socket: null,
            gRecorder: null,
            timer: null,

        }
    },
    created (){
        const that = this
        that.socket = new WebSocket('ws://192.168.2.129:8888')
        that.socket.onopen = function (e) {
            console.log('web socket open...', this)
        }
        that.socket.onmessage = function (e) {
            try {
                console.log(e.data)
            }catch(e) {
                console.log(e)
            }
        }
        that.socket.onclose = function (e) {
            console.log('websocket 断开: ' + e.code + ' ' + e.reason + ' ' + e.wasClean)
            console.log(e)
        }
        that.init()
    },
    methods: {
        init () {
            const that = this
            sRecorder.get = function (callback) {
                if (callback) {
                    navigator.getUserMedia(
                        { audio: true },
                        function (stream) {
                            var rec = new sRecorder(stream);
                            callback(rec);
                        }, function (error) {
                            console.log(error);
                    })
                }
            }
            sRecorder.get(function (rec) {
                that.gRecorder = rec;
            });
        },
        startTalk () {
            const that = this
            that.talkStart = !that.talkStart
            if(that.talkStart) {
                if(that.socket.readyState === 1) {
                    that.gRecorder.start();
                    that.timer = setInterval(function () {
                        let blob = that.gRecorder.getBlob()
                        //{id: that.deviceSerial,data: blob}
                        console.log(blob)
                        if(that.socket.readyState === 1) {
                            that.socket.send('123');
                        }else {
                            that.socket.onopen()
                            clearInterval(that.timer)
                        }
                        that.gRecorder.clear();
                    }, 2000, that)
                }else {
                    that.socket.onopen()
                    clearInterval(that.timer)
                    that.talkStart = false
                }
            }else {
                clearInterval(that.timer)
                that.gRecorder.clear();
                that.gRecorder.stop();
            }
            
            function onError(e) {
                console.log(e)
            }
        },
    },
    beforeDestroy () {
        const that = this
        if(that.socket.readyState===1) {
            that.socket.close()
        }
        that.gRecorder = null
        that.socket = null
    }
}
</script>

<style lang="scss" scoped>
@keyframes warn {
    0% {
        opacity: 0;
    }
    25% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.talk {
    position: fixed;
    right: 30px;
    bottom: 300px;
    z-index: 22;
    animation: warn 1s ease-out;
    .talk-button {
        width: 65px;
        height: 65px;
        background-image: url('../../assets/images/icons/106.png');
        background-repeat: no-repeat;
        background-position: 0 0;
        .talk-info {
            position: absolute;
            top: -230px;
            right: 32px;
            width: 198px;
            height: 210px;
            padding: 10px 20px;
            background-image: url('../../assets/images/icons/107.png');
            background-repeat: no-repeat;
            background-position: 0 0;
            >h3 {
                font-size: 18px;
                line-height: 45px;
                text-align: center;
                background-image: linear-gradient(180deg,#c3ecff 20%,#0557ba);
                background-clip: text;
                color: transparent;
            }
            >p {
                padding: 0;
                margin: 0;
                font-size: 14px;
                line-height: 25px;
                >span {
                    line-height: 40px;
                    color: #5bcafa;
                }
            }
            >div {
                display: flex;
                height: 35px;
                padding: 5px 0;
                >span {
                    display: block;
                    width: 50%;
                    height: 100%;
                    background-repeat: no-repeat;
                    background-position: center center;
                    cursor: pointer;
                    &:nth-child(1) {
                        background-image: url('../../assets/images/icons/108.png');
                        border-right: 1px solid #5bcafa;
                    }
                    &:nth-child(2) {
                        background-image: url('../../assets/images/icons/109.png');
                    }
                }
            }
        }
    }
}
</style>
