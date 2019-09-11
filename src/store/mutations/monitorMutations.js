import types from '@/store/constants/types'
export default {
    //设置果园列表
    [types.MONITOR_SET_ORCHARD_LIST] (state, payload) {
        state.orchardList = payload
    },
    //设置当前选择果园的果园信息
    [types.MONITOR_SET_ORCHARD_INFO] (state, payload) {
        state.orchardInfo = payload
    },
    //设置当前选择果园地块的设备数据
    [types.MONITOR_SET_DEVICE_DATA] (state, payload) {
        if(payload.device === 'fm1') {
            state.deviceData.fm1[payload.index] = payload.data
        }else if(payload.device === 'fm2') {
            state.deviceData.fm2[payload.index] = payload.data
        }else if(payload.device === 'waf') {
            state.deviceData.waf[payload.index] = payload.data
        }
    },
    //设置当前选择地块的设备列表
    [types.MONITOR_SET_DEVICE_LIST] (state, payload) {
        state.fm1List = payload.fm1List
        state.fm2List = payload.fm2List
        state.wafList = payload.wafList
        state.cameraList = payload.cameraList
    },
    //设置当前地块的环境信息
    [types.MONITOR_SET_ENVIRONMENT_INFO] (state, payload) {
        state.windSpeedDay = payload.windSpeedDay
        state.rainfallDay = payload.rainfallDay
        state.soilHumidityDay = payload.soilHumidityDay
        state.airHumidityDay = payload.airHumidityDay
        state.airTempDay = payload.airTempDay
        state.soilTempDay = payload.soilTempDay
        state.lightIntensityDay = payload.lightIntensityDay
        state.airIntensityDay = payload.airIntensityDay
        state.soilECDay = payload.soilECDay
        state.fertFlowDay = payload.fertFlowDay
        state.waterFlowDay = payload.waterFlowDay
        state.soilPHDay = payload.soilPHDay
        state.windSpeedWeek = payload.windSpeedWeek
        state.rainfallWeek = payload.rainfallWeek
        state.soilHumidityWeek = payload.soilHumidityWeek
        state.airHumidityWeek = payload.airHumidityWeek
        state.airTempWeek = payload.airTempWeek
        state.soilTempWeek = payload.soilTempWeek
        state.lightIntensityWeek = payload.lightIntensityWeek
        state.airIntensityWeek = payload.airIntensityWeek
        state.soilECWeek = payload.soilECWeek
        state.fertFlowWeek = payload.fertFlowWeek
        state.waterFlowWeek = payload.waterFlowWeek
        state.soilPHWeek = payload.soilPHWeek
        state.environmentData = payload.environmentData
        state.environmentUpDate = payload.environmentUpDate
        state.lineData = state[state.lineDataName]
    },
    //设置农事活动信息
    [types.MONITOR_SET_FARMING_INFO] (state, payload) {
        state.farmingActivities = payload
    },
    //设置果树种植面积
    [types.MONITOR_SET_PLANT_AREA] (state, payload) {
        state.plantArea = payload
    },
    //设置折线图数据
    [types.MONITOR_SET_LINE_DATA] (state, payload) {
        state.lineData = state[payload]
        if(!state.lineData.values) {
            state.lineData.values = []
        }
        state.lineDataName = payload
    },
    //设置时刻或七天数据
    [types.MONITOR_SET_DAY_WEEK] (state, payload) {
        state.isWeek = payload
    },
    //设置当前选择的摄像机camera cable
    [types.MONITOR_SET_CAMERA_CABLE] (state, payload) {
        state.checkedCamera = payload
    },
    //设置当前选择的FM1设备
    [types.MONITOR_SET_FM1_DEVICE] (state, payload) {
        state.checkedFM1 = payload
    },
    //设置当前选择的FM2设备
    [types.MONITOR_SET_FM2_DEVICE] (state, payload) {
        state.checkedFM2 = payload
    },
    //设置当前选择的水肥设备
    [types.MONITOR_SET_WAF_DEVICE] (state, payload) {
        state.checkedWAF = payload
    },
    //设置当前选择的设备类型
    [types.MONITOR_SET_DEVICE_TYPE] (state, payload) {
        state.checkedDeviceType = payload
    },
    //设置溯源地址数据
    [types.MONITOR_SET_CAMERA_CTRL] (state, payload) {
        state.isCameraCtrl = payload
    },
    //切换fm1设备
    [types.MONITOR_CHANGE_FM1_DEVICE] (state, payload) {
        state.airTempDay = payload.airTempDay
        state.airHumidityDay = payload.airHumidityDay
        state.lightIntensityDay = payload.lightIntensityDay
        state.airIntensityDay = payload.airIntensityDay
        state.airTempWeek = payload.airTempWeek
        state.airHumidityWeek = payload.airHumidityWeek
        state.lightIntensityWeek = payload.lightIntensityWeek
        state.airIntensityWeek = payload.airIntensityWeek
        state.lineData = state.isWeek? payload.airTempWeek : payload.airTempDay
    },
    //切换fm2设备
    [types.MONITOR_CHANGE_FM2_DEVICE] (state, payload) {
        state.windSpeedDay = payload.windSpeedDay
        state.rainfallDay = payload.rainfallDay
        state.soilTempDay = payload.soilTempDay
        state.soilHumidityDay = payload.soilHumidityDay
        state.windSpeedWeek = payload.windSpeedWeek
        state.rainfallWeek = payload.rainfallWeek
        state.soilTempWeek = payload.soilTempWeek
        state.soilHumidityWeek = payload.soilHumidityWeek
        state.lineData = state.isWeek? payload.windSpeedWeek : payload.windSpeedDay
    },
    //切换waf设备
    [types.MONITOR_CHANGE_WAF_DEVICE] (state, payload) {
        
    },
}