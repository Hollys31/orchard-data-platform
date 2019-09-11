import types from '@/store/constants/types'
export default {
    //设置种植分布情况数据
    [types.HOME_SET_PLANT_DISTRIBUTE] (state, payload) {
        state.plantDistribute = payload
    },
    //设置总体数据
    [types.HOME_SET_TOTAL_DATA] (state, payload) {
        state.numberOfOrchard = payload.numberOfOrchard
        state.plantArea = payload.plantArea
        state.numberOfPlant = payload.numberOfPlant
        state.distributionOfProvinces = payload.distributionOfProvinces
    },
    //设置库存比较数据
    [types.HOME_SET_INVENTORY_CONTRAST] (state, payload) {
        state.inventoryContrast = payload
    },
    //设置采摘排行数据
    [types.HOME_SET_PICK_RANK] (state, payload) {
        state.pickRank = payload
        this.state.cropVariety = payload.titles
    },
    //设置溯源区域数据
    [types.HOME_SET_ORIGIN_REGION] (state, payload) {
        state.originRegion = payload
    },
    //设置设备占比数据
    [types.HOME_SET_DEVICE_RATIO] (state, payload) {
        state.deviceRatio = payload
    },
    //设置施肥用量统计数据
    [types.HOME_SET_FERT_QUANTITY] (state, payload) {
        state.fertQuantity = payload
    },
    //设置种植作物出库入库总量数据
    [types.HOME_SET_OUTBOUND_INVENTORY] (state, payload) {
        state.outboundInventory = payload
    },
}
