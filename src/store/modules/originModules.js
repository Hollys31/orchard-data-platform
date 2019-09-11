import actions from '@/store/actions/originActions'
import mutations from '@/store/mutations/originMutations'

export default {
    namespaced: true,
    state: {
        originDistribute: [], //溯源分布数据
        originRank: {data:[]}, //溯源城市排行数据
        originFrequency: {titles: [], values: []}, //溯源次数数据
        originAddress: [], //溯源地址数据
        maxPageNum: 1, //溯源地址最大分页数
    },
    actions,
    mutations
}