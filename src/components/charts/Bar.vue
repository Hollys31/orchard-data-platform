<template>
<div ref="chart"></div>
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
import { getElementSize, getMax } from '@/lib/util'
const color = ['#f86464', '#02eeff', '#f3ac76']
export default {
    name: 'BarChart',
    props: {
        titles: {type: Array, default: () => {return []}},
        values: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''},
        names: {type: Array, default: () => {return []}},
        name: {type: String, default: ''}
    },
    data() {
        return {
            chart: null //echart图表对象
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
            const max = getMax(that.values)
            const count = that.values.length
            const option = {
                color: ['#0463de', '#70e7ef'],
                grid: {
                    top: 20, left: 2 * rm, right: 2 * rm, bottom: rm, containLabel: true
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: function(data) {
                        let name = data[0].name
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;">'
                        let dataName = that.name ? that.name : '数值' 
                        data.forEach(item => {
                            str += '<div style="padding:5px 10px;">' + name + '：' + item.value + that.unit + '</div>'
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
                    data:that.names ,
                    orient: 'vertical',
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
                    max: max, 
                    interval: max/4,
                    splitLine: {show: false, lineStyle: { color: 'rgba(19, 54, 86, 0.5)', width: 1 } },
                    axisTick: {show: false},
                    axisLine: { lineStyle: { color: 'rgba(60, 80, 105, 1)' } },
                    axisLabel: { color: '#fff', fontSize: 12, margin: 5 }
                },
                xAxis: {
                    type: 'category',
                    data: that.titles,
                    axisTick: {show: false},
                    axisLine: { lineStyle: { color: 'rgba(60, 80, 105, 1)' } },
                    axisLabel: { color: '#fff', fontSize: 12, margin: 10 }
                },
                series: [{
                    type: 'bar',
                    yAxisIndex: 0,
                    barCategoryGap: '40%',
                    data: that.values,
                    barWidth: 2 * rm,
                    itemStyle: {
                        barBorderRadius: [3, 3, 0, 0],
                        color: function(params) {
                            return params.dataIndex < 3 ? color[params.dataIndex] : '#00a8ff'
                        },
                    }
                }]
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
                        top: 40, left: 2 * rm, right: 2 * rm, bottom: 2 * rm, containLabel: true
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
                        axisLabel: { color: '#fff', fontSize: 12}
                    }],
                    xAxis: {
                        axisLabel: {
                            fontSize: 12,
                        }
                    },
                    series: [{
                        barWidth: 2 * rm,
                    }]
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