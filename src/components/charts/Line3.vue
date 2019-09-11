<template>
<div ref="chart"></div>
</template>

<script>
/**
 * 折线图组件
 * titles: Array 标题列表
 * values：Array 值列表
 * unit: String 单位
 * names: Array 多维数据名称
name: String 数据名称
 * titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
values: [
    [ 2200, 1800, 1500, 1400, 1500, 1800, 2000, 1900, 1700, 1500, 1300, 1200 ], 
    [ 1400, 1500, 1800, 2000, 1900, 1700, 1500, 1300, 1200, 1500, 1800, 2200 ],
    [ 2000, 1900, 1700, 1500, 1300, 1200, 1500, 1800, 2000, 1800, 1500, 1400 ]
],
names: ['脐橙', '葡萄', '柚子'],
unit: 'KG/亩'
name: 重量
 */
import echarts from '@/lib/echarts'
import { getElementSize, getMax } from '@/lib/util'
import { setInterval, clearInterval } from 'timers';
const color = [ '#4bd8b5', '#ff8080', '#ffd342', '#1981c9', '#1981c9', '#1981c9']
export default {
    name: 'Line3Chart',
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
            timer: null, //定时器
            series: null,
            legend: null,
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
            const size = getElementSize(that.$el)
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,{width: size.width, height: size.height})
            }
            const rm = that.$store.state.windowSize.rm
            that.getSeries(rm)
            const max = getMax(that.values)
            const option = {
                color: [ '#4bd8b5', '#ff8080', '#ffd342', '#1981c9', '#1981c9', '#1981c9'],
                grid: {
                    top: 40, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(data) {
                        let name = data[0].name
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;">'
                        data.forEach(item => {
                            let dataName = that.name? that.name : '数值'
                            if(that.names) {
                                dataName = item.seriesName
                            }
                            str += '<div style="padding:0px 10px;">' + dataName + '：' + item.value + that.unit + '</div>'
                        })
                        str += '</div>'
                        return str
                    },
                    backgroundColor: 'rgba(0, 168, 255, 0)',
                    axisPointer: {
                        type: 'line',
                        shadowStyle: {
                            color: 'rgba(7, 83, 175, 0.5)'
                        }
                    },
                    confine: true,
                    textStyle: {
                        fontSize: 1.4 * rm
                    }
                },
                legend: {
                    right: 2 * rm,
                    top: 5,
                    data: that.legend,
                    itemGap: rm,
                    itemWidth: 2 * rm,
                    itemHeight: rm,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                    }
                },
                yAxis: {
                    type: 'value',
                    position: 'left',
                    splitNumber: 4,
                    axisTick: {show: false},
                    splitLine: { show: true, lineStyle: { type: 'solid', color: 'rgba(255, 255, 255, 0.1)' } },
                    axisLine: { show: false, lineStyle: { color: 'rgba(60, 80, 105, 1)' } },
                    minInterval: 1,
                    max: max,
                    interval: max/4,
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10}
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false, //x轴是否从零开始
                    data: that.titles,
                    axisTick: {show: false},
                    axisLine: {show: true, lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                },
                series: that.series
            }
            that.chart.setOption(option, true)
            if(!that.names || that.names.length < 2) return
            const len = that.names.length
            let count = 1
            function setZoom() {
                const option = {
                    series: (function() {
                        let seriesArr = []
                        for(let i = 0; i < len; i++) {
                            seriesArr[i] = i === count ? {z: len} : {z: 0}
                        }
                        count++
                        if(count >= len) {
                            count = 0
                        }
                        return seriesArr
                    })()
                }
                that.chart.setOption(option)
            }
            clearInterval(that.timer)
            that.timer = setInterval(function() {
                if(!that.chart) {
                    clearInterval(that.timer)
                    return
                }
                setZoom()
            }, 3000, setZoom, that.chart, that.timer)
        },
        getSeries (rm) {
            const that = this
            let names = []
            let values = []
            let totals = []
            let len = that.names.length
            for(let i = 0; i < len; i++) {
                names[i] = that.names[i]
                values[i] = []
                totals[i] = 0
                for(let j = 0; j < that.values[i].length; j++) {
                    totals[i] += that.values[i][j]
                    values[i][j] = that.values[i][j]
                }
            }
            for(let i = 0; i < len; i++) {
                for(let j = 0; j < len - 1 - i; j++) {
                    if(totals[j + 1] > totals[j]) {
                        let total = totals[j]
                        totals[j] = totals[j + 1]
                        totals[j + 1] = total
                        let value = values[j]
                        values[j] = values[j + 1]
                        values[j + 1] = value
                        let name = names[j]
                        names[j] = names[j + 1]
                        names[j + 1] = name
                    }
                }
            }
            if(names.length > 4) {
                names = names.splice(0, 4)
                names[3] = '其它'
                for(let i = 4; i < values.length; i++) {
                    for(let j = 0; j < values[i].length; j++) {
                        values[3][j] += values[i][j]
                    }
                }
                values = values.splice(0, 4)
            }
            let seriesArr = []
            for( let i = 0; i < values.length; i++ ) {
                let obj = {
                    name: names[i],
                    type: 'line',
                    data: values[i],
                    symbol: 'none',
                    smooth: true,
                    lineStyle: {
                        width: 2.5,
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: color[i] }, { offset: 0.9, color: 'rgba(34, 34, 34, 0.1)' }], false)
                        }
                    },
                }
                seriesArr[i] = obj
            }
            let legendData = []
            for(let i = 0; i < names.length; i++) {
                if(names.length > 4 && i > 3) {
                    legendData.push({name: '其它', icon: 'circle'})
                    break
                }
                legendData.push({name: names[i], icon: 'circle'})
            }
            that.series = seriesArr
            that.legend = legendData
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                const size = getElementSize(that.$el)
                const rm = that.$store.state.windowSize.rm
                const option = {
                    grid: {
                        top: 40, left: 2 * rm, right: 2 * rm, bottom: rm
                    },
                    tooltip: {
                        textStyle: {
                            fontSize: 1.4 * rm
                        }
                    },
                    legend: {
                        right: 2 * rm,
                        itemWidth: 2 * rm,
                        itemGap: rm,
                        itemHeight: rm,
                        textStyle: {
                            fontSize: 12,
                        }
                    },
                    yAxis: {
                        axisLabel: { fontSize: 12}
                    },
                    xAxis: {
                        axisLabel: { fontSize: 12}
                    },
                }
                that.chart.setOption(option)
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