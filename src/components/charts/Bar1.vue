<template>
<div class="bar-y">
    <div ref="bgChart"></div>
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
            bgChart: null, //坐标轴
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
            let height = size.height;
            if(maxLen > len) {
                height = len * 6 * rm
            }
            if(len === 1) {
                height += 4 * rm
            }
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,{width: size.width, height: height})
                that.bgChart = echarts.init(that.$refs.bgChart,false,{width: size.width, height: size.height})
            }else {
                that.chart.resize({width: size.width, height: height})
                that.bgChart.resize({width: size.width, height: size.height})
            }
            let rankColor = []
            let clone = that.values.slice(0, len)
            clone = [...new Set(clone)]
            clone.sort(function (a, b) {
                return b - a
            })
            let max = clone[0]
            for(let i = 0; i < len; i++) {
            top:
                for(let j = 0; j < len; j++) {
                    if(that.values[i] === clone[j]) {
                        switch(j) {
                            case 0 : rankColor[i] = color[0]; continue top
                            case 1 : rankColor[i] = color[1]; continue top
                            case 2 : rankColor[i] = color[2]; continue top
                            default : rankColor[i] = color[3]; continue top
                        }
                    }
                }
            }
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
                    show: false,
                    //boundaryGap: false,
                    axisTick: {show: false},
                    axisLine: {show: true, lineStyle: { color: 'rgba(61, 119, 196, 0.5)' } },
                    axisLabel: { show: false},
                },
                xAxis: {
                    show: false,
                    type: 'value',
                    splitLine: { show: true, lineStyle: { type: 'dashed', color: 'rgba(61, 119, 196, 0.5)' } },
                    axisLine: {show: false, lineStyle: { color: 'rgba(61, 119, 196, 0.5)' } },
                    axisTick: {show: false},
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 },
                    max: max * 1.2 + 1
                },
                series: [
                    {
                        name: '边框',
                        type: 'bar',
                        barWidth: 12,
                        legendHoverLink: false,
                        data: that.values.map( item => ( max * 1.2 + 1 ) ),
                        z: 0,
                        label: {
                            show: true,
                            position: [size.width - 4 * rm - 10, -2 * rm],
                            color: '#fff',
                            fontSize: 1.4 * rm,
                            align: 'right',
                            formatter: function(params) {
                                return that.values[params.dataIndex] + that.unit;
                            },
                        },
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
                            position: [10, -2 * rm],
                            color: '#fff',
                            fontSize: 1.4 * rm,
                            align: 'left',
                            formatter: function(params) {
                                return that.titles[params.dataIndex]
                            },
                        },
                        itemStyle: {
                            barBorderRadius: 6,
                            color: function(params) {
                                return rankColor[params.dataIndex]
                            },
                        },
                        animationDuration: 5000,
                    },
                ]
            }
            const bgOption = {
                grid: {
                    top: 2 * rm, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                },
                yAxis: {
                    type: 'category',
                    data: that.titles,
                    show: true,
                    //boundaryGap: false,
                    axisTick: {show: false},
                    axisLine: {show: true, lineStyle: { color: 'rgba(61, 119, 196, 0.5)' } },
                    axisLabel: { show: false},
                },
                xAxis: {
                    show: true,
                    type: 'value',
                    splitLine: { show: true, lineStyle: { type: 'dashed', color: 'rgba(61, 119, 196, 0.5)' } },
                    axisLine: {show: false, lineStyle: { color: 'rgba(61, 119, 196, 0.5)' } },
                    axisTick: {show: false},
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 },
                    max: max * 1.2 + 1
                },
                series: [{
                        type: 'bar',
                        data: that.values,
                        itemStyle: {
                            barBorderRadius: 6,
                            color: 'rgba(0, 0, 0, 0)',
                        },
                    }
                ]
            }
            that.chart.setOption(option, true)
            that.bgChart.setOption(bgOption, true)
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                const size = getElementSize(that.$el)
                const rm = that.$store.state.windowSize.rm
                const options = {
                    grid: {
                        top: 4 * rm, left: 2 * rm, right: 2 * rm, bottom: rm
                    },
                    tooltip: {
                        textStyle: {
                            fontSize: 1.4 * rm
                        }
                    },
                    yAxis: [{
                        axisLabel: { 
                            fontSize: 12, 
                        },
                    }],
                    series: [{
                        label: {
                            position: [size.width - 4 * rm, -2 * rm],
                            fontSize: 1.4 * rm,
                        },
                    },{
                        label: {
                            position: [0, -2 * rm],
                            fontSize: 1.4 * rm,
                        },
                    },]
                }
                const bgOption = {
                    grid: {
                        top: 2 * rm, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                    },
                    xAxis: {
                        axisLabel: { color: '#fff', fontSize: 12, margin: 10 },
                    },
                }
                that.chart.setOption(options)
                that.bgChart.setOption(bgOption)
                that.chart.resize({width: size.width, height: size.height})
                that.bgChart.resize({width: size.width, height: size.height})
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
            that.bgChart.dispose()
            that.bgChart = null
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
