import actions from '@/store/actions/mapActions'
import mutations from '@/store/mutations/mapMutations'

export default {
    namespaced: true,
    state: {
        postData: {},
        region: '', //当前选择的地区
        nationwidePlantDistribute: [], //种植分布情况
        provincePlantDistribute: [], //省级种植分布情况
        cityPlantDistribute: [], //市级种植分布情况
    },
    actions,
    mutations
}