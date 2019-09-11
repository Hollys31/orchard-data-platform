<template>
    <div class="total-data">
        <div><i class="provinces"></i>分布{{type? (type === 1? '市区' : '市区') : '省份'}}<br><span>{{distributionOfProvinces}}</span> 个</div>
        <div><i class="number"></i>作物种数<br><span>{{numberOfPlant}}</span> 种</div>
        <div><i class="orchard"></i>果园数量<br><span>{{numberOfOrchard}}</span> 个</div>
        <div><i class="area"></i>占地面积<br><span>{{plantArea > 10000 ? (plantArea/1000).toFixed(2) : plantArea}}</span> {{plantArea > 10000 ? '千亩' : '亩'}}</div>
    </div>
</template>

<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.PLANT + '/'
export default {
    name: 'TotalData',
    props: [ 'type' ],
    computed: {
        ...mapState ( nameSpaced , {
            numberOfOrchard: state => state.numberOfOrchard,
            plantArea: state => state.plantArea,
            numberOfPlant: state => state.numberOfPlant,
            distributionOfProvinces: state => state.distributionOfProvinces,
        })
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/plant/total-data.scss';
</style>
