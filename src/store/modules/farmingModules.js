import actions from '@/store/actions/farmingActions'
import mutations from '@/store/mutations/farmingMutations'

export default {
    namespaced: true,
    state: {
        autoFertDose: {data: []}, //智能水肥剂量数据
        autoFertMonth: {titles: [], values: [], names: []}, //月智能水肥剂量数据
        pickDose: {data: []}, //采摘数据
        pickMonth: {titles: [], values: [], names: []}, //月采摘数据
        pestDose: {data: []}, //农药剂量数据
        pestMonth: {titles: [], values: [], names: []}, //月农药剂量数据
        plantDistribute: [], //种植分布情况
    },
    actions,
    mutations
}