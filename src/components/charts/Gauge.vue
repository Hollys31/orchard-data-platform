<template>
<div ref="chart"></div>
</template>

<script>
/**
 * 仪表盘图表组件
 * data: Object 数据 {name: '', value: ''}
 * unit: String 单位
 * color: color 进度条颜色
 */
import echarts from '@/lib/echarts'
import { getElementSize, setElementResizeListeners } from '@/lib/util'
export default {
    name: 'GaugeChart',
    props: {
        data: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''},
        color: {type: String, default: ''}
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
            this.setData()
        }
    },
    mounted() {
        const that = this
        that.init()
    },
    methods: {
        setData () {
            const that = this
            const option = {
                title: {
                    text: that.data[0].value + that.unit + '\n' + that.data[0].name,
                },
                data: [that.data],
                series: [{ // 主圆环
                    name: that.data[0].name,
                    data: [{
                        value: 75 * that.data[0].value / that.data[0].max
                    }, {
                        value: 100 - (75 * that.data[0].value / that.data[0].max)
                    }],
                    tooltip: {
                        formatter: function(data) {
                            let str = '<div style="background-color:#32C5E9;border-radius: 4px;"><div style="padding:5px 10px;">' + that.data[0].name + '：' + that.data[0].value + that.unit + '</div></div>'
                            return str
                        },
                    }
                }],
            }
            that.chart.setOption(option)
        },
        init () {   //实例化图表
            const that = this
            const size = getElementSize(that.$el)
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,{width: size.width, height: size.height})
            }
            const rm = that.$store.state.windowSize.rm
            const option = {
                tooltip: {
                    show: false
                },
                title: {
                    text: '',
                    x: '49%',
                    y: '35%',
                    textAlign: 'center',
                    textStyle: {
                        fontWeight: 'bold',
                        fontSize: 1.4 * rm,
                        color: '#fff',
                        lineHeight: 2.4 * rm,
                    }
                },
                series: [{ // 主圆环
                    name: 'main',
                    type: 'pie',
                    radius: ['50%', '80%'],
                    startAngle: 225,
                    tooltip: {
                        trigger: 'item',
                        show: true,
                        backgroundColor: 'rgba(0, 168, 255, 0)',
                        textStyle: {
                            fontSize: 1.4 * rm
                        },
                    },
                    color: [{
                        type: 'linear',
                        x: 1,
                        y: 0,
                        x2: 0,
                        y2: 0,
                        colorStops: [{
                            offset: 0,
                            color: that.color? that.color : 'rgba(0, 224, 254, 1)' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color:  that.color? that.color : 'rgba(0, 224, 254, 1)' // 100% 处的颜色
                        }]
                    }, 'transparent'],
                    z: 10,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: []
                }, { // 背景圆环
                    name: '',
                    type: 'pie',
                    radius: ['50%', '80%'],
                    silent: true,
                    startAngle: 225,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    z: 5,
                    data: [{
                        value: 75,
                        itemStyle: {
                            color: 'rgba(27, 74, 157, 0.5)',
                            borderWidth: 2,
                            borderColor: 'rgba(0, 224, 254, 0.15)'
                        }
                    }, {
                        value: 25,
                        itemStyle: {
                            color: 'transparent'
                        }
                    }]
                }, { // 底部
                    name: '',
                    type: 'pie',
                    radius: ['50%', '80%'],
                    startAngle: 230,
                    labelLine: {
                        show: false
                    },
                    z: 15,
                    silent: true,
                    data: [{ // 底部两条线
                        value: 2,
                        itemStyle: {
                            color: 'rgba(0, 224, 254, 1)'
                        }
                    }, {
                        value: 800,
                        itemStyle: {
                            color: 'transparent'
                        }
                    }, {
                        value: 2,
                        itemStyle: {
                            color: 'rgba(0, 224, 254, 1)'
                        }
                    }, {
                        value: 230,
                        itemStyle: {
                            color: 'transparent'
                        }
                    }]
                },  { // 中间圈
                    name: '',
                    z: 5,
                    type: 'pie',
                    cursor: 'default',
                    radius: ['42%', '42%'],
                    hoverAnimation: false,
                    legendHoverLink: false,
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: [{
                        value: 1,
                        itemStyle: {
                            normal: {
                                borderWidth: 2,
                                borderColor: {
                                    type: 'linear',
                                    x: 0,
                                    y: 0,
                                    x2: 0,
                                    y2: 1,
                                    colorStops: [{
                                        offset: 0,
                                        color: 'rgba(2,144,214,0.8)' // 0% 处的颜色
                                    }, {
                                        offset: 1,
                                        color: 'rgba(2,144,214,0.8)' // 100% 处的颜色
                                    }]
                                }
                            }
                        }
                    }]
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
                title: {
                    textStyle: {
                        fontSize: 1.4 * rm,
                        lineHeight: 2.4 * rm,
                    }
                },
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