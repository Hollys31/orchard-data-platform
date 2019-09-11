import types from '@/store/constants/types'
export default {
    //设置出库入库页面数据
    [types.WAREHOUSE_GET_DATA] (state, payload) {
        state.plantDistribute = payload.plantDistribute
        state.dayInfo = payload.dayInfo
        state.inYear = payload.inYear
        state.outYear = payload.outYear
        state.inHistory = payload.inHistory
        state.outHistory = payload.outHistory
    },
}