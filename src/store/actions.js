import axios from 'axios'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import router from '@/router.js'
import api from '@/lib/api'
const nameSpaced = ns.LOGIN + '/'
const Qs = require('qs')
const CancelToken = axios.CancelToken
axios.defaults.timeout = 10000
//axios.defaults.headers.common['Authorization'] = 'token'
export default {
    ajax (context, amount) {
        if(!amount.data || !amount.data.spinner){
            context.commit(types.SWITCH_LOADING, true)
        }
        context.commit(types.SET_DATA_LOADING_TIPS, '数据加载中。。。')
        const source = CancelToken.source()

        function setTips(status, msg) {
            if(status == 404) {
                context.commit(types.SET_DATA_LOADING_TIPS, msg? status + msg : '404 找不到服务器文件')
                router.push('error')
            }else if(status >= 500) {
                context.commit(types.SET_DATA_LOADING_TIPS, msg? status + msg : '500 服务器错误')
                router.push('error')
            }else {
                context.commit(types.SET_DATA_LOADING_TIPS, msg? status + msg : status)
            }
        }

        function callback(response) {
            context.commit(types.SWITCH_LOADING, false)
            if (response.status === 200) {
                if(response.data.status && response.data.status != 200) {
                    if(response.data.status == 206) { //登录状态失效
                        document.cookie = 'status='
                        localStorage.removeItem('user_type')
                        localStorage.removeItem('garden_id')
                        context.commit(nameSpaced + types.LOGIN_SET_LOG_STATUS, false)
                        return false
                    }
                    if(response.data.msg) {
                        setTips(response.data.status, response.data.msg)
                    }else {
                        setTips(response.data.status)
                    }
                }else {
                    context.commit(types.SET_DATA_LOADING_TIPS, '暂无数据')
                    return response.data
                }
            }else {
                setTips(response.status)
            }
            return false
        }
        function errorHandler(error) {
            context.commit(types.SWITCH_LOADING, false)
            if (error.response) {
                // 请求已发出，但服务器响应的状态码不在 2xx 范围内
                setTips(error.response.status)
            }
            if(/timeout/.test(error.message)) {
                source.cancel('timeout of 10000ms exceeded') //取消请求
                setTips('', '请求超时，请刷新重试！')
            }
            console.log('Error', error.message)   
            return false
        }

        if(typeof amount === 'string') { //只传url 默认get请求
            return axios.get( amount, {cancelToken: source.token} ).then((response) => {
                return callback(response)
            }).catch((error) => {
                return errorHandler(error)
            })
        }else if(amount.method === 'get') {
            return axios.get( amount.url, { params: amount.data }, {cancelToken: source.token}).then((response) => {
                return callback(response)
            }).catch((error) => {
                return errorHandler(error)
            })
        }else if(amount.method === 'post') {
            return axios.post( amount.url, Qs.stringify(amount.data), {cancelToken: source.token} ).then((response) => {
                return callback(response)
            }).catch((error) => {
                return errorHandler(error)
            })
        }
    },

    [types.GET_CAMERA_TOKEN] (context) { //获取摄像头token
        const that = this
        that.dispatch('ajax', api.getCameraToken).then((data) => {
            if(data && data.data) {
                context.commit( types.SET_CAMERA_TOKEN, data.data )
            }
        })
    }
}