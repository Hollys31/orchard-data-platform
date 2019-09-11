import actions from '@/store/actions/warehouseActions'
import mutations from '@/store/mutations/warehouseMutations'

export default {
    namespaced: true,
    state: {
        dayInfo: {}, //今日入库数据
        inYear: {titles: [], values: []}, //今年入库数据
        outYear: {titles: [], values: []}, //今年出库数据
        inHistory: {titles: [], values: [[] ]}, //历史入库数据
        outHistory: {titles: [], values: [[] ]}, //历史出库数据
        plantDistribute: [], //种植分布情况
    },
    actions,
    mutations
}