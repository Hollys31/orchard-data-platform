import types from '@/store/constants/types'
export default {
    //设置农事活动页面数据
    [types.FARMING_GET_DATA] (state, payload) {
        state.plantDistribute = payload.plantDistribute
        state.autoFertDose = payload.autoFertDose
        state.autoFertMonth = payload.autoFertMonth
        state.pickDose = payload.pickDose
        state.pickMonth = payload.pickMonth
        state.pestDose = payload.pestDose
        state.pestMonth = payload.pestMonth
    }
}