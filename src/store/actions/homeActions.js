import types from '@/store/constants/types'
import api from '@/lib/api'
import filter from '@/lib/filter'
import point from '@/lib/point.json'
const method = api.localData? 'get' : 'post'
export default {
    [types.HOME_GET_DATA] (context, amount) { //获取首页数据
        const that = this
        const url  = api.localData? api.postHomeData : api.postHomeData + amount.type
        that.dispatch( 'ajax', {
            method: method,
            url: url,
            data: {address: amount.name, Variety: '', prov: amount.prov}
        } ).then((data) => {
            that.commit( 'map/' + types.MAP_SET_POST_DATA, amount ) //保存当前页面的状态
            if(data && data.data) {
                data = data.data
            }
            let maxMouth = new Date().getMonth() + 1
            //种植分布情况
            let plantDistribute = []
            let distributionOfProvinces = 0
            if(data && data.AreaList && data.AreaList.length > 0) {
                data.AreaList.forEach(item => {
                    if(item.Name && item.area) {
                        if(point[item.Name]) {
                            plantDistribute.push([point[item.Name][0], point[item.Name][1], item.area, item.Name])
                            if(item.area) {
                                distributionOfProvinces++
                            }
                        }
                    }
                })
            }
            context.commit( types.HOME_SET_PLANT_DISTRIBUTE, plantDistribute)

            //获取总体数据
            let totalData = {
                numberOfOrchard: data.count? data.count : 0,
                plantArea: data.area ? data.area : 0,
                numberOfPlant: data.cropcount? data.cropcount : 0,
                distributionOfProvinces: distributionOfProvinces,
            }
            context.commit( types.HOME_SET_TOTAL_DATA, totalData )
            //获取库存比较数据
            let inventoryContrast = { data: [] }
            if(data && data.Stock && data.Stock.length > 0) {
                if(data.Stock.length === 1 && data.GardenStock && data.GardenStock.length) {
                    inventoryContrast = filter.obj(data.GardenStock, 'cropName', 'weight', 2, false)
                    inventoryContrast.cropName = inventoryContrast.data[0].cropName = data.Stock[0]['cropName']
                }else {
                    inventoryContrast = filter.obj(data.Stock, 'cropName', 'weight', 2, false)
                }
            }
            inventoryContrast.unit = 'KG'
            inventoryContrast.data.sort(function (a, b) {
                return b.value - a.value;
            })
            context.commit( types.HOME_SET_INVENTORY_CONTRAST, inventoryContrast )

            //获取设备占比数据
            let deviceRatio = { data:[] }
            if(data && data.Equipment && data.Equipment.length > 0) {
                let obj = null
                obj = filter.obj(data.Equipment, 'cameraName', 'count')
                obj.data.forEach(item => {
                    switch(item.name) {
                        case '全景摄像头': item.type = 'C';break
                        case '普通摄像头': item.type = 'A';break
                        case 'AI智能摄像头': item.type = 'AI';break
                        case '云台摄像头': item.type = 'B';break
                        case '监控FM1': item.type = 'FM1';break
                        case '监控FM2': item.type = 'FM2';break
                        default: item.type = 'other'
                    }
                    deviceRatio.data.push(item)
                })
            }
            deviceRatio.data.sort(function(a, b) {
                return b.value - a.value
            })
            deviceRatio.unit = '台'
            
            //deviceRatio.data.push({name: '水肥设备', value: 2})
            context.commit( types.HOME_SET_DEVICE_RATIO, deviceRatio )
            
            //获取采摘排行数据
            let pickRank = { data: []}
            if(data && data.PickRanking && data.PickRanking.length > 0) {
                pickRank = filter.obj(data.PickRanking, 'cropName', 'weight')
            }
            pickRank.unit = 'KG'
            pickRank.data = pickRank.data.splice(0, 7)
            context.commit( types.HOME_SET_PICK_RANK, pickRank )

            //获取溯源区域数据originNation 
            let originRegion = {data:[]}
            if(data && data.Origin && data.Origin.length > 0) {
                originRegion = filter.obj(data.Origin, 'city', 'count')
            }
            originRegion.data.sort(function (a, b) {
                return b.value - a.value
            })
            if(originRegion.data.length > 8){
                originRegion.data = originRegion.data.splice(0, 9)
                originRegion.data.push({name: '...', value: ''})
            }
            originRegion.data.forEach(item => {
                if(item.name === '香港特别行政区') {
                    item.name = '香港'
                }
            })
            context.commit( types.HOME_SET_ORIGIN_REGION, originRegion )

            //获取施肥用量统计数据
            
            let fertQuantity = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                values: [],
                names: [],
                unit: 'KG'
            }
            if(data && data.Fertilizer && data.Fertilizer.length > 0) {
                let fertObj = {}
                data.Fertilizer.forEach(item => {
                    if(!fertObj[item.dosageName]) {
                        fertObj[item.dosageName] = []
                    }
                    let mouth = parseInt(item.mouth) - 1
                    if(mouth < maxMouth){
                        fertObj[item.dosageName][mouth] = item.weight
                    }
                })
                for(let key in fertObj) {
                    for(let i = 0; i < maxMouth; i++) {
                        if(!fertObj[key][i]) {
                            fertObj[key][i] = 0
                        }
                    }
                    fertQuantity.values.push(fertObj[key])
                    fertQuantity.names.push(key)
                }
                fertQuantity.titles = fertQuantity.titles.splice(0, maxMouth)
            }
            context.commit( types.HOME_SET_FERT_QUANTITY, fertQuantity )
            //获取出库入库数据
            let outboundInventory = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'], 
                values: [[], []], 
                names: ['入库', '出库'],
                unit: 'KG'
            }
            if(data && data.instock && data.instock.length > 0) {
                let inArr = []
                data.instock.forEach(item => {
                    let mouth = parseInt(item.mouth) - 1
                    if(mouth < maxMouth){
                        inArr[mouth] = item.weight
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!inArr[i]) {
                        inArr[i] = 0
                    }
                }
                outboundInventory.values[0] = inArr
            }
            if(data && data.outstock && data.outstock.length > 0) {
                let outArr = []
                data.outstock.forEach(item => {
                    let mouth = parseInt(item.mouth) - 1
                    if(mouth < maxMouth){
                        outArr[mouth] = item.weight
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!outArr[i]) {
                        outArr[i] = 0
                    }
                }
                outboundInventory.values[1] = outArr
            }
            if(outboundInventory.values[0].length === 0 && outboundInventory.values[1].length === 0) {
                outboundInventory.values = []
            }
            outboundInventory.titles = outboundInventory.titles.splice(0, maxMouth)
            context.commit( types.HOME_SET_OUTBOUND_INVENTORY, outboundInventory )
        })
    }
}