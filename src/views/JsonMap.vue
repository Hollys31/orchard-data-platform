<template>
    <div class="json-map">
        <Search v-if="searchBar" tips="搜索品种" save="breed" :options="$store.state.cropVariety" @search="searchBreed" />
        <div class="region-name">
            <span  @click="changeRegion('全国')">全国</span>
            <i v-show="provincesName"></i>
            <span v-show="provincesName" @click="changeRegion(provincesName)">{{panelTitle}}</span>
            <i v-show="cityName"></i>
            <span v-show="cityName" >{{cityName}}</span>
            {{title}}
        </div>
        <div  v-show="provincesName" title="点击返回上一级" class="restoration iconfont" @click="cityName? changeRegion(provincesName) : changeRegion('全国')">&#xe602;</div>
        <div ref="bgChart" class="bg-chart" :style="top === 158 ? 'height:calc(100% - 158px);padding: 79px 0' : $store.state.currRouter.to === 'home' ? 'height:calc(100% - 100px);padding: 50px 0' : ''"></div>
        <div ref="borderChart" class="border-chart" :style="top === 158 ? 'height:calc(100% - 158px);padding: 79px 0' : $store.state.currRouter.to === 'home' ? 'height:calc(100% - 100px);padding: 50px 0' : ''"></div>
        <div ref="chart" class="chart-cont" :style="top === 158 ? 'height:calc(100% - 158px);padding: 79px 0' : $store.state.currRouter.to === 'home' ? 'height:calc(100% - 100px);padding: 50px 0' : ''"></div>
    </div>
</template>
<script type='text/javascript'>
/**
 * 中国地图组件
 * 事件 “change” 返回地区名称
 */
