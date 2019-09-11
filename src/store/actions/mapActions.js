import types from '@/store/constants/types'
import api from '@/lib/api'
import echarts from '@/lib/echarts'
export default {
    [types.MAP_GET_JSON_FILE] (context, amount) { //获取地图json
        //amount: { map: '地图名称', file: '文件名称', api: 1 / 2 / 3 }
        //api: 1 => 全国； 2 => 省级； 3 => 市级
        const that = this
        let url = ''
        switch(amount.api) {
            case 1: url = api.getChinaMap
                break
            case 2: url = api.getProvinceMap
                break
            case 3: url = api.getCityMap
                break
            default: return
        }
        that.dispatch( 'ajax', url + amount.value + '.json').then((data) => {
            if(data) {
                echarts.registerMap(amount.name, data)
                context.commit( types.MAP_SET_REGION_NAME, amount.name )
            }
        })
    },
}