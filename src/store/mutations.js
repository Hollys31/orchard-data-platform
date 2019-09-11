import types from '@/store/constants/types'
export default {
    [types.SWITCH_LOADING] (state, isShow) {
        state.loading = isShow
    },
    [types.SET_USER_TYPE] (state, payload) {
        state.userType = payload.type
        state.orchardId = payload.id
    },
    [types.SET_CAMERA_TOKEN] (state, payload) {
        state.cameraToken = payload
    },
    [types.GET_WINDOW_SIZE] (state) {
        const width = window.innerWidth
        const height = window.innerHeight
        const rm = parseInt(width / 192)
        state.windowSize = {
            width: width > 1024? width : 1024 ,
            height: height > 768? height : 768,
            rm: rm
        }
        const html = document.documentElement
        html.setAttribute('style', 'font-size: ' + (4 * rm) + 'px;')
        state.windowResizeState++
    },
    [types.SET_CURR_ROUTER] (state, payload) {
        const currRouter = state.currRouter
        currRouter.from = payload.from
        currRouter.to = payload.to
        currRouter.query = payload.query
        currRouter.instance = payload.instance
        if (!currRouter.to) {
            state.loading = false
        }
    },
    [types.SET_DATA_LOADING_TIPS] (state, payload) {
        state.tips = payload
    },
    [types.SET_FLASH] (state, payload) {
        state.flash = payload
    }
}