import types from '@/store/constants/types'
export default {
    //设置登录状态
    [types.LOGIN_SET_LOG_STATUS] (state, payload) {
        document.cookie = 'status=' + payload
        state.status = payload
    },
    //设置登录返回的信息
    [types.LOGIN_SET_LOG_MSG] (state, payload) {
        state.msg = payload
    },
    //设置验证码
    [types.LOGIN_SET_VERIFY_CODE] (state) {
        state.verifyCodeTime = new Date().getTime()
    },
}