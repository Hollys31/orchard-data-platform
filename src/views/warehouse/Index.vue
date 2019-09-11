<template>
    <div class="warehouse">
        <div class="wrap">
            <!--地图-->
            <JsonMap :data="plantDistribute" @change="getData" title="作物分布情况" :top="158" :options="$store.state.cropVariety"/>
        </div>
        <div class="wrap">
            <Panel icon="./img/title/17.png" :title="region + DayPanelTitle" :unit="dayInfo.unit">
                <!--今日入库信息图表-->
                <Gauges v-show="dayInfo.inDay || dayInfo.outDay || dayInfo.surplus || inYear.values.length || outYear.values.length" :data="dayInfo" />
                <NoData v-show="!dayInfo.inDay && !dayInfo.outDay && !dayInfo.surplus && !inYear.values.length && !outYear.values.length" />
            </Panel>
            <Panel icon="./img/title/18.png" :title="region + inYearPanelTitle" :unit="inYear.unit">
                <!--今年入库信息图表-->
                <Line1 v-show="inYear.values.length > 0" name="入库量" :titles="inYear.titles" :values="inYear.values" :unit="inYear.unit"  />
                <NoData v-show="!inYear.values.length" />
            </Panel>
            <Panel icon="./img/title/19.png" :title="region + outYearPanelTitle" :unit="outYear.unit">
                <!--今年出库信息图表-->
                <Line1 v-show="outYear.values.length"  name="出库量" :titles="outYear.titles" :values="outYear.values" :unit="outYear.unit"  />
                <NoData v-show="!outYear.values.length" />
            </Panel>
            <Panel icon="./img/title/20.png" :title="region + inHistoryPanelTitle" :unit="inHistory.unit">
                <!--历史入库对比图表-->
                <Line1 v-show="inYear.values.length"  name="入库量" :titles="inHistory.titles" :values="inHistory.values" :unit="inHistory.unit" :names="inHistory.names" />
                <NoData v-show="!inYear.values.length" />
            </Panel>
            <Panel icon="./img/title/21.png" :title="region + outHistoryPanelTitle" :unit="outHistory.unit">
                <!--历史出库对比图表-->
                <Line1 v-show="outYear.values.length"  name="出库量" :titles="outHistory.titles" :values="outHistory.values" :unit="outHistory.unit" :names="outHistory.names" />
                <NoData v-show="!outYear.values.length" />
            </Panel>
        </div>
    </div>
</template>

<script>
import JsonMap from '@/views/JsonMap'
import Line1 from '@/components/charts/Line1'
import Gauges from './Gauges'
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.WAREHOUSE + '/'
export default {
    name: 'Warehouse',
    components: { JsonMap, Line1, Gauges, NoData },
    computed: {
        ...mapState ( nameSpaced , {
            plantDistribute: state => state.plantDistribute,
            dayInfo: state => state.dayInfo,
            inYear: state => state.inYear,
            outYear: state => state.outYear,
            inHistory: state => state.inHistory,
            outHistory: state => state.outHistory,
        })
    },
    data() {
        return {
            region: '', //当前数据所在的区域
            DayPanelTitle: '种植作物今日出入库信息',
            inYearPanelTitle: '种植作物今年入库信息',
            outYearPanelTitle: '种植作物今年出库信息',
            inHistoryPanelTitle: '种植作物历史入库对比',
            outHistoryPanelTitle: '种植作物历史出库对比',
        }
    },
    methods: {
        getData (data) {
            const that = this
            that.region = data.name
            if(data.name === '全国') {
                data.name = ''
            }
            if(data.key){
                that.DayPanelTitle = data.key + '今日出入库信息'
                that.inYearPanelTitle = data.key + '今年入库信息'
                that.outYearPanelTitle = data.key + '今年出库信息'
                that.inHistoryPanelTitle = data.key + '历史入库对比'
                that.outHistoryPanelTitle = data.key + '历史出库对比'
            }else {
                that.DayPanelTitle = '种植作物今日出入库信息'
                that.inYearPanelTitle = '种植作物今年入库信息'
                that.outYearPanelTitle = '种植作物今年出库信息'
                that.inHistoryPanelTitle = '种植作物历史入库对比'
                that.outHistoryPanelTitle = '种植作物历史出库对比'
            }
            that.$store.dispatch(nameSpaced + types.WAREHOUSE_GET_DATA, data)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/warehouse.scss';
</style>
