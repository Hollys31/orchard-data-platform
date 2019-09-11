<template>
    <div class="farming">
        <div class="wrap">
            <!--地图-->
            <JsonMap :data="plantDistribute" @change="getData" :top="158" title="作物分布情况"/>
        </div>
        <div class="wrap">
            <Panel icon="./img/title/10.png" :title="region + '果园施肥情况'" :unit="autoFertDose.unit">
                <div class="chart-wrap">
                    <div class="chart">
                        <Pie v-show="autoFertDose.data.length > 0" position="left" name="施肥总量" :data="autoFertDose.data" :unit="autoFertDose.unit" orient="horizontal" />
                        <NoData v-show="autoFertDose.data.length === 0" />
                    </div>
                    <div class="chart">
                        <Line2Chart v-show="autoFertMonth.values.length > 0" :titles="autoFertMonth.titles" :values="autoFertMonth.values" :unit="autoFertMonth.unit" :names="autoFertMonth.names"/>
                        <NoData v-show="autoFertMonth.values.length === 0" />
                    </div>
                </div>
            </Panel>
            <Panel icon="./img/title/11.png" :title="region + pickPanelTitle" :unit="pickDose.unit">
                <div class="chart-wrap">
                    <div class="chart">
                        <Pie v-show="pickDose.data.length > 0" position="left" name="采摘总量" :data="pickDose.data" :unit="pickDose.unit" orient="horizontal" />
                        <NoData v-show="pickDose.data.length === 0" />
                    </div>
                    <div class="chart">
                        <Line2Chart v-show="pickMonth.values.length > 0" :titles="pickMonth.titles" :values="pickMonth.values" :unit="pickMonth.unit" :names="pickMonth.names" />
                        <NoData v-show="pickMonth.values.length === 0" />
                    </div>
                </div>
            </Panel>
            <Panel icon="./img/title/16.png" :title="region + '其它农事情况'" unit="次数">
                <div class="chart-wrap">
                    <div class="chart">
                        <Pie v-show="pestDose.data.length > 0" position="left" name="农事次数" :data="pestDose.data" :unit="pestDose.unit" orient="horizontal" />
                        <NoData v-show="pestDose.data.length === 0" />
                    </div>
                    <div class="chart">
                        <Line2Chart v-show="pestMonth.values.length > 0" :titles="pestMonth.titles" :values="pestMonth.values" :unit="pestMonth.unit" :names="pestMonth.names"/>
                        <NoData v-show="pestMonth.values.length === 0" />
                    </div>
                </div>
            </Panel>
        </div>
    </div>
</template>

<script>
import JsonMap from '@/views/JsonMap'
import Line2Chart from '@/components/charts/Line2'
import Pie from '@/components/charts/Pie'
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.FARMING + '/'
export default {
    name: 'Farming',
    components: { JsonMap, Line2Chart, Pie, NoData },
    computed: {
        ...mapState ( nameSpaced , {
            plantDistribute: state => state.plantDistribute,
            autoFertDose: state => state.autoFertDose,
            autoFertMonth: state => state.autoFertMonth,
            pickDose: state => state.pickDose,
            pickMonth: state => state.pickMonth,
            pestDose: state => state.pestDose,
            pestMonth: state => state.pestMonth,
        })
    },
    data() {
        return {
            region: '', //当前数据所在的区域
            pickPanelTitle: '果园每月采摘情况',
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
                that.pickPanelTitle = data.key + '每月采摘情况'
            }else {
                that.pickPanelTitle = '果园每月采摘情况'
            }
            that.$store.dispatch(nameSpaced + types.FARMING_GET_DATA, data)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/farming.scss';
</style>
