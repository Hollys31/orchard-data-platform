<template>
    <div class="plant">
        <div class="wrap">
            <JsonMap :data="plantDistribute" title="种植分布情况" :top="158" @change="getData"/>
        </div>
        <div class="wrap">
            <Panel icon="./img/title/24.png" :title="region + '种植总体数据'" :download="false">
                <TotalData v-show="plantDistribute && numberOfOrchard && plantArea && numberOfPlant" :type="type" />
                <NoData v-show="!plantDistribute || !numberOfOrchard || !plantArea || !numberOfPlant" />
            </Panel>
            <Panel icon="./img/title/2.png" :title="region + agePanelTitle" :unit="fruiterAgeDistribute.unit">
                <Bar2 right="120" v-show="fruiterAgeDistribute.titles.length > 0" name="种植面积" :titles="fruiterAgeDistribute.titles" :values="fruiterAgeDistribute.values" :unit="fruiterAgeDistribute.unit" />
                <NoData v-show="fruiterAgeDistribute.titles.length === 0" />
            </Panel>
            <Panel icon="./img/title/26.png" :title="region + areaPanelTitle" :unit="breedAreaDistribute.unit">
                <Pie v-show="breedAreaDistribute.data.length > 0" title="面积比例" position="left" name="种植面积" :data="breedAreaDistribute.data" :unit="breedAreaDistribute.unit" />
                <NoData v-show="breedAreaDistribute.data.length === 0" />
            </Panel>
        </div>
        <div class="wrap">
            <Panel icon="./img/title/25.png" :title="region + rankPanelTitle" :unit="orchardAreaRank.unit">
                <Bar1 right="110" v-show="orchardAreaRank.titles.length > 0" name="种植面积" :titles="orchardAreaRank.titles" :values="orchardAreaRank.values" :unit="orchardAreaRank.unit" />
                <NoData v-show="orchardAreaRank.titles.length === 0" />
            </Panel>
            <Panel icon="./img/title/27.png" :title="region + qualityPanelTitle" :unit="plantQualityDistribute.unit">
                <Pie v-show="plantQualityDistribute.data.length > 0" title="品质占比" position="left" name="果园产品" :data="plantQualityDistribute.data" :unit="plantQualityDistribute.unit" />
                <NoData v-show="plantQualityDistribute.data.length === 0" />
            </Panel>
        </div>
    </div>
</template>

<script>
import JsonMap from '@/views/JsonMap'
import Bar1 from '@/components/charts/Bar1'
import Bar2 from '@/components/charts/Bar2'
import TotalData from './TotalData'
import Pie from '@/components/charts/Pie'
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.PLANT + '/'
export default {
    name: 'Plant',
    components: { JsonMap, Bar1, Bar2, TotalData, Pie, NoData },
    computed: {
        ...mapState ( nameSpaced , {
            plantDistribute: state => state.plantDistribute,
            numberOfOrchard: state => state.numberOfOrchard,
            plantArea: state => state.plantArea,
            numberOfPlant: state => state.numberOfPlant,
            fruiterAgeDistribute: state => state.fruiterAgeDistribute,
            breedAreaDistribute: state => state.breedAreaDistribute,
            orchardAreaRank: state => state.orchardAreaRank,
            plantQualityDistribute: state => state.plantQualityDistribute,
        })
    },
    data() {
        return {
            region: '', //当前数据所在的区域
            type: 0, //当前处在的行政级别
            agePanelTitle: '农作物树龄分布', //种植树龄面板标题
            areaPanelTitle: '主要作物品种面积分布', //种植面积面板标题
            rankPanelTitle : '果园种植面积情况', //种植面积排名面板标题
            qualityPanelTitle: '果园产品品质分布', //种植品质面板标题
        }
    },
    methods: {
        getData (data) {
            const that = this
            that.region = data.name
            that.type = data.type
            if(data.name === '全国') {
                data.name = ''
            }
            if(data.key) {
                that.agePanelTitle = data.key + '树龄分布'
                that.areaPanelTitle = data.key + '种植面积分布'
                that.rankPanelTitle = '果园' + data.key + '种植面积情况'
                that.qualityPanelTitle = data.key + '产品品质分布'
            }else {
                that.agePanelTitle = '农作物树龄分布'
                that.areaPanelTitle = '主要作物品种面积分布'
                that.rankPanelTitle = '果园种植面积情况'
                that.qualityPanelTitle = '果园产品品质分布'
            }
            that.$store.dispatch(nameSpaced + types.PLANT_GET_DATA, data)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/plant/plant.scss';
</style>