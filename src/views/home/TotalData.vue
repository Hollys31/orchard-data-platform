<template>
    <div class="total-data">
        <div class="total-list">
            <div><span>分布{{type? (type === 1? '市区' : '市区') : '省份'}}<br><span>{{distributionOfProvinces}}<span>&nbsp;个</span></span></span></div>
            <div><span>作物种数<br><span>{{numberOfPlant}}<span>&nbsp;种</span></span></span></div>
            <div><span>果园数量<br><span>{{numberOfOrchard}}<span>&nbsp;个</span></span></span></div>
            <div><span>占地面积<br><span>{{plantArea > 10000 ? (plantArea/1000).toFixed(2) : plantArea}}<span>&nbsp;{{plantArea > 10000 ? '千亩' : '亩'}}</span></span></span></div>
        </div>
        <span class="corner">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
        </span>
    </div>
</template>

<script>
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.HOME + '/'
export default {
    name: 'TotalData',
    props: ['region', 'type'],
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
@import '../../style/views/home/total-data.scss';
</style>