import Search from '@/components/Search'
import echarts from '@/lib/echarts'
import china from '@/lib/china.json'
import provinces from '@/lib/provinces'
import city from '@/lib/city'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
import { getElementSize } from '@/lib/util'
const nameSpaced = ns.MAP + '/'
if(!echarts.getMap('全国')) {
    echarts.registerMap('全国', china)
}
export default {
    name: 'JsonMap',
    props: {
        data: {type: Array, default: () => {return []}},
        title: {type: String, default: ''},
        searchBar: {type: Boolean, default: true},
        top: {type: Number, default: 0},
    },
    components: { Search },
    data() {
        return {
            chart: null, //echart图表对象
            bgChart: null, //地图背景
            borderChart: null, //地图边框
            provincesName: '', //当前选择的省份，地图上名称
            cityName: '', //当前选择的市，地图上名称
            countyName: '', //当前选择的县，地图上名称
            panelTitle: '',
            size: null, //地图容器大小
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            region: state => state.region,
        })
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.reDraw()
        },
        'top' () {
            this.reDraw()
        },
        'region' () {
            const that = this
            if(echarts.getMap(that.region)) {
                that.renderMap(that.region)
            }
        },
        'data' () {
            const that = this
            if(that.chart) {
                that.chart.clear()
                that.bgChart.clear()
                that.renderMap(that.region)
            }
        }
    },
    mounted() {
        const that = this
        that.init()
    },
    methods: {
        init () {
            const that = this
            that.size = getElementSize(that.$refs.chart, 'json-map')
            if(that.top) {
                that.size.height -= that.top
            }
            that.bgChart = echarts.init( that.$refs.bgChart, false, that.size )
            that.borderChart = echarts.init( that.$refs.borderChart, false, that.size )
            that.chart = echarts.init( that.$refs.chart, false, that.size )
            that.changeRegion('江西')
            that.chart.on('click', function (params) { that.changeRegion(params.name) })
        },
        changeRegion (name) {
            const that = this
            let amount = {name: name, value: 'china', api: 1} //获取地图json所需的参数
            if( name === '全国' ){ //全国
                that.provincesName = ''
                that.cityName = ''
                that.countyName = ''
                that.panelTitle = '全国' + that.title
                const postData = {name: name, key: '', type: 0}
                //that.$store.commit( nameSpaced + types.MAP_SET_POST_DATA, postData )
                that.$emit('change', postData)
            }else if( name in provinces ) { //省级
                const options = {
                    geo: {
                        regions: []
                    },
                }
                that.chart.setOption(options)
                amount.value = provinces[name].file
                amount.api = 2
                that.cityName = ''
                that.countyName = ''
                that.provincesName = name
                that.panelTitle = provinces[that.provincesName]['name']
                const postData = {name: that.panelTitle, key: '', type: 1}
                //that.$store.commit( nameSpaced + types.MAP_SET_POST_DATA, postData )
                that.$emit('change', postData)
            }else if( name in city ) { //市级
                if(name === that.cityName) { //第二次点击返回上一级
                    that.changeRegion(that.provincesName)
                    return
                }else {
                    amount.value = city[name]
                    amount.api = 3
                    that.countyName = ''
                    that.cityName = name
                    that.panelTitle = provinces[that.provincesName]['name']
                    const postData = {name: name, key: '', type: 2, prov: that.panelTitle}
                    //that.$store.commit( nameSpaced + types.MAP_SET_POST_DATA, postData )
                    that.$emit('change', postData)
                    //选中状态
                    const option = {
                        geo: {
                            regions: [{
                                name: name,
                                itemStyle: {
                                    areaColor: '#279bdc',
                                    borderColor: '#fff'
                                }
                            }]
                        },
                    }
                    that.chart.setOption(option)
                    return
                }
            }else if(that.cityName != '') { //县级
                that.countyName = name
                that.panelTitle = provinces[that.provincesName]['name']
                return
            }else {
                return
            }
            if(echarts.getMap(name)) { //是否已注册该地图
                if(name != that.region) {
                    that.$store.commit( nameSpaced + types.MAP_SET_REGION_NAME, name )
                }
            }else {
                that.$store.dispatch(nameSpaced + types.MAP_GET_JSON_FILE, amount)
            }
        },
        renderMap (map) {
            const that = this
            if(!map) { return }
            const size = provinces[map].size? that.size.width - provinces[map].space : that.size.height - provinces[map].space
            const options = {
                animation: false,
                tooltip: {
                    trigger: 'item',
                    formatter: function(data) {
                        //name , value, percent, seriesName
                        let str = '<div style="background-color:#32C5E9;border-radius: 4px;"><div style="padding:5px 10px;">' + data.value[3] + '：' + data.value[2] + '亩</div></div>'
                        //console.log(data)
                        return str
                    },
                    backgroundColor: 'rgba(0, 168, 255, 0)',
                    textStyle: {
                        fontSize: 14
                    },
                    position: 'top',
                    confine: true,
                },
                geo: {
                    map: map,
                    layoutCenter: provinces[map].center,
                    layoutSize: size,
                    label: {
                        show: true,
                        color: '#fff',
                    },
                    itemStyle: {
                            areaColor: '#0b4587',
                            borderColor: '#03bbe2',
                            borderWidth: 2,
                    },
                    emphasis: {
                        label: {
                            show: true,
                            color: '#fff',
                        },
                        itemStyle: {
                            areaColor: '#279bdc',
                            borderColor: '#ffffff',
                            borderWidth: 2,
                            shadowColor: 'rgba(12, 138, 188, 1)',
                            shadowBlur: 2
                        },
                    },
                    regions: that.cityName ? [{
                        name: that.cityName,
                        itemStyle: {
                            areaColor: '#279bdc',
                            borderColor: '#fff'
                        }
                    }] : []
                },
                series: that.data.length > 0 ? that.getSeries(map) : []
            }
            const bgOptions = {
                animation: false,
                geo: {
                    map: map,
                    layoutCenter: provinces[map].center,
                    layoutSize: size,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        areaColor: '#2d607b',
                        borderWidth: 0,
                        //borderColor: '#00f0fb',
                        //shadowColor: '#1773c3',
                        //shadowBlur: 15
                    }
                },
            }
            const borderOption = {
                animation: false,
                geo: {
                    map: map,
                    layoutCenter: provinces[map].center,
                    layoutSize: size,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        areaColor: '#0b4587',
                        borderColor: '#03bbe2',
                        borderWidth: 2,
                        shadowColor: '#03bbe2',
                        shadowBlur: 5
                    }
                },
            }
            that.bgChart.setOption(bgOptions)
            that.borderChart.setOption(borderOption)
            that.chart.setOption(options)
        },
        getSeries (map) {
            const that = this
            /*
            let max = 0
            that.data.map(item => {
                if(item[2] > max) {
                    max = item[2]
                }
            })
            const symbolSize = 50/max
            */
            let series = [
                {
                    name: '分布',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: that.data,
                    symbolSize: 10,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        formatter (data) {
                            return data.value[3]
                        },
                        position: 'right',
                        show: false
                    },
                    itemStyle: {
                        normal: {
                            color: '#6cebfc',
                            shadowBlur: 5,
                            shadowColor: '#333'
                        }
                    },
                },
                {
                    name: '定位',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: that.data,
                    symbol: 'pin',
                    symbolSize (value) {
                        let size = 0
                        let n = value[2]
                        if(n > 100000) {
                            size = 80
                        }else if(n > 10000) {
                            size = 70
                        }else if(n > 1000) {
                            size = 60
                        }else if(n > 100) {
                            size = 50
                        }else if(n > 10) {
                            size = 40
                        }else {
                            size = 30
                        }
                        return size
                    },
                    hoverAnimation: false,
                    label: { 
                        formatter (data) {
                            return data.value[2]
                        },
                        align: 'center',
                        color: '#fff',
                        show: true
                    },
                    itemStyle: { 
                        color: '#ff5300',
                    },
                    emphasis: {
                        itemStyle: { 
                            color: '#6cebfc'
                        },
                    },
                    zlevel: 1
                },
            ]
            return series
        },
        reDraw () { //重绘图表
            const that = this
            if(that.chart) {
                that.size = getElementSize(that.$refs.chart, 'json-map')
                if(that.top) {
                    that.size.height -= that.top
                }
                const size = provinces[that.region].size? that.size.width - provinces[that.region].space : that.size.height - provinces[that.region].space
                const options = {
                    geo: {
                        layoutSize: size,
                    },
                }
                that.bgChart.setOption(options)
                that.borderChart.setOption(options)
                that.chart.setOption(options)
                that.chart.resize(that.size)
                that.borderChart.resize(that.size)
                that.bgChart.resize(that.size)
            }else {
                that.init()
            }
        },
        searchBreed (key) { //搜索
            const that = this
            if(that.cityName) {
                that.$emit('change', {name: that.cityName, prov: provinces[that.provincesName]['name'], key: key, type: 2})
            }else if(that.provincesName) {
                that.$emit('change', {name: provinces[that.provincesName]['name'], key: key, type: 1})
            }else {
                that.$emit('change', {name: '全国', key: key, type: 0})
            }
        },
    },
    beforeDestroy () {
        const that = this
        if(that.chart){
            that.chart.dispose()
            that.bgChart.dispose()
            that.borderChart.dispose()
        }
    },
}
</script>
<style lang='scss' scoped>
@import '../style/views/json-map.scss';
</style>