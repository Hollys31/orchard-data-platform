<template>
<div class="scatter">
    <div ref="chart"></div>
    <ul class="rank-list">
        <li v-for="(item, index) in data" :key="index">{{item.name}} <span v-if="index != 9">(<span>{{item.value}}</span>)</span></li>
    </ul>
</div>
</template>

<script>
/**
 * 气泡图组件
 * data: Object 数据 
 * data: [
        { name: '赣州市', value: 3544 },
        { name: '崇义市',value: 2544 },
        { name: '芜湖市',value: 2543 },
        { name: '长沙市',value: 2240 },
        { name: '南昌市',value: 1452 },
        { name: '宜春市',value: 1134 },
        { name: '新余市',value: 589 },
        { name: '南康市',value: 465 },
        { name: '上饶市',value: 123 },
        { name: '其它',value: 1054 }
    ]
 * unit: String 单位
 */
import echarts from '@/lib/echarts'
import china from '@/lib/china.json'
import { getElementSize } from '@/lib/util'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
if(!echarts.getMap('全国')) {
    echarts.registerMap('全国', china)
}
const nameSpaced = ns.MAP + '/'
export default {
    name: 'Scatter3',
    props: {
        data: {type: Array, default: () => {return []}},
        unit: {type: String, default: ''}
    },
    data() {
        return {
            chart: null //echart图表对象
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            map: state => state.map,
            region: state => state.region,
        })
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
            const option = {
                color: [ '#08215d' ],
                grid: { top: 0, left: 0, right: 0, bottom: 0 },
                geo: {
                    map: '全国',
                    silent: true,
                    layoutCenter: [ '60%', '50%'],
                    layoutSize: '120%',
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        areaColor: 'rgba(0, 0, 0, 0)',
                        borderColor: 'rgba(6, 58, 107, 0.3)',
                        borderWidth: 2,
                    }
                },
                xAxis: [{
                    gridIndex: 0,
                    type: 'value',
                    show: false,
                    min: 0,
                    max: 100,
                    nameLocation: 'middle',
                    nameGap: 5
                }],
                yAxis: [{
                    gridIndex: 0,
                    min: 0,
                    show: false,
                    max: 100,
                    nameLocation: 'middle',
                    nameGap: 30
                }],
                series: that.getSeries(size)
            }
            that.chart.setOption(option, true)
        },
        getSeries (size) {
            const that = this
            const count = that.data.length
            const rm = that.$store.state.windowSize.rm
            let series = []
            //480/100 260/100
            let coords = [ //[x, y, symbolSize, fontSize]
                [67.5, 50, 9 * rm, 2 * rm],
                [44.58, 42.31, 7.5 * rm, 1.8 * rm],
                [75.83, 82, 6 * rm, 1.6 * rm],
                [52.92, 75, 6 * rm, 1.4 * rm],
                [88.33, 67.31, 5.5 * rm, 1.4 * rm],
                [46.67, 13.46, 5 * rm, 1.4 * rm],
                [73.75, 19.23, 5 * rm, 1.2 * rm],
                [58, 24, 4.2 * rm, 1.2 * rm],
                [86.25, 30.77, 4.2 * rm, rm],
                [85, 49, 3 * rm, rm],
            ]
            for(let i = 0; i < count; i++) {
                if(i > 9) {
                    break
                }
                let bgColor = '#0b3b87'
                if(i === 0) {
                    bgColor = '#4bd8b5'
                }else if(i === 1) {
                    bgColor = '#ff8080'
                }else if(i === 2) {
                    bgColor = '#ffd342'
                }
                series.push({
                    type: 'scatter',
                    symbol: 'circle',
                    symbolSize: coords[i][2],
                    legendHoverLink: false,
                    //hoverAnimation: false,
                    label: {
                        normal: {
                            show: true,
                            formatter (data) {
                                return data.data[3]
                            },
                            color: '#fff',
                            textStyle: {
                                fontSize: coords[i][3],
                                lineHeight: coords[i][3] * 1.3
                            }
                        },
                    },
                    itemStyle: !i? {
                            color: bgColor,
                            borderColor: '#628bb4',
                            borderWeight: 2,
                            shadowBlur: 8,
                            shadowColor: '#628bb4', 
                    } : { color: bgColor },
                    emphasis: {
                        itemStyle: {
                            color: bgColor,
                            borderColor: '#628bb4',
                            borderWeight: 2,
                            shadowBlur: 5,
                            shadowColor: '#628bb4', 
                        }
                    },
                    data: [[coords[i][0], coords[i][1], that.data[i].value, that.data[i].name]]
                })
            }
            return series
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                const size = getElementSize(that.$el)
                const rm = that.$store.state.windowSize.rm
                const option = {
                    series: that.getSeries(size)
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

<style lang="scss" scoped>
@media screen and (max-width: 1366px){
    .scatter {
        font-size: 12px;
        line-height: 14px;
        .rank-list{
            left: 10px;
        }
    }
}
@media screen and (min-width: 1367px){
    .scatter {
        font-size: 14px;
        line-height: 20px;
        .rank-list{
            left: 20px;
        }
    }
}
.scatter {
    width: 100%;
    height: 100%;
    .rank-list{
        position: absolute;
        top: 0;
        height: 100%;
        color: #1981c9;
        overflow: hidden;
        li {
            span {
                color: #1981c9;
                span {
                    color: #4db9ff;
                }
            }
            &:nth-child(1) {
                padding-top: 5px;
                >span {
                    span {
                        color:#4bd8b5;
                    }
                }
            }
            &:nth-child(2) {
                >span {
                    span {
                        color:#ff8080;
                    }
                }
            }
            &:nth-child(3) {
                >span {
                    span {
                        color:#ffd342;
                    }
                }
            }
        }
    }
}
</style>