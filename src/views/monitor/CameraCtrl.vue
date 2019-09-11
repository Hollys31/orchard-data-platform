<template>
    <div class="camera-ctrl iconfont" @dblclick.stop="">
        <div class="top" @click="sendCtrlCmd(0)" title="向上旋转">&#xe6d9;</div>
        <div class="bottom" @click="sendCtrlCmd(1)" title="向下旋转">&#xe6d1;</div>
        <div class="left" @click="sendCtrlCmd(2)" title="向左旋转">&#xe7be;</div>
        <div class="right" @click="sendCtrlCmd(3)" title="向右旋转">&#xe604;</div>
        <div class="left-top" @click="sendCtrlCmd(0)" title="向左上旋转"></div>
        <div class="left-bottom" @click="sendCtrlCmd(1)" title="向左下旋转"></div>
        <div class="right-top" @click="sendCtrlCmd(2)" title="向右上旋转"></div>
        <div class="right-bottom" @click="sendCtrlCmd(3)" title="向右下旋转"></div>
        <div class="inner-ring">
            <div class="zoom-in" @click="sendCtrlCmd(8)" title="放大">&#xe60e;</div>
            <div class="zoom-out" @click="sendCtrlCmd(9)" title="缩小">&#xe613;</div>
            <div class="fast" @click="speed = 2" title="加快旋转速度">&#xe62b;</div>
            <div class="help" @click="sendCtrlCmd(12)" title="停止旋转">&#xe6db;</div>
            <div class="slow" @click="speed = 1" title="放慢旋转速度">&#xe64d;</div>
            <div class="far" @click="sendCtrlCmd(10)" title="远焦距">&#xe672;</div>
            <div class="near" @click="sendCtrlCmd(11)" title="近焦距">&#xe671;</div>
        </div>
    </div>
</template>

<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'CameraCtrl',
    props: ['deviceSerial'],
    data() {
        return {
            speed: 1,
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            isCameraCtrl: state => state.isCameraCtrl,
        }),
    },
    created () {
        const that = this
        document.addEventListener('keydown', that.handleKeyDown)
        //document.addEventListener('keyup', that.handleKeyUp)
    },
    methods: {
        handleKeyDown (e) {
            const that = this
            let code = null
            switch(e.key) {
                case 'ArrowUp': code = 0; break
                case 'ArrowDown': code = 1; break
                case 'ArrowLeft': code = 2; break
                case 'ArrowRight': code = 3; break
                case '8': code = 0; break
                case '2': code = 1; break
                case '4': code = 2; break
                case '6': code = 3; break
                case '7': code = 4; break
                case '1': code = 5; break
                case '9': code = 6; break
                case '3': code = 7; break
                case '+': code = 8; break
                case '-': code = 9; break
                case 'PageUp': code = 10; break
                case 'PageDown': code = 11; break
            }
            if(code != null) {
                that.sendCtrlCmd(code)
            }
        },
        sendCtrlCmd (direction) {
            //String deviceSerial,Integer direction,Integer speed
            //第一个参数是摄像头序列号，第二个是控制的方向，第三个是转动的速度
            //direction
            //0 - ↑， 1 - ↓， 2 - ←， 3 - →
            //4 - ↖， 5 - ↙， 6 - ↗， 7 - ↘
            //8 - 放大， 9 - 缩小， 10 - 近焦距， 11 - 远焦距
            //speed
            //0 - 慢， 1 - 适中， 2 - 快
            const that = this
            if(that.isCameraCtrl) {
                that.$store.commit(nameSpaced + types.MONITOR_SET_CAMERA_CTRL, false)
                that.$store.dispatch(
                    nameSpaced + types.MONITOR_CAMERA_CTRL_CMD, 
                    {deviceSerial: that.deviceSerial, direction: direction, speed: that.speed}
                )
            }
        }
    },
    beforeDestroy() {
        const that = this
        document.removeEventListener('keydown', that.handleKeyDown)
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
.camera-ctrl {
    position: fixed;
    right: 40px;
    bottom: 40px;
    width: 210px;
    height: 210px;
    border-radius: 100%;
    background-color: rgba(32,72,151,.95);
    z-index: 22;
    animation: warn 1s ease-out;
    >div {
        position: absolute;
        width: 70px;
        height: 70px;
        text-align: center;
        cursor: pointer;
        user-select: none;
        line-height: 70px;
        color: #ccc;
        &:hover {
            color: #fff;
        }
    }
    
    .left-top {
        top: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        line-height: 50px;
    }
    .top {
        top: 0;
        left: 70px;
        line-height: 50px;
    }
    .right-top {
        top: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        line-height: 50px;
    }
    .left {
        top: 70px;
        left: 0;
        width: 50px;
    }
    .right {
        top: 70px;
        right: 0;
        width: 50px;
    }
    .left-bottom {
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        line-height: 50px;
    }
    .bottom {
        bottom: 0;
        left: 70px;
        height: 50px;
        line-height: 50px;
    }
    .right-bottom {
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        line-height: 50px;
    }
    .inner-ring {
        position: absolute;
        top: 45px;
        left: 45px;
        width: 120px;
        height: 120px;
        border-radius: 100%;
        background-color: rgba(52,121,223,.25);
        overflow: hidden;
        color: #ccc;
        >div {
            position: absolute;
            height: 40px;
            width: 40px;
            line-height: 40px;
            color: #ccc;
            &:hover {
                color: #fff;
            }
        }
        .zoom-in {
            top: 0;
            left: 20px;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        .zoom-out {
            top: 0;
            right: 20px;
        }
        .fast {
            top: 40px;
            right: 0;
            background: #43517c;
        }
        .help {
            font-size: 24px;
            line-height: 40px;
            top: 40px;
            left: 40px;
            background: #43517c;
        }
        .slow {
            top: 40px;
            left: 0;
            background: #43517c;
        }
        .far {
            bottom: 0;
            left: 20px;
            border-right: 1px solid rgba(255, 255, 255, 0.1);
        }
        .near {
            bottom: 0;
            right: 20px;
        }
    }
}
</style>
