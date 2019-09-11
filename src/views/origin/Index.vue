<template>
    <div class="origin">
        <div class="wrap">
            <!--溯源动态地图-->
            <BMap :data="originDistribute" @change="getData"/>
        </div>
        <div class="wrap">
            <Panel icon="./img/title/1.png" :title="region + '全国作物主要溯源排行'" unit="次数">
                <!--溯源地区排行图表-->
                
                <Scatter1 v-show="originRank.data.length > 0" :data="originRank.data" /> 
                <NoData v-show="originRank.data.length === 0" />
            </Panel>
            <Panel icon="./img/title/22.png" title="溯源次数统计" unit="次数">
                <!--溯源次数统计图表-->
                <LineChart v-show="originFrequency.values.length > 0"  name="溯源次数" :titles="originFrequency.titles" :values="originFrequency.values" :unit="originFrequency.unit" />
                <NoData v-show="originFrequency.values.length === 0" />
            </Panel>
            <!--溯源地址图表-->
            <AddressList />
        </div>
    </div>
</template>

<script>
import BMap from '@/views/origin/BMap'
import LineChart from '@/components/charts/Line'
import AddressList from '@/views/origin/AddressList'
import NoData from '@/components/NoData'
import Scatter1 from '@/components/charts/Scatter1'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.ORIGIN + '/'
export default {
    name: 'OriginData',
    components: { BMap, LineChart, AddressList, NoData, Scatter1 },
    computed: {
        ...mapState ( nameSpaced , {
            originDistribute: state => state.originDistribute,
            originRank: state => state.originRank,
            originFrequency: state => state.originFrequency,
            originAddress: state => state.originAddress,
        })
    },
    data() {
        return {
            region: '', //当前数据所在的区域
        }
    },
    created() {
        const that = this
        that.getData({})
    },
    methods: {
        getData (data) {
            const that = this
            that.$store.dispatch(nameSpaced + types.ORIGIN_GET_DATA, data)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/origin/origin.scss';
</style>