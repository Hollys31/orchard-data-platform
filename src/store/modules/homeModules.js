import actions from '@/store/actions/homeActions'
import mutations from '@/store/mutations/homeMutations'

export default {
    namespaced: true,
    state: {
        numberOfOrchard: 0, //果园数量
        plantArea: 0, //种植面积
        numberOfPlant: 0, //植株数量
        distributionOfProvinces: 0, //分布省份
        inventoryContrast: { data: [] }, //库存比较
        pickRank: {  data: []  }, //采摘排行
        originRegion: {data:[]}, //溯源区域
        deviceRatio: { data:[] }, //设备占比
        fertQuantity: { titles: [], values: [], names: []}, //施肥用量
        outboundInventory: {titles: [], values: [], names: []},//出库入库数据
        plantDistribute: [], //种植分布情况
    },
    actions,
    mutations
}