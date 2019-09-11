<template>
<div class="pie">
    <ul class="rank-list">
        <li v-for="(item, index) in data" :key="index">
            <span v-if="index < 5">{{index + 1}}</span>
            <span v-if="index < 5" :style="'width: ' + maxLen * 12 + 'px;'">{{item.name}}</span>
            <span v-if="index < 5"><span :style="'width: ' + item.value/sum*100/40 + 'rem'"></span></span>
            <span v-if="index < 5">{{(item.value/sum*100) >= 10 ? (item.value/sum*100).toFixed(2) : (item.value/sum*100).toFixed(3)}}%</span>
        </li>
    </ul>
    <ul class="legend" :style="'line-height: ' + size.height + 'px'">
        <li v-for="(item, index) in dataset" :key="index">
            <span>{{item.name}}</span>
        </li>
    </ul>
    <div ref="chart"></div>
</div>
</template>

<script>
/**
 * 饼状图组件
 * data: Object 数据 {name: '', value: ''}
 * title: String 图表名称
 * unit: String 单位
 * name: String 数据名称
 * orient: String  legend方向
 * data: [
        {name: '脐橙', value: 200},
        {name: '葡萄', value: 190},
        {name: '香蕉', value: 180},
        {name: '芒果', value: 160},
    ],
titles: ['脐橙', '葡萄', '香蕉', '芒果', '西瓜', '草莓'].reverse(),
values: [200, 190, 180, 160, 130, 90].reverse(),
unit: 'kg'
 */
