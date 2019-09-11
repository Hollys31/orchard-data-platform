import types from '@/store/constants/types'
import api from '@/lib/api'
import point from '@/lib/point.json'
const method = api.localData? 'get' : 'post'
export default {
    [types.WAREHOUSE_GET_DATA] (context, amount, spinner = true) { //获取出库入库页面数据
        const that = this
        const url  = api.localData? api.postWarehouseData : api.postWarehouseData + amount.type
        that.dispatch( 'ajax', {
            method: method,
            url: url,
            data: {address: amount.name, Variety: amount.key, prov: amount.prov}
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
            let dayInfo = {unit: 'KG'}
            if(data && data.InStock) {
                dayInfo.inDay = data.InStock
            }
            if(data && data.OutStock) {
                dayInfo.outDay = data.OutStock
            }
            if(data && data.Surplus) {
                dayInfo.surplus = data.Surplus
            }
            let inYear = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                values: [],
                unit: 'KG'
            }
            if(data && data.InStockThisYear && data.InStockThisYear.length > 0) {
                data.InStockThisYear.forEach(item => {
                    let mouth = parseInt(item.date) - 1
                    if(mouth < maxMouth){
                        inYear.values[mouth] = item.weight
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!inYear.values[i]){
                        inYear.values[i] = 0
                    }
                }
            }

            let outYear = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                values: [],
                unit: 'KG'
            }
            if(data && data.OutStockThisYear && data.OutStockThisYear.length > 0) {
                data.OutStockThisYear.forEach(item => {
                    let mouth = parseInt(item.date) - 1
                    if(mouth < maxMouth){
                        outYear.values[mouth] = item.weight
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!outYear.values[i]){
                        outYear.values[i] = 0
                    }
                }
            }
            let lastInYear = []
            if(data && data.InStockLastYear && data.InStockLastYear.length) {
                data.InStockLastYear.forEach(item => {
                    let mouth = parseInt(item.date) - 1
                    if(mouth < maxMouth){
                        lastInYear[mouth] = item.weight
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!lastInYear[i]){
                        lastInYear[i] = 0
                    }
                }
            }

            let lastOutYear = []
            if(data && data.OutStockLastYear && data.OutStockLastYear.length) {
                data.OutStockLastYear.forEach(item => {
                    let mouth = parseInt(item.date) - 1
                    if(mouth < maxMouth){
                        lastOutYear[mouth] = item.weight
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!lastOutYear[i]){
                        lastOutYear[i] = 0
                    }
                }
            }
            let inHistory = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                values: [inYear.values, lastInYear,],
                names: ['2019', '2018'],
                unit: 'KG'
            }
            let outHistory = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                values: [outYear.values, lastOutYear,],
                names: ['2019', '2018'],
                unit: 'KG'
            }
            inYear.titles = inYear.titles.splice(0, maxMouth)
            outYear.titles = outYear.titles.splice(0, maxMouth)
            inHistory.titles = inHistory.titles.splice(0, maxMouth)
            outHistory.titles = outHistory.titles.splice(0, maxMouth)
            context.commit( types.WAREHOUSE_GET_DATA, {
                plantDistribute: plantDistribute,
                dayInfo: dayInfo,
                inYear: inYear,
                outYear: outYear,
                inHistory: inHistory,
                outHistory: outHistory,
            })
        })
    }
}