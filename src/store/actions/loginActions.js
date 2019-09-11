import types from '@/store/constants/types'
import api from '@/lib/api'
const method = api.localData? 'get' : 'post'
export default {
    [types.LOGIN_POST_USER_IN] (context, amount) { //用户登录
        const that = this
        that.dispatch( 'ajax', {
            method: method,
            url: api.login,
            data: {username: amount.userName, password: amount.password, imageCode: amount.verifyCode}
        } ).then((data) => {
            if(data) {
                if(data.code == 200) {
                    this.commit( types.SWITCH_LOADING, true)
                    context.commit( types.LOGIN_SET_LOG_STATUS, 1 )
                    const gardenId = parseInt(data.garden_id)
                    this.commit( types.SET_USER_TYPE, {type: parseInt(data.user_type), id: gardenId})
                    localStorage.setItem('user_type', data.user_type)
                    localStorage.setItem('garden_id', gardenId ? gardenId : '')
                }else {
                    context.commit( types.LOGIN_SET_VERIFY_CODE) //登录失败 重新加载验证码
                }
                context.commit( types.LOGIN_SET_LOG_MSG, data.msg )
                setTimeout(() => {
                    context.commit( types.LOGIN_SET_LOG_MSG, '' )
                }, 5000)
            }
        })
    },
    [types.LOGIN_GET_USER_OUT] (context) { //用户登出
        const that = this
        that.dispatch( 'ajax', {
            method: 'get',
            url: api.logout,
            data: {url: window.origin + '/#/login'}
        } ).then((data) => {
            context.commit( types.LOGIN_SET_LOG_STATUS, '' )
        })
    },
}