import echarts from '@/lib/echarts'
import { getElementSize } from '@/lib/util'
export default {
    name: 'Pie1',
    props: {
        data: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''},
        title: {type: String, default: ''},
        name: {type: String, default: ''}
    },
    data() {
        return {
            chart: null, //echart图表对象
            dataset: [],
            size: {width: 100, height: 100},
            sum: 0,
            maxLen: 0,
        }
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.reDraw()
        },
        'data' () {
            this.init()
        }
    },
    mounted() {
        const that = this
        that.init()
    },
    methods: {
        init () {   //实例化图表
            const that = this
            if(!that.data.length) {
                return
            }
            that.size = getElementSize(that.$el)
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,that.size)
            }
            that.dataset = []
            that.sum = 0
            that.maxLen = 0
            let obj = {'其它': 0}
            that.data.forEach((item, i) => {
                if(i > 2 && that.data.length > 4) {
                    obj['其它'] = obj['其它'] + item.value
                }else {
                    obj[item.name] = item.value
                    that.dataset.push(item)
                }
                that.sum += item.value
                if(item.name.length > that.maxLen) {
                    that.maxLen = item.name.length
                }
            })
            if(obj['其它']){
                that.dataset.push({name: '其它', value: obj['其它']})
            }
            const rm = that.$store.state.windowSize.rm
            let center = that.position === 'left' ? ['25%', '45%'] : ['75%', '45%']
            let pieSize = ['45%', '70%']
            if(this.size.width/2 < this.size.height) {
                pieSize = [this.size.width/2*0.45/this.size.height*100 + '%', this.size.width/2*0.7/this.size.height*100 + '%']
            }

            const option = {
                color: [ '#4bd8b5', '#ff8080', '#ffd342', '#1981c9', '#1981c9', '#1981c9'],
                grid: {
                    top: rm, left: 2*rm, right: 2*rm, bottom: rm, containLabel: true
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(data) {
                        //name , value, percent, seriesName
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;"><div style="padding:5px 10px;">' + data.name + '：' + data.value + that.unit + '</div><div style="padding:5px 10px;">占比：' + data.percent + '%</div></div>'
                        //console.log(data)
                        return str
                    },
                    backgroundColor: 'rgba(0, 168, 255, 0)',
                    textStyle: {
                        fontSize: 1.4 * rm
                    },
                    confine: true,
                },
                series: [{
                    name: that.name? that.name : '数值',
                    type: 'pie',
                    center: center,
                    radius: pieSize,
                    minAngle: 20, //最小的扇区角度（0 ~ 360）
                    data: that.dataset,
                    label: { show: false },
                    labelLine: { show: false },
                    emphasis: {
                        label: { show: false },
                    }
                },{
                    name: '中间文本',
                    type: 'pie',
                    center: center,
                    radius: ['0%', '40%'],
                    data: [1],
                    hoverAnimation: false,
                    tooltip: {show: false},
                    itemStyle: { color: 'rgba(0, 0, 0, 0)' },
                    label: {
                        show: true,
                        position: 'center',
                        formatter: ['{a|' + that.sum + that.unit + '}', '{b|' + that.name + '}'].join('\n'),
                        lineHeight: rm * 2,
                        rich: {
                            a: { color: '#fff', fontSize: rm * 1.6 },
                            b: { color: '#fff', fontSize: rm * 1.4 }
                        }
                    },
                    labelLine: { show: false },
                }]
            }
            that.chart.setOption(option, true)
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                that.size = getElementSize(that.$el)
                const rm = that.$store.state.windowSize.rm
                let center = that.position === 'left' ? ['25%', '45%'] : ['75%', '45%']
                let pieSize = ['45%', '70%']
                if(this.size.width/2 < this.size.height) {
                    pieSize = [this.size.width/2*0.45/this.size.height*100 + '%', this.size.width/2*0.7/this.size.height*100 + '%']
                }
                const option = {
                    grid: {
                        top: rm, left: 2*rm, right: 2*rm, bottom: rm
                    },
                    tooltip: {
                        textStyle: {
                            fontSize: 1.4 * rm
                        },
                    },
                    series: [{
                        center: center,
                        radius: pieSize,
                    },{
                        center: center,
                        label: {
                            lineHeight: rm * 2,
                        },
                    }]
                }
                that.chart.setOption(option)
                that.chart.resize(that.size)
            }else {
                that.init()
            }
        },
    },
    beforeDestroy () {
        const that = this
        if(that.chart){
            that.chart.dispose()
            that.chart = null
        }
    }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px){
    .pie {
        .rank-list {
            top: 5px;
            left: 10px;
            >li {
                line-height: 20px;
                &:nth-child(7) {
                    display: none;
                }
                >span {
                    margin-right: 5px;
                    &:nth-child(1) {
                        width: 15px;
                        background-position: center 5px;
                        background-size: 15px 15px;
                    }
                    &:nth-child(3) {
                        margin-top: 5px;
                        width: 50px;
                        height: 6px;
                        border-radius: 6px;
                        >span {
                            height: 6px;
                            border-radius: 6px;
                        }
                    }
                    &:nth-child(3) {
                        display: none;
                    }
                }
            }
        }
        .legend {
            bottom: 10px;
            padding-right: 10px;
            >li {
                line-height: 15px;
                padding-left: 10px; 
                &:not(:last-child) {
                    >span {
                        padding-right: 5px;
                    }
                }
                &::before {
                    top: 6px;
                    width: 5px;
                    height: 5px;
                    box-shadow: 0 0 5px 1px #29b5d8;
                }
            }
        }
    }
}
@media screen and (min-width: 1367px){
    .pie {
        .rank-list {
            top: 10px;
            left: 20px;
            >li {
                line-height: 30px;
                >span {
                    margin-right: 5px;
                    &:nth-child(1) {
                        width: 20px;
                        background-position: center 7px;
                        background-size: 20px 20px;
                    }
                    &:nth-child(3) {
                        margin-top: 8px;
                        width: 2.5rem;
                        height: 12px;
                        border-radius: 6px;
                        >span {
                            height: 12px;
                            border-radius: 6px;
                        }
                    }
                }
            }
        }
        .legend {
            bottom: 10px;
            padding-right: 20px;
            >li {
                line-height: 20px;
                padding-left: 10px;
                &:not(:last-child) {
                    >span {
                        padding-right: 10px;
                    }
                }
                &::before {
                    top: 6px;
                    width: 8px;
                    height: 8px;
                    box-shadow: 0 0 6px 1px #29b5d8;
                }
            }
        }
    }
}
.pie {
    width: 100%;
    height: 100%;
    font-size: 12px;
    .rank-list {
        position: absolute;
        height: calc(100% - 10px);
        overflow: hidden;
        >li {
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            >span {
                text-align: center;
                &:nth-child(1) {
                    background-image: url('../../assets/images/icons/76.png');
                    background-repeat: no-repeat;
                }
                &:nth-child(2) {
                    text-align: left;
                    color: #1981c9;
                }
                &:nth-child(3) {
                    position: relative;
                    background-color: #003688;
                    >span {
                        position: absolute;
                        top: 0;
                        left: 0;
                        background-color: #1981c9;
                    }
                }
            }
            &:nth-child(1) {
                >span {
                    &:nth-child(1) {
                        background-image: url('../../assets/images/icons/73.png');
                    }
                    &:nth-child(2) {
                        color: #4bd8b5;
                    }
                    &:nth-child(3) {
                        color: #4bd8b5;
                        >span {
                            background-color: #4bd8b5;
                        }
                    }
                }
            }
            &:nth-child(2) {
                >span {
                    &:nth-child(1) {
                        background-image: url('../../assets/images/icons/74.png');
                    }
                    &:nth-child(2) {
                        color: #ff8080;
                    }
                    &:nth-child(3) {
                        color: #ff8080;
                        >span {
                            background-color: #ff8080;
                        }
                    }
                }
            }
            &:nth-child(3) {
                >span {
                    &:nth-child(1) {
                        background-image: url('../../assets/images/icons/75.png');
                    }
                    &:nth-child(2) {
                        color: #ffd342;
                    }
                    &:nth-child(3) {
                        color: #ffd342;
                        >span {
                            background-color: #ffd342;
                        }
                    }
                }
            }
        }
    }
    .legend {
        position: absolute;
        right: 0;
        display: flex;
        justify-content: flex-end;
        align-content: center;
        >li {
            position: relative;
            white-space: nowrap;
            &::before {
                content: '';
                position: absolute;
                left: 0;
                border-radius: 100%;
                background-color: #1981c9;
            }
            &:nth-child(1) {
                &::before {
                    background-color: #4bd8b5;
                }
            }
            &:nth-child(2) {
                &::before {
                    background-color: #ff8080;
                }
            }
            &:nth-child(3) {
                &::before {
                    background-color: #ffd342;
                }
            }
        }
    }
}
</style>
