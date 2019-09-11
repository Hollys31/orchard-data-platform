<template>
<div ref="chart"></div>
</template>

<script>
/**
 * 折线图组件
 * titles: Array 标题列表
 * values：Array 值列表
 * unit: String 单位
 * names: Array 数据名称
 * name: String
 */
import echarts from '@/lib/echarts'
import { getElementSize, getMax } from '@/lib/util'
export default {
    name: 'LineChart',
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
            const max = getMax(that.values)
            const rm = that.$store.state.windowSize.rm
            if(that.titles[0].length === 10) {
                for(let i = 0; i < that.titles.length; i++) {
                    that.titles[i] = that.titles[i].slice(5, 10)
                }
            }
            const option = {
                color: ['rgb(67, 81, 124)', '#00beed'],
                grid: {
                    top: 40, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(data) {
                        let name = data[0].name
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;">'
                        let dataName = that.name? that.name : '数值'
                        data.forEach(item => {
                            str += '<div style="padding:5px 10px;">' + dataName + '：' + item.value + that.unit + '</div>'
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
                    right: 5,
                    top: 10,
                    itemWidth: 2 * rm,
                    itemHeight: rm,
                    textStyle: {
                        color: '#fff',
                        fontSize: 12,
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine: { show: true, lineStyle: { type: 'solid', color: 'rgba(255, 255, 255, 0.1)' } },
                    axisTick: {show: false},
                    minInterval: 1,
                    max: max,
                    interval: max/4,
                    axisLine: {show: false, lineStyle: { color: 'rgba(60, 80, 105, 1)' } },
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false, //x轴是否从零开始
                    data: that.titles,
                    axisTick: {show: false},
                    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                },
                series: that.getSeries(rm)
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
            let seriesArr = []
            let valueArr = []
            if(that.values[0] instanceof Array) {
                valueArr = that.values
            }else {
                valueArr[0] = that.values
            }
            for( let i = 0; i < valueArr.length; i++ ) {
                let obj = {
                    type: 'line',
                    data: valueArr[i],
                    symbolSize: 0.6 * rm,
                    symbol: 'circle',
                    label: {
                        show: false,
                        formatter: '{c}' + that.unit,
                        fontSize: 10,
                    },
                    itemStyle: {
                        color: '#6cebfc',
                        //shadowColor: 'rgba(255, 255, 255, 0.8)',
                        //shadowBlur: 8
                    },
                    smooth: true, //平滑折线
                    lineStyle: {
                        width: 2,
                        color: '#6cebfc',
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(67, 237, 248, 0.3)' }, { offset: 0.9, color: 'rgba(34, 34, 34, 0.1)' }], false)
                        }
                    },
                }
                that.names? obj.name = that.names[i] : ''
                seriesArr[i] = obj
            }
            return seriesArr
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                const size = getElementSize(that.$el)
                const rm = that.$store.state.windowSize.rm
                const option = {
                    grid: {
                        top: 30, left: 2 * rm, right: 2 * rm, bottom: 2 * rm, containLabel: true
                    },
                    tooltip: {
                        textStyle: {
                            fontSize: 1.4 * rm
                        }
                    },
                    legend: {
                        itemWidth: 2 * rm,
                        itemHeight: rm,
                        textStyle: {
                            fontSize: 12,
                        }
                    },
                    yAxis: [{
                        nameTextStyle: {
                            fontSize: 1.4 * rm
                        },
                        axisLabel: { 
                            fontSize: 12,
                        }
                    }],
                    xAxis: {
                        axisLabel: {
                            fontSize: 12,
                        }
                    },
                    series: [{
                        symbolSize: 0.8 * rm,
                    }]
                }
                that.chart.setOption(option)
                that.chart.resize({width: size.width, height: size.height})
            }else {
                that.init()
            }
        }
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