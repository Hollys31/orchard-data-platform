<template>
<div class="camera">
    <div class="device-wrap">
        <ul ref="items" class="device-list" :style="'width: ' + cameraList.length*100 + 'px;left: 0'">
            <li v-for="(camera, index) in cameraList" :key="index" @click="changeVideo(index)" :class="[index == checkedCamera? camera[4] + '-checked' : '', camera[4]]">{{camera[7]}}</li>
        </ul>
    </div>
    <div class="cut">
        <div class="cut-left iconfont" @click="cut(1)">&#xe605;</div>
        <div class="cut-right iconfont" @click="cut(0)">&#xe62a;</div>
    </div>
    <div ref="camera" class="video" :class="{full: isFull}"  :style="isFull ? 'top:' + ($store.state.windowSize.width / 19.2  + 8) + 'px' : ''">
        <div class="panorama" id="panorama" ref="panorama">
            <div v-show="imageUrl" class="zoom iconfont" @click="changeFull()">{{isFull? '&#xe609;' : '&#xeaef;'}}</div>
        </div>
        <div class="video-flash" ref="flash"><div v-show="flashUrl" class="zoom iconfont" @click="changeFull()">{{isFull? '&#xe609;' : '&#xeaef;'}}</div></div>
        <div class="video-html5" ref="html5"><div v-show="html5Url" class="zoom iconfont" @click="changeFull()">{{isFull? '&#xe609;' : '&#xeaef;'}}</div></div>
        <div class="video-live" ref="live">
            <div style="z-index: 1; position: absolute; width: 100%; height: 100%; top: 0; left: 0 overflow: hidden;">
                <object style="position: absolute;top: 0;left: 0;" classid="clsid:54FC7795-1014-4BF6-8BA3-500C61EC1A05" id="EZUIKit" width="100%" height="100%" name="EZUIKit" ></object>
            </div>
            <div class="live-control">
                <div v-show="isLive" class="live-zoom iconfont" @click="changeFull()">{{isFull? '&#xe609;' : '&#xeaef;'}}</div>
                <div class="live-play iconfont" @click="livePlay()">{{isPlaying ? '&#xe6db;' : '&#xe604;'}}</div>
                <div class="live-talk iconfont" @click="liveTalk()" :style="isTalking ? 'color: #fff;' : 'color: #888;'">&#xe62d;</div>
                <div id="showPanel" class="live-tips"></div>
                <iframe id="newiframe" style="background-color:transparent; width:100%; height:100%; position: absolute; top: 0; left: 0; z-index: 2; filter:alpha(opacity=0);" allowtransparency="true" frameborder="0"></iframe>
            </div>
            
            
        </div>
        <div v-show="html5Url" ref="controls" class="controls" :class="{'not-playing': !isPlaying}">
            <div v-show="!isPlaying && !imageUrl" class="play-button" @click="play()"></div>
            <div v-show="isPlaying && !imageUrl" class="pause-button iconfont" @click="pause()">&#xe6db;</div>
        </div>
    </div>
    <!--<Talk v-if="deviceSerial && isPlaying && isFull && showTalk" />-->
    <CameraCtrl v-if="deviceSerial && isPlaying && isFull" :deviceSerial="deviceSerial" />
</div>
</template>

