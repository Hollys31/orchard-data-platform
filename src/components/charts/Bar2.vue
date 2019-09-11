<template>
<div class="bar-y">
    <div ref="chart"></div>
</div>
</template>

<script>
/**
 * 柱状图组件
 * titles: Array 标题列表
 * values：Array 值列表
 * unit: String 单位
 * names: Array 多维数据名称
 * name: String 数据名称
 */
import echarts from '@/lib/echarts'
import { setTimeout } from 'timers'
import { getElementSize } from '@/lib/util'
import { close } from 'fs';
const color = [ '#4bd8b5', '#ff8080', '#ffd342', '#1981c9', '#1981c9', '#1981c9']
export default {
    name: 'Bar1Chart',
    props: {
        titles: {type: Array, default: () => {return []}},
        values: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''},
        names: {type: Array, default: () => {return []}},
        name: {type: String, default: ''}
    },
    data() {
        return {
            chart: null, //echart图表对象
        }
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.reDraw()
        },
        'values' () {
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
            if(!that.values.length) {
                return
            }
            const rm = that.$store.state.windowSize.rm
            const len = that.values.length
            const size = getElementSize(that.$el)
            let maxLen = parseInt(size.height / (6 * rm))
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,{width: size.width, height: maxLen < len ? size.height : len * 6 * rm})
            }else {
                that.chart.resize({width: size.width, height: maxLen < len ? size.height : len * 6 * rm})
            }
            let max = 0
            that.values.forEach((item) => {
                if(item > max) max = item
            })
            const option = {
                grid: {
                    top: 2 * rm, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(data) {
                        let name = data[0].name
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;">'
                        let dataName = that.name? that.name : '数值' 
                        data.forEach(item => {
                            str += '<div style="padding:5px 10px;">' + name + '：' + item.value + that.unit + '</div>'
                        })
                        str += '</div>'
                        return str
                    },
                    backgroundColor: 'rgba(0, 168, 255, 0)',
                    axisPointer: {
                        type: 'none',
                        shadowStyle: {
                            color: 'rgba(7, 83, 175, 0.5)'
                        }
                    },
                    confine: true,
                    textStyle: {
                        fontSize: 1.4 * rm
                    }
                },
                yAxis: {
                    type: 'category',
                    data: that.titles,
                    show: true,
                    //boundaryGap: false,
                    axisTick: {show: false},
                    axisLine: {show: true, lineStyle: { color: 'rgba(61, 119, 196, 0.5)' } },
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                },
                xAxis: {
                    show: true,
                    type: 'value',
                    axisTick: {show: false},
                    splitLine: { show: true, lineStyle: { type: 'dashed', color: 'rgba(61, 119, 196, 0.5)' } },
                    axisLine: {show: false, lineStyle: { color: 'rgba(60, 80, 105, 1)' } },
                    max: max * 1.2 + 1,
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                },
                series: [
                    {
                        name: '边框',
                        type: 'bar',
                        barWidth: 12,
                        legendHoverLink: false,
                        data: that.values.map( item => ( max * 1.2 + 1 ) ),
                        z: 0,
                        itemStyle: {
                            barBorderRadius: 6,
                            color: '#003688',
                        },
                        tooltip: {show: false}
                    },{
                        name: '数据',
                        type: 'bar',
                        yAxisIndex: 0,
                        barGap: '-100%',
                        barCategoryGap: "50%",
                        barWidth: 12,
                        data: that.values,
                        label: {
                            show: true,
                            position: 'right',
                            color: '#fff',
                            fontSize: 1.4 * rm,
                            align: 'left',
                            formatter: '{c}' + that.unit,
                        },
                        itemStyle: {
                            barBorderRadius: 6,
                            color: '#1981c9',
                        },
                        animationDuration: 5000,
                    },
                ]
            }
            that.chart.setOption(option, true)
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                const size = getElementSize(that.$el)
                const rm = that.$store.state.windowSize.rm
                const option = {
                    grid: {
                        top: 2 * rm, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                    },
                    tooltip: {
                        textStyle: {
                            fontSize: 1.4 * rm
                        }
                    },
                    yAxis: {
                        axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                    },
                    xAxis: {
                        axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                    },
                    series: [
                        {
                            name: '边框',
                            type: 'bar',
                        },{
                            name: '数据',
                            type: 'bar',
                            label: {
                                fontSize: 1.4 * rm,
                            },
                        },
                    ]
                }
                that.chart.setOption(options)
                that.chart.resize({width: size.width, height: size.height})
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
.bar-y div {
    position: absolute;
    top: 0;
    left: 0;
}
</style>
