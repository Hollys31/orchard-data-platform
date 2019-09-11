<template>
<div ref="chart"></div>
</template>

<script>
/**
 * 雷达图组件
 * data: Array 数据
 * unit: String 单位
 * data: [
        {name: 'FM1设备', max: 6000, value: 3521}, 
        {name: 'FM2设备', max: 6000, value: 4374}, 
        {name: '水肥设备', max: 6000, value: 2435}, 
        {name: '普通摄像机', max: 6000, value: 4284}, 
        {name: '全景摄像机', max: 6000, value: 4041}
    ],
unit: '台'
 */
import echarts from '@/lib/echarts'
import { getElementSize } from '@/lib/util'
const color = ['#3950cd', '#c76293']
export default {
    name: 'RadarChart',
    props: {
        data: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''}
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
            const size = getElementSize(that.$el)
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,{width: size.width, height: size.height})
            }
            let max = 0
            that.data.map(item => {
                if(item.value > max) {
                    max = item.value
                }
            })
            max = parseInt(max * 1.2) + 1
            let data = []
            that.data.map(item => {
                data.push({
                    name: item.name,
                    value: item.value,
                    max: max
                })
            })
            let values = [{
                name: '设备数量',
                value: that.data.map(item => {return item.value}),
            }]
            const rm = that.$store.state.windowSize.rm
            const option = {
                color: ['#3950cd', '#c76293'],
                tooltip: {
                    show: false,
                    trigger: 'item',
                    formatter: function(data) {
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;">'
                        for(let i = 0; i < data.value.length; i++) {
                            str += '<div style="padding:5px 10px;">' + that.data[i].name + '：' + data.value[i] + that.unit + '</div>'
                        }
                        str += '</div>'
                        return str
                    },
                    backgroundColor: 'rgba(0, 168, 255, 0)',
                    confine: true,
                    textStyle: {
                        fontSize: 1.4 * rm
                    }
                },
                radar: {
                    splitNumber: 4,
                    nameGap: rm,
                    indicator: data,
                    center: data.length%2 === 0? ['50%', '50%'] : ['50%', '58%'],
                    radius: data.length%2 === 0? '50%' : '70%',
                    name: {
                        color: '#fff',
                        fontSize: 1.4 * rm,
                        lineHeight: 1.9 * rm,
                        formatter (value, indicator) {
                            return '{a|' + value + '}\n{b|' + indicator.value + '(' + that.unit + ')}'
                        },
                        rich: {
                            a: {
                                fontSize: 1.4 * rm,
                                align: 'center'
                            },
                            b: {
                                color: '#2a8abc',
                                fontSize: 12,
                                align: 'center'
                            }
                        }
                    },
                    splitArea: { show: false },
                    splitLine: {
                        lineStyle: {
                            color: '#0463de',
                            shadowColor: '#0463de',
                            shadowBlur: 2
                        }
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#2a8abc',
                            shadowColor: '#2a8abc',
                            shadowBlur: 2
                        }
                    }
                },
                series: [{
                    type: 'radar',
                    data: values,
                    symbolSize: 0.6 * rm,
                    lineStyle: {
                        color: '#1feffe'
                    },
                    areaStyle: {
                        color: 'rgba(31, 239, 254, 0.5)'
                    },
                    itemStyle: {
                        color: '#fff',
                        borderColor: '#1ff1ff',
                        borderWidth: 1,
                        shadowColor: '#fff',
                        shadowBlur: 3
                    },
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
                    tooltip: {
                        textStyle: {
                            fontSize: 1.4 * rm
                        }
                    },
                    radar: {
                        nameGap: rm,
                        name: {
                            fontSize: 1.4 * rm,
                            lineHeight: 1.9 * rm,
                            rich: {
                                a: {
                                    fontSize: 1.4 * rm,
                                },
                                b: {
                                    fontSize: 12,
                                }
                            }
                        },
                    },
                    series: [{
                        symbolSize: 0.6 * rm,
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