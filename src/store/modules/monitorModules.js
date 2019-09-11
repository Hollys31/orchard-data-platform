import actions from '@/store/actions/monitorActions'
import mutations from '@/store/mutations/monitorMutations'

export default {
    namespaced: true,
    state: {
        orchardList: [], //果园列表
        orchardInfo: {}, //当前选中果园的信息
        deviceData: {
            fm1:[],
            fm2: [],
            waf: []
        }, //果园设备数据
        fm1List: [], //FM1设备列表
        fm2List: [], //FM2设备列表
        wafList: [], //水肥设备列表
        cameraList: [], //摄像头设备列表
        panoramaList: [], //全景图设备列表
        environmentData: [], //详细环境数据
        environmentUpDate: '', //详细环境数据更新时间
        farmingActivities: {titles: [], values: []}, //农事活动数据
        plantArea: {data: []}, //果树种植面积数据
        lineData: {titles: [], values: []}, //折线图数据
        lineDataName: 'airTempWeek', //当前显示折线图数据的名称
        isWeek: true, //当前折线图显示是否是七天数据
        checkedCamera: 0, //当前选择的摄像机
        checkedFM1: 0, //当前选择的FM1设备
        checkedFM2: 0, //当前选择的FM2设备
        checkedWAF: 0, //当前选择的水肥设备
        checkedDeviceType: 'fm1', //当前选择的设备类型
        isCameraCtrl: true, //球形摄像机是否可控制

        //折线图数据
        windSpeedDay: {}, //时刻风速
        rainfallDay: {}, //时刻降雨量
        soilHumidityDay: {}, //时刻土壤湿度
        airHumidityDay: {}, //时刻空气湿度
        airTempDay: {}, //时刻空气温度
        soilTempDay: {}, //时刻土壤温度
        lightIntensityDay: {}, //时刻光照强度
        airIntensityDay: {}, //时刻气压强度
        soilECDay: {}, //时刻土壤EC
        fertFlowDay: {}, //时刻肥流量
        waterFlowDay: {}, //时刻水流量
        soilPHDay: {}, //时刻土壤PH
        windSpeedWeek: {}, //七天风速
        rainfallWeek: {}, //七天降雨量
        soilHumidityWeek: {}, //七天土壤湿度
        airHumidityWeek: {}, //七天空气湿度
        airTempWeek: {}, //七天空气温度
        soilTempWeek: {}, //七天土壤温度
        lightIntensityWeek: {}, //七天光照强度
        airIntensityWeek: {}, //七天气压强度
        soilECWeek: {}, //七天土壤EC
        fertFlowWeek: {}, //七天肥流量
        waterFlowWeek: {}, //七天水流量
        soilPHWeek: {}, //七天土壤PH
    },
    actions,
    mutations
}