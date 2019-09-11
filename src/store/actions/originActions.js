import types from '@/store/constants/types'
import api from '@/lib/api'
import filter from '@/lib/filter'
import { formatTime } from '@/lib/util'
const method = api.localData? 'get' : 'post'
export default {
    [types.ORIGIN_GET_DATA] (context, amount, spinner = true) { //获取溯源页面数据
        const that = this
        that.dispatch( 'ajax', {
            method: method,
            url: api.postOriginData,
            data: {date: amount.date, Variety: amount.key}
        }, spinner ).then((data) => {
            that.commit( 'map/' + types.MAP_SET_POST_DATA, {page: 'origin'} ) //保存当前页面的状态
            if(data && data.data) {
                data = data.data
            }
            let maxMouth = new Date().getMonth() + 1
            //获取溯源城市排行，溯源次数统计数据
            /**
             * originCity: Array(2)
            0: {gislate: 25.855141, city: "赣州市", count: 21, gislong: 114.822862}
            1: {gislate: 12, city: "广州市", count: 1, gislong: 12}
             */
            let originDistribute = []
            let originRank = {data: []}
            if(data && data.originCity && data.originCity.length > 0) {
                originDistribute = filter.coord(data.originCity, 'gislong', 'gislate', 'count', 'city', 'prov')
                originRank = filter.obj(data.originCity, 'city', 'count')
            }
            originDistribute.sort(function (a, b) {
                return b[2] - a[2]
            })
            originRank.data.sort(function (a, b) {
                return b.value - a.value
            })
            if(originRank.data.length > 8){
                originRank.data = originRank.data.splice(0, 9)
                originRank.data.push({name: '...', value: ''})
            }
            originDistribute.forEach(item => {
                if(item[3] === '香港特别行政区') {
                    item[3] = '香港'
                }
            })
            originRank.data.forEach(item => {
                if(item.name === '香港特别行政区') {
                    item.name = '香港'
                }
            })
            let originFrequency = {
                titles: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                values: []
            }
            if(data && data.originCount && data.originCount.length > 0) {
                data.originCount.forEach(item => {
                    let mouth = parseInt(item.osmonth) - 1
                    if(mouth < maxMouth){
                        originFrequency.values[mouth] = item.count
                    }
                })
                for(let i = 0; i < maxMouth; i++) {
                    if(!originFrequency.values[i]){
                        originFrequency.values[i] = 0
                    }
                }
            }
            originFrequency.unit = '次'
            originFrequency.titles = originFrequency.titles.splice(0, maxMouth)
            originRank.unit = '次'
            context.commit( types.ORIGIN_SET_RANK_DATA, originRank )
            context.commit( types.ORIGIN_SET_DISTRIBUTE_DATA, originDistribute )
            context.commit( types.ORIGIN_SET_FREQUENCY_DATA, originFrequency )
            
            //获取溯源城市排行，溯源次数统计数据
            let originAddress = []
            if(data && data.originAddress && data.originAddress.dataList instanceof Array) {
                let obj = {}
                data.originAddress.dataList.forEach(item => {
                    let date = formatTime(new Date(item.date), 'yyyy-MM-dd')
                    if(!obj[date]) {
                        obj[date] = []
                    }
                    let addr = item.addr
                    let re
                    if(addr) {
                        if(item.prov) {
                            re = new RegExp(item.prov, 'g')
                            addr = addr.replace(re, '')
                        }
                        if(item.city) {
                            re = new RegExp(item.city, 'g')
                            addr = addr.replace(re, '')
                        }
                        if(item.town) {
                            re = new RegExp(item.town, 'g')
                            addr = addr.replace(re, '')
                        }
                        if(item.village) {
                            re = new RegExp(item.village, 'g')
                            addr = addr.replace(re, '')
                        }
                    }
                    obj[date].push({
                        time: item.time,
                        addr: addr,
                        city: item.city,
                        prov: item.prov,
                        town: item.town,
                        village: item.village,
                        name: item.cropName,
                        phone: item.phone
                    })
                })
                for(let key in obj) {
                    originAddress.push({
                        date: key,
                        list: obj[key]
                    })
                }
            }
            context.commit( types.ORIGIN_SET_ADDRESS_DATA, {originAddress: originAddress, maxPageNum: data.originAddress.page.pages})
        })
    },

    [types.ORIGIN_GET_DATE_ADDRESS] (context, amount) { //获取指定日期的溯源地址
        const that = this
        that.dispatch( 'ajax', {
            method: method,
            url: api.postAddressData,
            data: {time: amount.time}
        } ).then((data) => {
            if(!data) {
                return
            }
            data = data.data
            let originAddress = []
            if(data && data.originAddress && data.originAddress.length > 0) {
                let obj = {}
                data.originAddress.forEach(item => {
                    let date = formatTime(new Date(item.date), 'yyyy-MM-dd')
                    if(!obj[date]) {
                        obj[date] = []
                    }
                    let addr = item.addr
                    if(addr) {
                        if(item.prov) {
                            addr = addr.replace(new RegExp(item.prov, 'g'), '')
                        }
                        if(item.city) {
                            addr = addr.replace(new RegExp(item.city, 'g'), '')
                        }
                        if(item.town) {
                            addr = addr.replace(new RegExp(item.town, 'g'), '')
                        }
                        if(item.village) {
                            addr = addr.replace(new RegExp(item.village, 'g'), '')
                        }
                    }
                    obj[date].push({
                        time: formatTime(new Date(item.date), 'hh:mm'),
                        addr: addr,
                        city: item.city,
                        prov: item.prov,
                        town: item.town,
                        village: item.village,
                        name: item.cropName,
                        phone: item.phone
                    })
                })
                for(let key in obj) {
                    originAddress.push({
                        date: key,
                        list: obj[key]
                    })
                }
            }
            if(originAddress[0]) {
                context.commit( types.ORIGIN_SET_DATE_ADDRESS, originAddress[0] )
            }
        })
    },

    [types.ORIGIN_GET_NEXT_PAGE] (context, amount) { //获取下一页溯源地址
        const that = this
        that.dispatch( 'ajax', {
            method: method,
            url: api.postNextPage,
            data: {Variety: '', date: '', pageNum: amount.page, pageSize: 20}
        } ).then((data) => {
            if(!data) {
                return
            }
            data = data.data
            let originAddress = []
            if(data && data.dataList && data.dataList instanceof Array) {
                let obj = {}
                data.dataList.forEach(item => {
                    let date = formatTime(new Date(item.date), 'yyyy-MM-dd')
                    if(!obj[date]) {
                        obj[date] = []
                    }
                    let addr = item.addr
                    if(addr) {
                        if(item.prov) {
                            addr = addr.replace(new RegExp(item.prov, 'g'), '')
                        }
                        if(item.city) {
                            addr = addr.replace(new RegExp(item.city, 'g'), '')
                        }
                        if(item.town) {
                            addr = addr.replace(new RegExp(item.town, 'g'), '')
                        }
                        if(item.village) {
                            addr = addr.replace(new RegExp(item.village, 'g'), '')
                        }
                    }
                    obj[date].push({
                        time: formatTime(new Date(item.date), 'hh:mm'),
                        addr: addr,
                        city: item.city,
                        prov: item.prov,
                        town: item.town,
                        village: item.village,
                        name: item.cropName,
                        phone: item.phone
                    })
                })
                for(let key in obj) {
                    originAddress.push({
                        date: key,
                        list: obj[key]
                    })
                }
            }
            originAddress.forEach(item => {
                context.commit( types.ORIGIN_SET_NEXT_PAGE, item )
            })
        })
    }
}