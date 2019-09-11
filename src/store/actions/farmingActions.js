import types from '@/store/constants/types'
import api from '@/lib/api'
import filter from '@/lib/filter'
import point from '@/lib/point.json'
const method = api.localData? 'get' : 'post'
export default {
    [types.FARMING_GET_DATA] (context, amount, spinner = true) { //获取农事活动页面数据
        const that = this
        const url  = api.localData? api.postFarmingData : api.postFarmingData + amount.type
        that.dispatch( 'ajax', {
            method: method,
            url: url,
            data: {address: amount.name, Variety: amount.key, prov: amount.prov }
        }, spinner ).then((data) => {
            that.commit( 'map/' + types.MAP_SET_POST_DATA, amount ) //保存当前页面的状态
            if(data && data.data) {
                data = data.data
            }
            let maxMouth = new Date().getMonth() + 1
            //种植分布情况
            let plantDistribute = []
            if(data && data.AreaList && data.AreaList.length > 0) {
                let arr = []
                data.AreaList.forEach(item => {
                    if(item.Name && item.area) {
                        if(point[item.Name]) {
                            arr.push([point[item.Name][0], point[item.Name][1], item.area, item.Name])
                        }
                    }
                })
                plantDistribute = arr
            }

            let autoFertDose = { data: [] }
            if(data && data.FertilizerInfo && data.FertilizerInfo.length > 0) {
                autoFertDose = filter.obj(data.FertilizerInfo, 'dosageName', 'weight')
            }

            let autoFertMonth = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                names: [],
                values: [],
            }
            if(data && data.Fertilizer) {
                let fertObj = {}
                data.Fertilizer.forEach(item => {
                    if(!fertObj[item.dosageName]) {
                        fertObj[item.dosageName] = []
                    }
                    let index = parseInt(item.mouth) - 1
                    if(index < maxMouth){
                        fertObj[item.dosageName][index] = item.weight
                    }
                })
                for(let key in fertObj) {
                    for(let i = 0; i < maxMouth; i++) {
                        if(!fertObj[key][i]) {
                            fertObj[key][i] = 0
                        }
                    }
                    autoFertMonth.values.push(fertObj[key])
                    autoFertMonth.names.push(key)
                }
            }

            let pickDose = { data: [] }
            if(data && data.FertilizeList && data.FertilizeList.length > 0) {
                pickDose = filter.obj(data.FertilizeList, 'cropName', 'weight')
            }
            let pickMonth = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                names: [],
                values: []
            }
            if(data && data.FertilizeByMouthList) {
                let fertObj = {}
                data.FertilizeByMouthList.forEach(item => {
                    if(!fertObj[item.cropName]) {
                        fertObj[item.cropName] = []
                    }
                    let index = parseInt(item.mouth) - 1
                    if(index < maxMouth){
                        fertObj[item.cropName][index] = item.weight
                    }
                })
                for(let key in fertObj) {
                    for(let i = 0; i < maxMouth; i++) {
                        if(!fertObj[key][i]) {
                            fertObj[key][i] = 0
                        }
                    }
                    pickMonth.values.push(fertObj[key])
                    pickMonth.names.push(key)
                }
            }
            let pestDose = { data: [] }
            if(data && data.PlantProList && data.PlantProList.length > 0) {
                pestDose = filter.obj(data.PlantProList, 'farmType', 'count')
            }

            let pestMonth = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                names: [],
                values: []
            }
            if(data && data.PlantProByMouthList) {
                let pestObj = {}
                data.PlantProByMouthList.forEach(item => {
                    if(!pestObj[item.farmType]) {
                        pestObj[item.farmType] = []
                    }
                    let mouth = parseInt(item.mouth) - 1
                    if(mouth < maxMouth){
                        pestObj[item.farmType][mouth] = item.count
                    }
                })
                for(let key in pestObj) {
                    for(let i = 0; i < maxMouth; i++) {
                        if(!pestObj[key][i]) {
                            pestObj[key][i] = 0
                        }
                    }
                    pestMonth.values.push(pestObj[key])
                    pestMonth.names.push(key)
                }
            }
            autoFertDose.unit = 'KG'
            autoFertMonth.unit = 'KG'
            pickDose.unit = 'KG'
            pickMonth.unit = 'KG'
            pestDose.unit = '次'
            pestMonth.unit = '次'
            autoFertDose.data.sort(function (a, b) {
                return b.value - a.value;
            })
            pickDose.data.sort(function (a, b) {
                return b.value - a.value;
            })
            pestDose.data.sort(function (a, b) {
                return b.value - a.value;
            })
            autoFertMonth.titles = autoFertMonth.titles.splice(0, maxMouth)
            pickMonth.titles = pickMonth.titles.splice(0, maxMouth)
            pestMonth.titles = pestMonth.titles.splice(0, maxMouth)
            context.commit( types.FARMING_GET_DATA, {
                plantDistribute: plantDistribute,
                autoFertDose: autoFertDose,
                autoFertMonth: autoFertMonth,
                pickDose: pickDose,
                pickMonth: pickMonth,
                pestDose: pestDose,
                pestMonth: pestMonth
            } )
        })
    }
}