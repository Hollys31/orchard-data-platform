<template>
    <div class="bmap">
        <div class="panel-name">全国溯源分布</div>
        <Search tips="搜索品种" save="breed" @search="searchBreed" :options="$store.state.cropVariety"/>
        <div title="复位" class="restoration" @click="restoration"></div>
        <Panel class="china-map" :line="false" :download="false">
            <div class="map" ref="chart"></div>
        </Panel>
    </div>
</template>

<script>
import Search from '@/components/Search'
import echarts from '@/lib/echarts'
import MapStyleJson from './mapStyle'
require('echarts/extension/bmap/bmap')
const color = ['#f86464', '#02eeff', '#f3ac76']
export default {
    name: 'OriginBMap',
    components: { Search },
    props: ['data'],
    data() {
        return {
            bmap: null, //百度地图对象
            chart: null, //echart图表对象
            isInterval: false //是否在点击间隔之内 x毫秒内重复点击无效
        }
    },
    watch: {
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
            const count = that.data.length
            if(!count) {
                return
            }
            let max = 1
            that.data.map(item => {
                if(item[2] > max) {
                    max = item[2]
                }
            })
            const effectScatter = that.data.slice(0, 3)
            const symbolSize = 20/max
            const option = {
                series: [{
                    data: that.data,
                },{
                    data: effectScatter,
                    itemStyle: {
                        color: function(params) {
                            return params.dataIndex < 3 ? color[params.dataIndex] : '#A0B4C9'
                        },
                    },
                    symbolSize (value) {
                        let size = value[2] * symbolSize
                        if(size < 12) {
                            size = 12
                        }
                        return size
                    },
                }]
            }
            that.chart.setOption(option)
        },
        init () {   //实例化图表
            const that = this
            const size = that.getChartSize()
            if(!that.chart) {
                that.chart = echarts.init(that.$refs.chart,false,{width: size.width, height: size.height})
            }
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: function(data) {
                        //name , value, percent, seriesName
                        let str = '<div style="background-color:rgba(2, 238, 255, 0.5);border-radius: 4px;"><div style="padding:5px 10px;">' + data.value[3] + '：' + data.value[2] + '次</div></div>'
                        //console.log(data)
                        return str
                    },
                    backgroundColor: 'rgba(0, 168, 255, 0)',
                    textStyle: {
                        fontSize: 14
                    },
                    confine: true,
                },
                bmap: {
                    center: [103.9462765501, 31.3474989219],
                    zoom: 5,
                    roam: true,
                    mapStyle: {
                        styleJson: MapStyleJson
                    }
                },
                series: [{
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    showEffectOn: 'render',
                    rippleEffect: { brushType: 'stroke' },
                    hoverAnimation: true,
                    symbolSize: 12,
                    itemStyle: {
                        color: '#02eeff',
                        shadowBlur: 5,
                        shadowColor: '#333'
                    },
                    zlevel: 1
                },{
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    showEffectOn: 'render',
                    rippleEffect: { brushType: 'stroke' },
                    hoverAnimation: true,
                    label: {
                        formatter (data) {
                            return data.value[3]
                        },
                        position: 'right',
                        show: true
                    },
                    itemStyle: {
                        shadowBlur: 5,
                        shadowColor: '#333'
                    },
                    zlevel: 1
                }]
            }
            that.chart.setOption(option)
            that.bmap = that.chart.getModel().getComponent('bmap').getBMap();
            /*
            that.chart.on('click', function(params) { 
                if(!that.isInterval) {
                    that.isInterval = true
                    console.log(params)
                    that.eventHand(params)
                    setTimeout(function() {
                        that.isInterval = false
                    }, 1000)
                }
            })
            */
            //bmap.addControl( new BMap.MapTypeControl( { mapTypes: [ BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP ] } ) ); //普通地图、卫星地图切换控件
            /**
             * 在node_modules\echarts\extension\bmap\BMapCoordSys.js
             * 中var bmap = bmapModel.__bmap = new BMap.Map(bmapRoot);
             * 修改为var bmap = bmapModel.__bmap = new BMap.Map(bmapRoot, {mapType: BMAP_SATELLITE_MAP});
             * 默认卫星地图
             */
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                const size = that.getChartSize()
                that.chart.resize({width: size.width, height: size.height})
            }else {
                that.init()
            }
        },
        restoration () { //地图复位
            const that = this
            if(that.bmap) {
                that.bmap.zoomIn()
                that.bmap.reset()
            }
        },
        getChartSize () { //获取canvas父元素的宽高
            const that = this
            const chart = that.$el.parentNode
            const chartStyle = chart.getBoundingClientRect()
            return {height: chartStyle.height, width: chartStyle.width}
        },
        searchBreed (key) { //搜索
            const that = this
            that.$emit('change', {name: '全国', key: key, type: 0})
        },
    },
    beforeDestroy () {
        const that = this
        that.bmap = null
        if(that.chart){
            that.chart.dispose()
            that.chart = null
        }
    },
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px){
    .bmap {
        .panel-name {
            top: 10px;
            left: 10px;
            font-size: 18px;
            line-height: 18px;
        }
        .search {
            top: 40px;
            left: 10px;
        }
        .restoration {
            top: 35px;
            right: 10px;
        }
    }
}
@media screen and (min-width: 1367px){
    .bmap {
        .panel-name {
            top: 20px;
            left: 20px;
            font-size: 24px;
            line-height: 24px;
        }
        .search {
            top: 60px;
            left: 20px;
        }
        .restoration {
            top: 55px;
            right: 20px;
        }
    }
}
.bmap {
    position: relative;
    height: 100%;
    width: 100%;
    .panel-name {
        position: absolute;
        z-index: 1;
        user-select: none;
        letter-spacing: 2px;
    }
    .restoration {
        position: absolute;
        width: 35px;
        height: 35px;
        background-color: rgba(75, 82, 94, 0.65); 
        background-image: url('../../assets/images/icons/43.png');
        background-repeat: no-repeat;
        background-position: center;
        //box-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
        cursor: pointer;
        border-radius: 50%;
        z-index: 2;
        &:active {
            //box-shadow: none;
            background-image: url('../../assets/images/icons/44.png');
        }
    }
    .map {
        height: 100%;
        width: 100%;
        border-radius: 8px;
        overflow: hidden;
        .ec-extension-bmap {
            border-radius: 8px;
            overflow: hidden !important;
        }
    }
}
</style>
