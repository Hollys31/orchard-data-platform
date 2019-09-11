import types from '@/store/constants/types'
export default {
    //设置溯源分布数据
    [types.ORIGIN_SET_DISTRIBUTE_DATA] (state, payload) {
        state.originDistribute = payload
    },
    //设置溯源城市排行数据
    [types.ORIGIN_SET_RANK_DATA] (state, payload) {
        state.originRank = payload
    },
    //设置溯源次数数据
    [types.ORIGIN_SET_FREQUENCY_DATA] (state, payload) {
        state.originFrequency = payload
    },
    //设置溯源地址数据
    [types.ORIGIN_SET_ADDRESS_DATA] (state, payload) {
        state.originAddress = payload.originAddress
        state.maxPageNum = payload.maxPageNum
    },
    //设置指定日期的溯源地址
    [types.ORIGIN_SET_DATE_ADDRESS] (state, payload) {
        let len = state.originAddress.length - 1
        for(let i = len; i >= 0; i--) {
            let beforDate = state.originAddress[i].date
            let afterDate = payload.date
            let beforYear = parseInt(beforDate)
            let beforMonth = parseInt(beforDate.slice(5, 7))
            let beforDay = parseInt(beforDate.slice(8, 10))
            let afterYear = parseInt(afterDate)
            let afterMonth = parseInt(afterDate.slice(5, 7))
            let afterDay = parseInt(afterDate.slice(8, 10))
            if(beforYear > afterYear) {
                state.originAddress.splice(i + 1, 0, payload)
                break
            }else if(beforYear === afterYear && beforMonth > afterMonth) {
                state.originAddress.splice(i + 1, 0, payload)
                break
            }else if(beforYear === afterYear && beforMonth === afterMonth && beforDay > afterDay) {
                state.originAddress.splice(i + 1, 0, payload)
                break
            }
        }
    },
    //设置下一页溯源地址
    [types.ORIGIN_SET_NEXT_PAGE] (state, payload) {
        let len = state.originAddress.length - 1
        for(let i = len; i >= 0; i--) {
            let beforDate = state.originAddress[i].date
            let afterDate = payload.date
            let beforYear = parseInt(beforDate)
            let beforMonth = parseInt(beforDate.slice(5, 7))
            let beforDay = parseInt(beforDate.slice(8, 10))
            let afterYear = parseInt(afterDate)
            let afterMonth = parseInt(afterDate.slice(5, 7))
            let afterDay = parseInt(afterDate.slice(8, 10))
            if(beforYear > afterYear) {
                state.originAddress.splice(i + 1, 0, payload)
                break
            }else if(beforYear === afterYear && beforMonth > afterMonth) {
                state.originAddress.splice(i + 1, 0, payload)
                break
            }else if(beforYear === afterYear && beforMonth === afterMonth && beforDay > afterDay) {
                state.originAddress.splice(i + 1, 0, payload)
                break
            }else if(beforYear === afterYear && beforMonth === afterMonth && beforDay === afterDay) {
                state.originAddress[i].list = state.originAddress[i].list.concat(payload.list)
                break
            }
        }
    },
    [types.ORIGIN_SET_TIME_ADDRESS] (state, payload) {
        if(state.originAddress[0] && state.originAddress[0].date === payload.date){
            state.originAddress[0].list.unshift(payload)
        }else {
            state.originAddress.unshift({
                date: payload.date,
                list: [payload]
            })
        }
        const len = state.originFrequency.values.length - 1
        const of = state.originFrequency.values[len] + 1
        state.originFrequency.values.splice(len, 1, of)
        for(let i = 0; i < state.originDistribute.length; i++) {
            let od = state.originDistribute[i][2] + 1
            let or = state.originRank.data[i].value + 1
            if(state.originDistribute[i][3] === payload.city) {
                state.originDistribute.splice(i, 1, [payload.long, payload.late, od, payload.city, payload.prov])
                if(state.originRank.data[i]){
                    state.originRank.data.splice(i, 1, {name: payload.city, value: or})
                }
                return
            }
        }
        state.originDistribute.push([payload.long, payload.late, 1, payload.city])
        state.originRank.data.push({name: payload.city, value: 1})
    }
}