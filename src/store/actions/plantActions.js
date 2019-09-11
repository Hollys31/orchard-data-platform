import types from '@/store/constants/types'
import api from '@/lib/api'
import filter from '@/lib/filter'
import point from '@/lib/point.json'
const method = api.localData? 'get' : 'post'
export default {
    [types.PLANT_GET_DATA] (context, amount, spinner = true) { //获取种植分布页面数据
        const that = this
        const url  = api.localData? api.postPlantData : api.postPlantData + amount.type
        that.dispatch( 'ajax', {
            method: method,
            url: url,
            data: {address: amount.name, Variety: amount.key, prov: amount.prov}
        }, spinner ).then((data) => {
            that.commit( 'map/' + types.MAP_SET_POST_DATA, amount ) //保存当前页面的状态
            if(data && data.data) {
                data = data.data
            }
            //获取总体数据
            let numberOfOrchard = data.count? data.count : 0
            let plantArea = data.area ? data.area : 0
            let numberOfPlant = data.cropcount? data.cropcount : 0
            let distributionOfProvinces = 0
            //种植分布情况
            let plantDistribute = []
            if(data && data.AreaList && data.AreaList.length > 0) {
                let arr = []
                data.AreaList.forEach(item => {
                    if(item.Name && item.area) {
                        if(point[item.Name]) {
                            arr.push([point[item.Name][0], point[item.Name][1], item.area, item.Name])
                            if(item.area) {
                                distributionOfProvinces++
                            }
                        }
                    }
                })
                plantDistribute = arr
            }
            
            let fruiterAgeDistribute = { titles: [], values: [] }
            if(data && data.TreeAge && data.TreeAge.length > 0) {
                let allIs0 = true //全部都是0
                data.TreeAge.sort(function (a, b) {
                    return parseInt(b.age) - parseInt(a.age)
                })
                data.TreeAge.forEach(item => { 
                    item.area = parseInt(item.area)
                    if(item.area){
                        allIs0 = false
                    }
                })
                if(!allIs0){
                    fruiterAgeDistribute = filter.arr(data.TreeAge, 'age', 'area')
                }
            }
            fruiterAgeDistribute.unit = '亩'
            
            let breedAreaDistribute = {data:[]}
            if(data && data.TypeArea && data.TypeArea.length > 0) {
                if(data.TypeArea[0].cropName) {
                    breedAreaDistribute = filter.obj(data.TypeArea, 'cropName', 'area')
                }else if(data.TypeArea[0].Name) {
                    breedAreaDistribute = filter.obj(data.TypeArea, 'Name', 'area', 2, false)
                }
            }
            breedAreaDistribute.unit = '亩'
            breedAreaDistribute.data.sort(function (a, b) {
                return parseFloat(b.value) - parseFloat(a.value);
            })
            let orchardAreaRank = { titles: [], values: [] }
            if(data && data.Ranking && data.Ranking.length > 0) {
                data.Ranking.sort(function (a, b) {
                    return  parseFloat(a.area) - parseFloat(b.area)
                })
                orchardAreaRank = filter.arr(data.Ranking, 'gardenName', 'area')
            }
            orchardAreaRank.unit = '亩'
            let plantQualityDistribute = {data:[]}
            if(data && data.Level && data.Level.length > 0) {
                const items = ['特级', '一级', '二级', '三级']
                const objArr = filter.obj(data.Level, 'type', 'area')
                items.forEach(item => {
                    objArr.data.forEach(obj => {
                        if(item === obj.name) {
                            plantQualityDistribute.data.push(obj)
                        }
                    })
                })
            }
            plantQualityDistribute.unit = 'KG'
            //plantQualityDistribute.data.sort(function (a, b) { return b.value - a.value;})
            context.commit( types.PLANT_GET_DATA, {
                plantDistribute: plantDistribute,
                numberOfOrchard: numberOfOrchard,
                plantArea: plantArea,
                numberOfPlant: numberOfPlant,
                distributionOfProvinces: distributionOfProvinces,
                fruiterAgeDistribute: fruiterAgeDistribute,
                breedAreaDistribute: breedAreaDistribute,
                orchardAreaRank: orchardAreaRank,
                plantQualityDistribute: plantQualityDistribute
            } )
        })
    }
}