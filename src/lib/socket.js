import store from '@/store/index'
import ns from '@/store/constants/ns'
import types from '@/store/constants/types'
import { formatTime } from '@/lib/util'
import { ifError } from 'assert';
function getInfo(page, data, dispatch) {
    store.dispatch( 'ajax', {
        method: 'post',
        url: '/orchard/bs/v1/getInfo',
        data: {
            page: page,
            type: data.type,
            city: data.prov ? data.name : '',
            variety: data.key,
            prov: data.prov ? data.prov : data.name,
            gardenId: data.gardenId,
            time: data.time,
            spinner: true,
        }
    }).then((res) => {
        if(res && (res.count || res.data)) {
            data.spinner = true
            store.dispatch( dispatch, data )
        }
    })
}
//trace.yufengtek.com/
//192.168.2.169:8090/
//orchardtest.yufengtek.com
//let link = 'ws://' + document.domain + '/websocket'
//if(document.location.protocol === 'https:') {
//   link = 'wss://' + document.domain + '/websocket'
//}
//const link = 'ws://192.168.2.169:8090/websocket'
//const link = 'ws://orchardtest.yufengtek.com/websocket'
//const link = 'ws://orchdbs.yufengtek.com:8890/websocket'
let link = 'ws://' + document.domain + '/websocket'
if(document.location.protocol === 'https:') {
    link = 'wss://' + document.domain + '/websocket'
}
//link = 'ws://192.168.2.169:8090/websocket'
const socket = new WebSocket(link)
socket.onopen = function (e) {
    console.log('web socket open...')
}
socket.onmessage = function (e) {
    // console.log('on message....', e)
    try {
        if(!e.data || e.data === '连接成功') {
            console.log(e.data)
        }else {
            const data = JSON.parse(e.data)
            if(!data) return 
            const postData = store.state.map.postData
            if(store.state.currRouter.to === "home") {
                getInfo('home', postData, ns.HOME + '/' + types.HOME_GET_DATA)
            }else if(data.page === "warehouse" && store.state.currRouter.to === "warehouse") {
                getInfo(data.page, postData, ns.WAREHOUSE + '/' + types.WAREHOUSE_GET_DATA)
            }else if(data.page === "farming" && store.state.currRouter.to === "farming") {
                getInfo(data.page, postData, ns.FARMING + '/' + types.FARMING_GET_DATA)
            }else if(data.page === "plant" && store.state.currRouter.to === "plant") {
                getInfo(data.page, postData, ns.PLANT + '/' + types.PLANT_GET_DATA)
            }else if(data.page === "monitor" && store.state.currRouter.to === "monitor") {
                getInfo(data.page, postData, ns.MONITOR + '/' + types.MONITOR_GET_DATA)
            }

            if(data.orisechAddr && store.state.currRouter.to === "origin") {
                let date = data.time ? new Date(data.time) : new Date()
                let addr = data.orisechAddr
                if(addr) {
                    if(data.orisechProv) {
                        addr = addr.replace(new RegExp(data.orisechProv, 'g'), '')
                    }
                    if(data.orisechCity) {
                        addr = addr.replace(new RegExp(data.orisechCity, 'g'), '')
                    }
                }
                let obj = {
                    date: formatTime(date, 'yyyy-MM-dd'),//year + '-' + month + '-' + day,
                    time: formatTime(date, 'hh:mm'),//hours + ':' + minutes,
                    addr: addr,
                    city: data.orisechCity,
                    prov: data.orisechProv,
                    town: '',
                    village: '',
                    name: data.orisech_cropname,
                    phone: data.phoneNumber,
                    long: data.orisechGislong,
                    late: data.orisechGislate,
                }
                store.commit(ns.ORIGIN + '/' + types.ORIGIN_SET_TIME_ADDRESS, obj)
            }
        }
    } catch (error) {
        console.log(error)
    }
}

socket.onerror = function (e) {
    console.log('socket error....', e)
}

socket.onclose = function (e) {
    this.onopen()
    console.log('socket close....', e)
}


export default socket
