import actions from '@/store/actions/plantActions'
import mutations from '@/store/mutations/plantMutations'

export default {
    namespaced: true,
    state: {
        numberOfOrchard: 0, //果园数量
        plantArea: 0, //种植面积
        numberOfPlant: 0, //植株数量
        distributionOfProvinces: 0, //分布省份
        fruiterAgeDistribute: {titles: [], values: []}, //果树树龄分布
        breedAreaDistribute: {data:[]}, //品种面积分布
        orchardAreaRank: {titles: [], values: []}, //果园面积排名
        plantQualityDistribute: {data:[]}, //种植品质分布
        plantDistribute: [], //种植分布情况
    },
    actions,
    mutations
}