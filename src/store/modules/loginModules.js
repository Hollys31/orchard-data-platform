import actions from '@/store/actions/loginActions'
import mutations from '@/store/mutations/loginMutations'
import { cookie } from '@/lib/util'
const status = cookie('status')
export default {
    namespaced: true,
    state: {
        status: status, //登录状态
        msg: '', //登录返回信息
        verifyCodeTime: new Date().getTime(), //验证码
    },
    actions,
    mutations
}