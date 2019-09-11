import types from '@/store/constants/types'
export default {
    //设置种植分布页面数据
    [types.PLANT_GET_DATA] (state, payload) {
        state.plantDistribute = payload.plantDistribute
        state.numberOfOrchard = payload.numberOfOrchard
        state.plantArea = payload.plantArea
        state.numberOfPlant = payload.numberOfPlant
        state.distributionOfProvinces = payload.distributionOfProvinces
        state.fruiterAgeDistribute = payload.fruiterAgeDistribute
        state.breedAreaDistribute = payload.breedAreaDistribute
        state.orchardAreaRank = payload.orchardAreaRank
        state.plantQualityDistribute = payload.plantQualityDistribute
    }
}