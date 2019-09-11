<template>
<div class="pie">
    <ul class="legend" :style="position === 'left' ? 'left: 50%' : ''">
        <li v-for="(item, index) in dataset" :key="index">
            <span>{{(item.value/sum*100) >= 10 ? (item.value/sum*100).toFixed(2) : (item.value/sum*100).toFixed(3)}}%</span>
            <span :title="item.name">{{item.name}}</span>
            <span>{{dataset[0].cropName}}</span>
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
    name: 'Pie1Chart',
    props: {
        data: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''},
        title: {type: String, default: ''},
        name: {type: String, default: ''},
        position: {type: String, default: 'right'} //饼图位置
    },
    data() {
        return {
            chart: null, //echart图表对象
            dataset: [],
            size: {width: 100, height: 100},
            sum: 0,
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
            let obj = {'其它': 0}
            let maxLen = 0
            that.data.forEach((item, i) => {
                if(i > 2 && that.data.length > 4) {
                    obj['其它'] = obj['其它'] + item.value
                }else {
                    obj[item.name] = item.value
                    that.dataset.push(item)
                }
                that.sum += item.value
                if(item.name.length > maxLen) {
                    maxLen = item.name.length
                }
            })
            if(obj['其它']){
                that.dataset.push({name: '其它', value: obj['其它']})
            }
            const rm = that.$store.state.windowSize.rm
            let center = that.position === 'left' ? ['25%', '50%'] : ['75%', '50%']
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
                    radius: ['0%', '45%'],
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
                let center = that.position === 'left' ? ['25%', '50%'] : ['75%', '50%']
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
        font-size: 12px;
        >ul {
            left: 10px;
            >li {
                line-height: 15px;
                padding: 5px 0 5px 20px;
                >span {
                    padding-right: 10px;
                }
                &::before {
                    top: 10px;
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
        font-size: 14px;
        >ul {
            left: 25px;
            >li {
                line-height: 20px;
                padding: 10px 0 10px 35px;
                >span {
                    padding-right: 20px;
                }
                &::before {
                    top: 16px;
                    width: 8px;
                    height: 8px;
                    box-shadow: 0 0 10px 2px #29b5d8;
                }
            }
        }
    }
}
.pie {
    width: 100%;
    height: 100%;
    >ul {
        position: absolute;
        display: flex;
        flex-wrap: wrap;
        top: 0;
        max-width: calc(50% - 5px);
        height: 100%;
        align-content: center;
        align-items: center;
        >li {
            position: relative;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            &::before {
                content: '';
                position: absolute;
                left: 10px;
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
