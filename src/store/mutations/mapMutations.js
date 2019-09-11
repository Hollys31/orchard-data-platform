import types from '@/store/constants/types'
import { formatTime } from '@/lib/util'
export default {
    //设置当前地理级别
    [types.MAP_SET_POST_DATA] (state, payload) {
        if(payload.type != 'undefined' || payload.gardenId || payload.page) {
            const date = formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss')
            payload.time = date
            state.postData = payload
        }
    },

    //设置当前选择的区域名称
    [types.MAP_SET_REGION_NAME] (state, payload) {
        state.region = payload
    },
}
