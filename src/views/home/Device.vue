<template>
    <div class="device">
        <div class="radar">
            <div v-for="(item, index) in textPosition" :key="index" class="legend" :style="'transform: rotate(' + (360 / data.length * index) + 'deg);'">
                <span :style="'transform: rotate(' + -item.deg + 'deg);left: ' + item.left + 'px;top:' + item.top + '%'">{{data[index].name}}</span>
                <div></div>
            </div>
            <div class="scan"></div>
        </div>
        <ul class="device-list">
            <li v-for="(item, index) in data" :key="index" :class="item.type">
                <span :title="item.name">{{item.name}}</span>
                <span>{{item.value}}台</span>
            </li>
        </ul>
    </div>
</template>
<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.HOME + '/'
export default {
    name: 'Device',
    props: ['data', 'unit', 'indicator'],
    data () {
        return {
            textPosition: [],
        }
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.setTextPosition()
        },
        'data' () {
            this.setTextPosition()
        },
    },
    methods: {
        setTextPosition () {
            const that = this
            const len = that.data.length
            let textPosition = []
            that.data.forEach(function(item, i) {
                let p = {}
                p.deg = 360 / len * i
                if(p.deg < 90) {
                    p.top = 30 - p.deg/12
                    p.left = p.deg/5
                }else if(p.deg < 180) {
                    p.top = 15 + p.deg%90/12
                    p.left = p.deg%90/5
                }else if(p.deg < 270) {
                    p.top = 15 + p.deg%90/12
                    p.left = -p.deg%90/5
                }else {
                    p.top = 30 - p.deg%90/4
                    p.left = -p.deg%90/1.5
                }
                textPosition.push(p)
            })
            that.textPosition = textPosition
        }
    }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px){
    .device {
        .radar {
            .legend {
                >span {
                    display: none;
                }
                >div {
                    width: 10px;
                    height: 10px;
                    box-shadow: 0 0 6px 2px rgba(41, 181, 216, 0.2);
                }
            }
        }
        .device-list {
            width: 50px;
            >li {
                font-size: 12px;
                margin-left: 15px;
                padding: 3px 0 3px 15px;
                background-size: 10px 10px;
                line-height: 1.2em;
                >span {
                    padding-right: 5px;
                    &:nth-child(1) {
                        width: 50px;
                    }
                }
            }
        }
    }
}
@media screen and (min-width: 1367px){
    .device {
        .radar {
            .legend {
                >div {
                    width: 10px;
                    height: 10px;
                    box-shadow: 0 0 6px 2px rgba(41, 181, 216, 0.2);
                }
            }
        }
        .device-list {
            width: 100px;
            >li {
                margin-left: 20px;
                padding: 5px 0 5px 20px;
                background-size: 15px 15px;
                line-height: 1.5em;
                >span {
                    padding-right: 20px;
                    &:nth-child(1) {
                        width: 90px;
                    }
                }
            }
        }
    }
}
@keyframes circle {
    0% {
        transform: rotate(0deg);  
    }
    100% {
        transform: rotate(360deg);  
    }
}
.device {
    height: 100%;
    .radar {
        position: absolute;
        top: 0;
        left: 0;
        width: 50%;
        height: 100%;
        background-image: url('../../assets/images/radar_bg.png');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 90% auto;
        .legend {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            text-align: center;
            >span {
                position: absolute;
                top: 30%;
                left: 0;
                width: 100%;
                font-size: 12px;
            }
            >div {
                border-radius: 100%;
                background-color: #1981c9;
                margin: 25% auto;
            }
            &:nth-child(1) {
                >div {
                    background-color: #4bd8b5;
                }
            }
            &:nth-child(2) {
                >div {
                    background-color: #ff8080;
                }
            }
            &:nth-child(3) {
                >div {
                    background-color: #ffd342;
                }
            }
        }
        .scan {
            height: 100%;
            background-image: url('../../assets/images/radar_scan.png');
            background-position: center;
            background-repeat: no-repeat;
            background-size: 74% auto;
            animation: circle 8s infinite linear;
        }
    }
    .device-list {
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        top: 0;
        left: 45%;
        height: 100%;
        align-content: center;
        align-items: center;
        >li {
            position: relative;
            white-space: nowrap;
            background-position: 0 center;
            background-repeat: no-repeat;
            >span {
                display: inline-block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .A {
            background-image: url('../../assets/images/icons/92.png');
        }
        .B {
            background-image: url('../../assets/images/icons/93.png');
        }
        .AI {
            background-image: url('../../assets/images/icons/94.png');
        }
        .C {
            background-image: url('../../assets/images/icons/95.png');
        }
        .FM1 {
            background-image: url('../../assets/images/icons/97.png');
        }
        .FM2 {
            background-image: url('../../assets/images/icons/98.png');
        }
        .other {
            background-image: url('../../assets/images/icons/96.png');
        }
    }
}
</style>