<script>
import NoData from '@/components/NoData'
//import Talk from './Talk'
import CameraCtrl from './CameraCtrl'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
import videojs from 'video.js'
import { setTimeout, setInterval, clearInterval } from 'timers'
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'Camera',
    components: { NoData, CameraCtrl },
    data() {
        return {
            width: 0, //视频宽度
            height: 0, //视频高度
            video: null, //video.js实例
            viewer: null, //PhotoSphereViewer实例
            flash: null, //flash实例
            imageUrl: '', //360全景图片
            flashUrl: '', //flash视频链接
            html5Url: '', //html5视频链接
            deviceSerial: '', //当前选中设备的编号
            isPlaying: false, //视频是否播放中
            isFull: false, //是否视频放大状态
            showTalk: false, //是否显示对讲操作界面
            isLive: false, //是否是直播视频
            isTalking: false,
            liveData: null,
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            checkedCamera: state => state.checkedCamera,
            cameraList: state => state.cameraList,
        }),
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            const that = this
            if(that.imageUrl) {
                that.setVideoSize()
                setTimeout(function() {
                    that.$refs.panorama.setAttribute('style', 'width: ' + that.width + 'px; height: ' + that.height + 'px;')
                    that.viewer.resize({width: that.width, height: that.height})
                }, 50)
            }else if(that.flashUrl) {
                setTimeout(function() {
                    that.init()
                }, 50)
            }
        },
        'checkedCamera' () {
            const that = this
            that.isPlaying = true
            const node = that.$refs.items
            const parentStyle = node.parentNode.getBoundingClientRect()
            const count = that.cameraList.length - parseInt(parentStyle.width/100)
            if(count > 0) {
                node.style.left = that.checkedCamera < count ? -that.checkedCamera * 100 + 'px' : -count * 100 + 'px'
            }
            that.init()
        },
        'cameraList' () {
            const that = this
            that.isPlaying = false
            if(that.checkedCamera) {
                that.$store.commit(nameSpaced + types.MONITOR_SET_CAMERA_CABLE, 0)
            }else {
                that.init()
            }
        }
    },
    mounted() {
        const that = this
        if(HaveActiveX) {
            that.showTalk = true
        }
    },
    methods: {
        init () {
            const that = this
            if(!that.cameraList.length) {
                return
            }

            if(that.isPlaying) {
                if(that.flashUrl && that.flash) {
                    that.flash.stop()
                }

                if(that.isLive) {
                    StopPlay()
                }
                if(that.isTalking) {
                    StopTalk()
                }
            }

            that.setVideoSize()
            that.deviceSerial = ''
            that.imageUrl = ''
            that.flashUrl = ''
            that.html5Url = ''
            that.isLive = false
            that.isTalking = false
            that.$refs.panorama.setAttribute('style', 'width: 0; height: 0;z-index: -1;')
            that.$refs.flash.setAttribute('style', 'width: 0; height: 0;z-index: -1;')
            that.$refs.html5.setAttribute('style', 'width: 0; height: 0;z-index: -1;')
            that.$refs.live.setAttribute('style', 'width: 0; height: 0;z-index: -1;')
            that.$refs.controls.setAttribute('style', 'width: 100%; height: 100%;')

            const camera = that.cameraList[that.checkedCamera]
            if(camera) {    
                //直播对讲视频
                if(/D/.test(camera[6]) && HaveActiveX && camera[4] === 'A' && camera[6] != 'D32791336') {
                    that.isLive = true
                    that.isTalking = true
                    that.isPlaying = true

                    that.$refs.live.setAttribute('style', 'width: 100%; height: 100%;')

                    that.liveData = {
                        appkey: '62e88b123fe94e0f8972485c5f5aead6',
                        accesstoken: that.$store.state.cameraToken,
                        ezurl: 'ezopen://' + camera[9] + '@open.ys7.com/' + camera[6] + '/1.hd.live'
                    }
                    StartPlay(that.liveData)
                    StartTalk()
                    return
                }

                //全景摄像头
                if(camera[4] === 'C') {
                    that.imageUrl = camera[5]
                    that.isPlaying = false
                    that.$refs.panorama.setAttribute('style', 'width: ' + that.width + 'px; height: ' + that.height + 'px;')
                    that.viewerInit()
                    return
                }

                //球机 可操控
                if(camera[4] === 'B') {
                    that.deviceSerial = camera[6]
                    if((that.$store.state.flash || that.hasSwf()) && !window.ActiveXObject && !("ActiveXObject" in window) && !(navigator.userAgent.indexOf("Edge") > -1)) {
                        that.flashUrl = camera[5].replace('.hd', '')
                        if(!(/sd/.test(document.URL))) {
                            that.flashUrl += '.hd'
                        }
                        that.$refs.flash.setAttribute('style', 'width: 100%; height: 100%;')
                        that.flashInit()
                        return
                    }
                }

                //普通摄像机
                if(that.cameraList[that.checkedCamera][8]) {
                    that.html5Url = that.cameraList[that.checkedCamera][8].replace('http:', '').replace('.hd', '')
                    if(!(/sd/.test(document.URL))) {
                        that.html5Url = that.html5Url.replace('.m3u8', '.hd.m3u8')
                    }
                    that.$refs.html5.setAttribute('style', 'width: 100%; height: 100%;')
                    that.videoInit()
                }else {
                    alert('视频链接为空！')
                }
            }
            
        },
        flashInit () {
            const that = this
            if(that.flash) {
                that.flash.opt.width = that.width
                that.flash.opt.height = that.height
                that.flash.opt.currentSource = that.flashUrl
                that.flash.opt.autoplay = false
            }else {
                const videoDom = document.createElement('video')
                videoDom.setAttribute('id', 'my-flash')
                videoDom.setAttribute('height', that.height)
                videoDom.setAttribute('width', that.width)
                videoDom.innerHTML = '<source src="' + that.flashUrl + '" type="rtmp/flv" />'
                that.$refs.flash.appendChild(videoDom)
                that.flash = new EZUIPlayer('my-flash')
            }
            if(that.isPlaying) {
                that.flash.play()
            }
        },
        videoInit () {
            const that = this
           if(!that.video) {
                const videoDom = document.createElement('video')
                videoDom.setAttribute('class', 'video-js vjs-default-skin vjs-fluid')
                that.$refs.html5.appendChild(videoDom)
                that.video = videojs(videoDom, {
                    language: 'zh-CN',
                    notSupportedMessage: '暂时无法播放',
                    html5: { hls: { withCredentials: false } },
                    autoplay: false,
                    controls: false,
                    posterImage: true,
                    errorDisplay: true,
                    //fluid: true,
                    poster: '/img/poster.png',
                })
            }
            if(that.isPlaying) {
                that.play()
            }
        },
        viewerInit () {
            const that = this
            if(that.viewer) {
                removepano('krpano')
            }
            embedpano({
                xml:"./js/krpano.xml",
                target: "panorama", 
                id: 'krpano',
                initvars:{source: that.imageUrl}, 
                onready : function(krpano_interface) {
                    that.viewer = krpano_interface
                }
            })
        },
        play () {
            const that = this
            that.isPlaying = true
            if(that.flashUrl) {
                that.flash.play()
            }else if(that.html5Url) {
                that.video.src(that.html5Url)
                that.video.load(that.html5Url)
                that.video.play()
            }
        },
        livePlay () {
            const that = this
            that.isPlaying ? StopPlay() : StartPlay(that.liveData)
            that.isPlaying = !that.isPlaying
        },
        liveTalk () {
            const that = this
            that.isTalking ? StopTalk() : StartTalk()
            that.isTalking = !that.isTalking
        },
        pause () {
            const that = this
            that.isPlaying = false
            if(that.flash) {
                that.flash.pause()
            }else {
                that.video.pause()
            }
        },
        cut (lr) {
            const that = this
            const node = that.$refs.items
            const style = node.getBoundingClientRect()
            const parentStyle = node.parentNode.getBoundingClientRect()
            const count = parseInt(parentStyle.width/100)
            const left = parseInt(node.style.left)
            if(left) {
                if(!lr && left - 100 < -(that.cameraList.length - count) * 100) {
                    node.style.left = 0
                    return
                }
                lr ? node.style.left = left + 100 + 'px' : node.style.left = left - 100 + 'px' 
            }else {
                lr ? node.style.left = -(that.cameraList.length - count) * 100 + 'px' : node.style.left = '-100px' 
            }
        },
        changeFull () {
            const that = this
            const camera = that.cameraList[that.checkedCamera]
            if(that.$store.state.isPPC && !that.isFull) { //适配安卓平板
                if(that.imageUrl) {
                    const appParams = [
                        { key: 'openAppPhotoViewer', value: '1' },
                        { key: 'url', value: camera[5] },
                        { key: 'title', value: camera[2] }
                    ]
                    const appParamsStr = appParams.map(item => {
                        return item.key + '=' + encodeURIComponent(item.value)
                    }).join('&')
                    location.href = 'openAppPhotoWindow?' + appParamsStr
                    return
                }
            }

            that.isFull = !that.isFull
            if(that.imageUrl) {
                setTimeout(function() {
                    that.setVideoSize()
                    that.$refs.panorama.setAttribute('style', 'width: ' + that.width + 'px; height: ' + that.height + 'px;')
                }, 50)
            }
            
            if(that.flashUrl) {
                setTimeout(function() {
                    that.init()
                }, 50)
            }
        },
        changeVideo (index) {
            const that = this
            if(that.$store.state.isPPC) {
                const camera = that.cameraList[index]
                if(camera[4] === 'B'){
                    const appParams = [
                        { key: 'openAppVideo', value: '1' },
                        { key: 'videoUrl', value: 'ezopen://' + camera[9] + '@open.ys7.com/' + camera[6] + '/1.hd.live' },
                        { key: 'name', value: camera[2] },
                        { key: 'token', value: that.$store.state.cameraToken },
                        { key: 'sno', value: camera[6] },
                        { key: 'key', value: '62e88b123fe94e0f8972485c5f5aead6' }
                    ]
                    const appParamsStr = appParams.map(item => {
                        return item.key + '=' + encodeURIComponent(item.value)
                    }).join('&')
                    location.href = 'openAppVideoWindow?' + appParamsStr
                    return
                }
            }
            that.$store.commit(nameSpaced + types.MONITOR_SET_CAMERA_CABLE, index)
        },
        setVideoSize () { //设置视频宽高
            const that = this
            const node = that.$refs.camera
            const nodeStyle = node.getBoundingClientRect()
            that.width = parseInt(nodeStyle.width)
            that.height = parseInt(nodeStyle.height)
        },
        hasSwf () {
            let swf
            if(typeof window.ActiveXObject != "undefined"){
                swf = new  ActiveXObject("ShockwaveFlash.ShockwaveFlash")
            }else{
                swf = navigator.plugins['Shockwave Flash']
            }
            return swf ? true : false
        }
    },
    beforeDestroy() {
        const that = this
        if(that.video) {
            that.video.dispose()
            that.video = null
        }
        if(that.viewer) {
            //that.viewer.destroy()
            that.viewer = null
        }
        if(that.flash) {
            that.flash.stop()
            that.flash = null
            that.$refs.flash.innerHTML = ''
        }
        if(that.isPlaying) {
            if(that.isLive) {
                StopPlay()
            }
            if(that.isTalking) {
                StopTalk()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/views/monitor/camera.scss'
</style>
