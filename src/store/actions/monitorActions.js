import types from '@/store/constants/types'
import api from '@/lib/api'
import filter from '@/lib/filter'
import { random } from 'node-forge';
const method = api.localData? 'get' : 'post'
export default {
    //获取初始化信息
    [types.MONITOR_GET_INIT_INFO] (context, amount, spinner = true) { 
        const that = this
        const url  = api.localData? (amount.gardenId? api.postInitOrchardInfo : api.postInitInfo) : api.postInitInfo
        that.dispatch( 'ajax', {
            method: method,
            url: url,
            data: {gardenId: amount.gardenId}
        }, spinner ).then((data) => {
            that.commit( 'map/' + types.MAP_SET_POST_DATA, amount ) //保存当前页面的状态
            if(data && data.data) {
                data = data.data
            }
            let maxMouth = new Date().getMonth() + 1
            if(data && data.gardens) { //获取果园列表
                const orchardList = filter.coord(data.gardens, 'gislong', 'gitlatd', 'gardenName', 'equipmentCount', 'gradenId')
                orchardList.sort(function (a, b) {
                    return parseInt(b[3]) - parseInt(a[3]);
                })
                context.commit(types.MONITOR_SET_ORCHARD_LIST, orchardList)
            }else {
                //获取当前选择果园的果园信息
                if(data && data.gardenDetail) {
                    if(this.state.orchardId) {
                        context.commit(types.MONITOR_SET_ORCHARD_LIST, [[
                            data.gardenDetail.gislong,
                            data.gardenDetail.gislatd,
                            data.gardenDetail.gardenName,
                            data.equipmentCount? data.equipmentCount : 0,
                            amount.gardenId,
                        ]])
                    }
                    const orchardInfo = {
                        name: data.gardenDetail.gardenName, //果园名称
                        pic: data.head? data.head : '/img/154276890.png', //头像
                        principal: data.gardenDetail.owner, //果园负责人
                        //phone: data.gardenDetail.phone, //果园负责人联系方式
                        address: data.gardenDetail.address,  //果园地址
                        area: data.gardenDetail.area? data.gardenDetail.area : 0, //果园面积
                        breed: data.cropCount? data.cropCount : 0, //种植品种数量
                        count: data.users? data.users : 0, //农户人数
                        deviceCount: data.equipmentCount? data.equipmentCount : 0 //果园设备数量
                    }
                    context.commit(types.MONITOR_SET_ORCHARD_INFO, orchardInfo)
                }

                //获取当前选择果园设备列表
                let fm1List = []
                let fm2List = []
                let wafList = []
                let cameraList = []
                if(data && data.equipmentaddress && data.equipmentaddress.length > 0) {
                    //+ Math.random()
                    let item
                    for(let i = 0; i < data.equipmentaddress.length; i++){
                        item = data.equipmentaddress[i]
                        switch(item.type) {
                            case 'FM1': fm1List.push([parseFloat(item.gislong), parseFloat(item.gislatd), item.fmbName? item.fmbName : 'FM1监测站' + (i + 1), item.fmb_id, item.type])
                                break
                            case 'FM2': fm2List.push([parseFloat(item.gislong), parseFloat(item.gislatd), item.fmbName? item.fmbName : 'FM2监测站' + (i + 1), item.fmb_id, item.type])
                                break
                            default: break
                        }
                    }
                }
                /**
                 *  cameraId: 30036
                    cameraName: "黄龙村山顶球机"
                    cameraType: "B"
                    gbName: null
                    gislatd: 25.8238602172
                    gislong: 114.917122962
                    hurl: "rtmp://rtmp01open.ys7.com/openlive/9fbacf6f3b474e41846390aaeb22a46a"
                    sno: "C70339482"
                    url: "http://hls01open.ys7.com/openlive/9fbacf6f3b474e41846390aaeb22a46a.m3u8"
                 */
                if(data && data.em && data.em.length > 0) {
                    let item
                    for(let i = 0; i < data.em.length; i++) {
                        item = data.em[i]
                        cameraList.push([parseFloat(item.gislong), parseFloat(item.gislatd), item.emName? item.emName : '360全景' + (i + 1), item.emId, 'C', item.path, item.emdevid, '360全景'])
                    }
                }
                if(data && data.cameras && data.cameras.length > 0) {
                    let item
                    for(let i = 0; i < data.cameras.length; i++) {
                        item = data.cameras[i]
                        let alias = '摄像机'
                        if(item.cameraType === 'A') {
                            alias = '枪型机'
                        }else if(item.cameraType === 'B') {
                            alias = '球型机'
                        }else if(item.cameraType === 'AI') {
                            alias = 'AI枪机'
                        }
                        cameraList.push([parseFloat(item.gislong), parseFloat(item.gislatd), item.cameraName? item.cameraName : '摄像机' + (i + 1), item.cameraId, item.cameraType, item.hurl, item.sno, alias, item.url, item.verifyCode])
                    }
                    //cameraList.push([123, 25, 'live', 'D56345', 'D', 'ezopen://XLLYPN@open.ys7.com/D32791336/1.hd.live', 'D32791336', '语音对讲', 'ezopen://XLLYPN@open.ys7.com/D32791336/1.hd.live'])
                }
                /**
                 *  em: [,…]
                    0: {gislatd: 25.860573, gislong: 114.893484, emId: 1, emName: "全景1", emdevid: "31384703333230302c002b00"}
                    emId: 1
                    emName: "全景1"
                    emdevid: "31384703333230302c002b00"
                    gislatd: 25.860573
                    gislong: 114.893484
                 */
                context.commit( types.MONITOR_SET_DEVICE_LIST, {
                    fm1List: fm1List,
                    fm2List: fm2List,
                    wafList: wafList,
                    cameraList: cameraList
                } )

                //FM1设备数据
                let airTempDay = {titles: [], values: []}
                let airHumidityDay = {titles: [], values: []}
                let lightIntensityDay = {titles: [], values: []}
                let airIntensityDay = {titles: [], values: []}
                let airTempWeek = {titles: [], values: []}
                let airHumidityWeek = {titles: [], values: []}
                let lightIntensityWeek = {titles: [], values: []}
                let airIntensityWeek = {titles: [], values: []}
                //FM2设备数据
                let windSpeedDay = {titles: [], values: []}
                let rainfallDay = {titles: [], values: []}
                let soilTempDay = {titles: [], values: []}
                let soilHumidityDay = {titles: [], values: []}
                let windSpeedWeek = {titles: [], values: []}
                let rainfallWeek = {titles: [], values: []}
                let soilTempWeek = {titles: [], values: []}
                let soilHumidityWeek = {titles: [], values: []}
                //水肥设备数据
                let soilECDay = {titles: [], values: []}
                let fertFlowDay = {titles: [], values: []}
                let waterFlowDay = {titles: [], values: []}
                let soilPHDay = {titles: [], values: []}
                let soilECWeek = {titles: [], values: []}
                let fertFlowWeek = {titles: [], values: []}
                let waterFlowWeek = {titles: [], values: []}
                let soilPHWeek = {titles: [], values: []}
                //详细环境信息
                let environmentUpDate = '' //更新日期
                let environmentUpTime = '' //更新时刻
                let environmentFM1 = []
                let environmentFM2 = []
                let environmentData = [
                    {name: '空气温度',value: '-',status: '暂无设备',unit: '°C',},
                    {name: '空气湿度',value: '-',status: '暂无设备',unit: '%',},
                    {name: '光照强度',value: '-',status: '暂无设备',unit: 'lux',},
                    {name: '气压强度',value: '-',status: '暂无设备',unit: 'pa',},
                    {name: '风速', value: '-', status: '暂无设备', unit: 'm/s',},
                    {name: '降雨量',value: '-',status: '暂无设备',unit: 'mm',},
                    {name: '土壤温度',value: '-',status: '暂无设备',unit: '°C',},
                    {name: '土壤湿度',value: '-',status: '暂无设备',unit: '%',},
                    {name: '土壤盐度',value: '-',status: '暂无设备',unit: 'mS/cm',},
                    {name: '肥流量',value: '-',status: '暂无设备',unit: 'm/s',},
                    {name: '水流量',value: '-',status: '暂无设备',unit: 'm/s',},
                    {name: '土壤PH',value: '-',status: '暂无设备',unit: 'pH',},
                ]

                if(data && data.fm1 && data.fm1.length > 0 && fm1List.length) {
                    data.fm1 = filter.dateSort(data.fm1, 'days')
                    environmentFM1 = data.fm1
                    environmentUpDate = data.fm1[data.fm1.length - 1].days
                    airTempWeek = filter.arr(data.fm1, 'days', 'flddata_temp')
                    airTempWeek.unit = '°C'
                    airTempWeek.name = '空气温度'
                    airHumidityWeek = filter.arr(data.fm1, 'days', 'flddata_humid')
                    airHumidityWeek.unit = '%'
                    airHumidityWeek.name = '空气湿度'
                    lightIntensityWeek = filter.arr(data.fm1, 'days', 'flddata_sunlux')
                    lightIntensityWeek.unit = 'lux'
                    lightIntensityWeek.name = '光照强度'
                    airIntensityWeek = filter.arr(data.fm1, 'days', 'flddata_pa')
                    airIntensityWeek.unit = 'pa'
                    airIntensityWeek.name = '气压强度'
                }
                
                if(data && data.fm2 && data.fm2.length > 0 && fm2List.length) {
                    data.fm2 = filter.dateSort(data.fm2, 'days')
                    environmentFM2 = data.fm2
                    if(!environmentUpDate) {
                        environmentUpDate = data.fm2[data.fm2.length - 1].days
                    }
                    windSpeedWeek = filter.arr(data.fm2, 'days', 'fmbdata_windspd')
                    windSpeedWeek.unit = 'm/s'
                    windSpeedWeek.name = '风速'
                    rainfallWeek = filter.arr(data.fm2, 'days', 'fmbdata_rain')
                    rainfallWeek.unit = 'mm'
                    rainfallWeek.name = '降雨量'
                    soilTempWeek = filter.arr(data.fm2, 'days', 'fmbdata_soiltemp')
                    soilTempWeek.unit = '°C'
                    soilTempWeek.name = '土壤温度'
                    soilHumidityWeek = filter.arr(data.fm2, 'days', 'fmbdata_soilmture')
                    soilHumidityWeek.unit = '%'
                    soilHumidityWeek.name = '土壤湿度'
                }
                
                let fm1 = {
                    airTempDay: airTempDay,
                    airHumidityDay: airHumidityDay,
                    lightIntensityDay: lightIntensityDay,
                    airIntensityDay: airIntensityDay,
                    airTempWeek: airTempWeek,
                    airHumidityWeek: airHumidityWeek,
                    lightIntensityWeek: lightIntensityWeek,
                    airIntensityWeek: airIntensityWeek,
                }
                let fm2 = {
                    windSpeedDay: windSpeedDay,
                    rainfallDay: rainfallDay,
                    soilTempDay: soilTempDay,
                    soilHumidityDay: soilHumidityDay,
                    windSpeedWeek: windSpeedWeek,
                    rainfallWeek: rainfallWeek,
                    soilTempWeek: soilTempWeek,
                    soilHumidityWeek: soilHumidityWeek,
                }
                let waf = {
                    soilECDay: soilECDay,
                    fertFlowDay: fertFlowDay,
                    waterFlowDay: waterFlowDay,
                    soilPHDay: soilPHDay,
                    soilECWeek: soilECWeek,
                    fertFlowWeek: fertFlowWeek,
                    waterFlowWeek: waterFlowWeek,
                    soilPHWeek: soilPHWeek,
                }
                context.commit(types.MONITOR_SET_DEVICE_DATA, {device: 'fm1', data: fm1, index: 0})
                context.commit(types.MONITOR_SET_DEVICE_DATA, {device: 'fm2', data: fm2, index: 0})
                context.commit(types.MONITOR_SET_DEVICE_DATA, {device: 'waf', data: waf, index: 0})
                if(data && data.NowFm1 && data.NowFm1.length > 0  && fm1List.length) {
                    data.NowFm1.forEach(item => {
                        let date = new Date(item.flddata_txtime)
                        let hours = date.getHours()
                        if(hours < 10) hours = '0' + hours
                        let minutes = date.getMinutes()
                        if(minutes < 10) minutes = '0' + minutes
                        item.flddata_txtime = hours + ':' + minutes
                    })
                    environmentFM1 = data.NowFm1
                    environmentUpTime = data.NowFm1[data.NowFm1.length - 1].flddata_txtime
                    airTempDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_temp')
                    airTempDay.unit = '°C'
                    airTempDay.name = '空气温度'
                    airHumidityDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_humid')
                    airHumidityDay.unit = '%'
                    airHumidityDay.name = '空气湿度'
                    lightIntensityDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_sunlux')
                    lightIntensityDay.unit = 'lux'
                    lightIntensityDay.name = '光照强度'
                    airIntensityDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_pa')
                    airIntensityDay.unit = 'pa'
                    airIntensityDay.name = '气压强度'
                }
                if(data && data.NowFm2 && data.NowFm2.length > 0 && fm2List.length) {
                    data.NowFm2.forEach(item => {
                        let date = new Date(item.fmbdata_txtime)
                        let hours = date.getHours()
                        if(hours < 10) hours = '0' + hours
                        let minutes = date.getMinutes()
                        if(minutes < 10) minutes = '0' + minutes
                        item.fmbdata_txtime = hours + ':' + minutes
                    })
                    environmentFM2 = data.NowFm2
                    if(environmentUpTime) {
                        environmentUpTime = data.NowFm2[data.NowFm2.length - 1].fmbdata_txtime
                    }
                    windSpeedDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_windspd')
                    windSpeedDay.unit = 'm/s'
                    windSpeedDay.name = '风速'
                    rainfallDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_rain')
                    rainfallDay.unit = 'mm'
                    rainfallDay.name = '降雨量'
                    soilTempDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_soiltemp')
                    soilTempDay.unit = '°C'
                    soilTempDay.name = '土壤温度'
                    soilHumidityDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_soilmture')
                    soilHumidityDay.unit = '%'
                    soilHumidityDay.name = '土壤湿度'
                }
                let fm1Len = environmentFM1.length - 1
                let fm2Len = environmentFM2.length - 1
                if(environmentFM1[fm1Len] && environmentFM1[fm1Len].flddata_temp !== 'null') {
                    environmentData[0].value = parseFloat(environmentFM1[fm1Len].flddata_temp).toFixed(2)
                    environmentData[0].status = '正常'
                }else {
                    environmentData[0].status = fm1List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM1[fm1Len] && environmentFM1[fm1Len].flddata_humid !== 'null') {
                    environmentData[1].value = parseFloat(environmentFM1[fm1Len].flddata_humid).toFixed(2)
                    environmentData[1].status = '正常'
                }else {
                    environmentData[1].status = fm1List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM1[fm1Len] && environmentFM1[fm1Len].flddata_sunlux !== 'null') {
                    environmentData[2].value = parseFloat(environmentFM1[fm1Len].flddata_sunlux).toFixed(2)
                    environmentData[2].status = '正常'
                }else {
                    environmentData[2].status = fm1List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM1[fm1Len] && environmentFM1[fm1Len].flddata_pa !== 'null') {
                    environmentData[3].value = parseFloat(environmentFM1[fm1Len].flddata_pa).toFixed(2)
                    environmentData[3].status = '正常'
                }else {
                    environmentData[3].status = fm1List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM2[fm2Len] && environmentFM2[fm2Len].fmbdata_windspd !== 'null') {
                    environmentData[4].value = parseFloat(environmentFM2[fm2Len].fmbdata_windspd).toFixed(2)
                    environmentData[4].status = '正常'
                }else {
                    environmentData[4].status = fm2List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM2[fm2Len] && environmentFM2[fm2Len].fmbdata_rain !== 'null') {
                    environmentData[5].value = parseFloat(environmentFM2[fm2Len].fmbdata_rain).toFixed(2)
                    environmentData[5].status = '正常'
                }else {
                    environmentData[5].status = fm2List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM2[fm2Len] && environmentFM2[fm2Len].fmbdata_soiltemp !== 'null') {
                    environmentData[6].value = parseFloat(environmentFM2[fm2Len].fmbdata_soiltemp).toFixed(2)
                    environmentData[6].status = '正常'
                }else {
                    environmentData[6].status = fm2List.length? '数据异常' : '暂无设备'
                }
                if(environmentFM2[fm2Len] && environmentFM2[fm2Len].fmbdata_soilmture !== 'null') {
                    environmentData[7].value = parseFloat(environmentFM2[fm2Len].fmbdata_soilmture).toFixed(2)
                    environmentData[7].status = '正常'
                }else {
                    environmentData[7].status = fm2List.length? '数据异常' : '暂无设备'
                }
                if(environmentUpDate) {
                    environmentUpDate = environmentUpDate + '  ' + environmentUpTime
                }else {
                    let date = new Date()
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1
                    if(month < 10) month = '0' + month
                    let day = date.getDate()
                    if(day < 10) day = '0' + day
                    environmentUpDate = year + '-' + month + '-' + day + '  ' + environmentUpTime
                }
                context.commit(types.MONITOR_SET_ENVIRONMENT_INFO, {
                    airTempDay: airTempDay,
                    airHumidityDay: airHumidityDay,
                    lightIntensityDay: lightIntensityDay,
                    airIntensityDay: airIntensityDay,
                    airTempWeek: airTempWeek,
                    airHumidityWeek: airHumidityWeek,
                    lightIntensityWeek: lightIntensityWeek,
                    airIntensityWeek: airIntensityWeek,
                    windSpeedDay: windSpeedDay,
                    rainfallDay: rainfallDay,
                    soilTempDay: soilTempDay,
                    soilHumidityDay: soilHumidityDay,
                    windSpeedWeek: windSpeedWeek,
                    rainfallWeek: rainfallWeek,
                    soilTempWeek: soilTempWeek,
                    soilHumidityWeek: soilHumidityWeek,
                    soilECDay: soilECDay,
                    fertFlowDay: fertFlowDay,
                    waterFlowDay: waterFlowDay,
                    soilPHDay: soilPHDay,
                    soilECWeek: soilECWeek,
                    fertFlowWeek: fertFlowWeek,
                    waterFlowWeek: waterFlowWeek,
                    soilPHWeek: soilPHWeek,
                    environmentData: environmentData,
                    environmentUpDate: environmentUpDate
                })
                //获取农事活动信息
                const farmingActivities = {
                    titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                    values: [],
                    names: [],
                    unit: '次'
                }
                if(data && data.farmwoker && data.farmwoker.length > 0) {
                    let farmObj = {}
                    data.farmwoker.forEach(item => {
                        if(!farmObj[item.farmType]) {
                            farmObj[item.farmType] = []
                        }
                        let mouth = parseInt(item.mouth) - 1
                        if(mouth < maxMouth){
                            farmObj[item.farmType][mouth] = item.count
                        }
                    })
                    for(let key in farmObj) {
                        for(let i = 0; i < maxMouth; i++) {
                            if(!farmObj[key][i]) {
                                farmObj[key][i] = 0
                            }
                        }
                        farmingActivities.values.push(farmObj[key])
                        farmingActivities.names.push(key)
                    }
                }
                farmingActivities.titles = farmingActivities.titles.splice(0, maxMouth)
                context.commit(types.MONITOR_SET_FARMING_INFO, farmingActivities)
                
                //获取果树种植面积
                let plantArea = {data: []}
                if(data && data.cropAreaTime) {
                    plantArea = filter.obj(data.cropAreaTime, 'cropName', 'area')
                }
                plantArea.unit = '亩'
                plantArea.data.sort(function (a, b) {
                    return b.value - a.value;
                })
                context.commit(types.MONITOR_SET_PLANT_AREA, plantArea)
            }
        })
    },
    [types.MONITOR_GET_DEVICE_DATA] (context, amount) { 
        const that = this
        that.dispatch( 'ajax', {
            method: method,
            url: api.postDeviceData,
            data: {equipmentId: amount.equipmentId, type: amount.type}
        } ).then((data) => {
            data = data.data
            if(amount.device === 'fm1') {
                //FM1设备数据
                let airTempDay = {titles: [], values: []}
                let airHumidityDay = {titles: [], values: []}
                let lightIntensityDay = {titles: [], values: []}
                let airIntensityDay = {titles: [], values: []}
                let airTempWeek = {titles: [], values: []}
                let airHumidityWeek = {titles: [], values: []}
                let lightIntensityWeek = {titles: [], values: []}
                let airIntensityWeek = {titles: [], values: []}
                if(data && data.NowFm1 && data.NowFm1.length > 0) {
                    data.NowFm1.forEach(item => {
                        let date = new Date(item.flddata_txtime)
                        let hours = date.getHours()
                        if(hours < 10) hours = '0' + hours
                        let minutes = date.getMinutes()
                        if(minutes < 10) minutes = '0' + minutes
                        item.flddata_txtime = hours + ':' + minutes
                    })
                    airTempDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_temp')
                    airTempDay.unit = '°C'
                    airTempDay.name = '空气温度'
                    airHumidityDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_humid')
                    airHumidityDay.unit = '%'
                    airHumidityDay.name = '空气湿度'
                    lightIntensityDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_sunlux')
                    lightIntensityDay.unit = 'lux'
                    lightIntensityDay.name = '光照强度'
                    airIntensityDay = filter.arr(data.NowFm1, 'flddata_txtime', 'flddata_pa')
                    airIntensityDay.unit = 'pa'
                    airIntensityDay.name = '气压强度'
                }
                if(data && data.WeekFm1 && data.WeekFm1.length > 0) {
                    data.WeekFm1 = filter.dateSort(data.WeekFm1, 'days')
                    airTempWeek = filter.arr(data.WeekFm1, 'days', 'flddata_temp')
                    airTempWeek.unit = '°C'
                    airTempWeek.name = '空气温度'
                    airHumidityWeek = filter.arr(data.WeekFm1, 'days', 'flddata_humid')
                    airHumidityWeek.unit = '%'
                    airHumidityWeek.name = '空气湿度'
                    lightIntensityWeek = filter.arr(data.WeekFm1, 'days', 'flddata_sunlux')
                    lightIntensityWeek.unit = 'lux'
                    lightIntensityWeek.name = '光照强度'
                    airIntensityWeek = filter.arr(data.WeekFm1, 'days', 'flddata_pa')
                    airIntensityWeek.unit = 'pa'
                    airIntensityWeek.name = '气压强度'
                }
                let fm1 = {
                    airTempDay: airTempDay,
                    airHumidityDay: airHumidityDay,
                    lightIntensityDay: lightIntensityDay,
                    airIntensityDay: airIntensityDay,
                    airTempWeek: airTempWeek,
                    airHumidityWeek: airHumidityWeek,
                    lightIntensityWeek: lightIntensityWeek,
                    airIntensityWeek: airIntensityWeek
                }
                context.commit(types.MONITOR_SET_DEVICE_DATA, {device: 'fm1', data: fm1, index: context.state.checkedFM1})
                context.commit(types.MONITOR_CHANGE_FM1_DEVICE, fm1)
            }else if(amount.device === 'fm2') {
                //FM2设备数据
                let windSpeedDay = {titles: [], values: []}
                let rainfallDay = {titles: [], values: []}
                let soilTempDay = {titles: [], values: []}
                let soilHumidityDay = {titles: [], values: []}
                let windSpeedWeek = {titles: [], values: []}
                let rainfallWeek = {titles: [], values: []}
                let soilTempWeek = {titles: [], values: []}
                let soilHumidityWeek = {titles: [], values: []}
                if(data && data.NowFm2 && data.NowFm2.length > 0) {
                    data.NowFm2.forEach(item => {
                        let date = new Date(item.fmbdata_txtime)
                        let hours = date.getHours()
                        if(hours < 10) hours = '0' + hours
                        let minutes = date.getMinutes()
                        if(minutes < 10) minutes = '0' + minutes
                        item.fmbdata_txtime = hours + ':' + minutes
                    })
                    windSpeedDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_windspd')
                    windSpeedDay.unit = 'm/s'
                    windSpeedDay.name = '风速'
                    rainfallDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_rain')
                    rainfallDay.unit = 'mm'
                    rainfallDay.name = '降雨量'
                    soilTempDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_soiltemp')
                    soilTempDay.unit = '°C'
                    soilTempDay.name = '土壤温度'
                    soilHumidityDay = filter.arr(data.NowFm2, 'fmbdata_txtime', 'fmbdata_soilmture')
                    soilHumidityDay.unit = '%'
                    soilHumidityDay.name = '土壤湿度'
                }
                if(data && data.WeekFm2 && data.WeekFm2.length > 0) {
                    data.WeekFm2 = filter.dateSort(data.WeekFm2, 'days')
                    windSpeedWeek = filter.arr(data.WeekFm2, 'days', 'fmbdata_windspd')
                    windSpeedWeek.unit = 'm/s'
                    windSpeedWeek.name = '风速'
                    rainfallWeek = filter.arr(data.WeekFm2, 'days', 'fmbdata_rain')
                    rainfallWeek.unit = 'mm'
                    rainfallWeek.name = '降雨量'
                    soilTempWeek = filter.arr(data.WeekFm2, 'days', 'fmbdata_soiltemp')
                    soilTempWeek.unit = '°C'
                    soilTempWeek.name = '土壤温度'
                    soilHumidityWeek = filter.arr(data.WeekFm2, 'days', 'fmbdata_soilmture')
                    soilHumidityWeek.unit = '%'
                    soilHumidityWeek.name = '土壤湿度'
                }
                let fm2 =  {
                    windSpeedDay: windSpeedDay,
                    rainfallDay: rainfallDay,
                    soilTempDay: soilTempDay,
                    soilHumidityDay: soilHumidityDay,
                    windSpeedWeek: windSpeedWeek,
                    rainfallWeek: rainfallWeek,
                    soilTempWeek: soilTempWeek,
                    soilHumidityWeek: soilHumidityWeek,
                }
                context.commit(types.MONITOR_SET_DEVICE_DATA, {device: 'fm2', data: fm2, index: context.state.checkedFM2})
                context.commit(types.MONITOR_CHANGE_FM2_DEVICE, fm2)
            }
        })
    },
    [types.MONITOR_CAMERA_CTRL_CMD] (context, amount) {
        const that = this
        that.dispatch( 'ajax', {
            method: method,
            url: api.postCameraCtrl,
            data: {deviceSerial: amount.deviceSerial, direction: amount.direction, speed: amount.speed}
        } ).then((data) => {
            //console.log(data)
            that.dispatch( 'ajax', {
                method: method,
                url: api.postCameraCtrl,
                data: {deviceSerial: amount.deviceSerial, direction: 12, speed: amount.speed}
            } ).then((data) => {
                //console.log(data)
                context.commit(types.MONITOR_SET_CAMERA_CTRL, true)
            })
        })
    },
}