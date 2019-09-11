<template>
<div class="gmap">
    <Panel  :download="false">
        <Search tips="搜索果园" save="region" v-if="!$store.state.orchardId" @search="queryOrchard" :dict="dict" :color="true"/>
        <div title="复位" class="restoration" @click="changeZoom(1, 'orchard')"></div>
        <div class="orchardTitle" v-show="orchardList.length > 0">
            <div>
                <span @click="changeZoom(1, 'orchard')">{{ checkedOrchardName }}</span>
                <ul class="orchard-list" v-if="!$store.state.orchardId" :style="'height: ' + (orchardList.length * 30) + 'px;'">
                    <vue-scroll :ops="scrollOptions" ref="scroll">
                        <li v-for="(orchard, index) in orchardList" :class="{'orchard-checked': orchard[2] === checkedOrchardName}" :key="index" @click="changeOrchard(index)">{{orchard[2]}}</li>
                    </vue-scroll>
                </ul>
            </div>
            <div v-show="checkedDeviceClass">
                {{checkedDeviceName? '&nbsp;-&nbsp;&nbsp;' : ''}}<span :class="[checkedDeviceClass, 'device-checked']" @click="changeZoom(2, checkedDeviceAlias)">{{ checkedDeviceName }}</span>
                <ul v-show="fm1List.length > 0 || fm2List.length > 0 || wafList.length > 0 || cameraList.length > 0" class="device-list" :style="'height: ' + ((fm1List.length + fm2List.length + wafList.length + cameraList.length) * 30) + 'px;'">
                    <vue-scroll :ops="scrollOptions" ref="scroll">
                        <li v-for="(fm1, i) in fm1List" :key="i" class="fm1-device-list" :class="{'fm1-device-checked': (fm1[2] === checkedDeviceName && i === checkedFM1Index)}" @click="fm1Click(i, fm1[2])">{{fm1[2]}}</li>
                        <li v-for="(fm2, j) in fm2List" :key="j + 100" class="fm2-device-list" :class="{'fm2-device-checked': (fm2[2] === checkedDeviceName && j === checkedFM2Index)}" @click="fm2Click(j, fm2[2])">{{fm2[2]}}</li>
                        <li v-for="(waf, l) in wafList" :key="l + 1000" class="waf-device-list" :class="{'waf-device-checked': (waf[2] === checkedDeviceName && l === checkedWAFIndex)}" @click="wafClick(l, waf[2])">{{waf[2]}}</li>
                        <li v-for="(camera, k) in cameraList" :key="k + 10000" :class="[(camera[2] === checkedDeviceName && k === checkedCameraIndex) ? camera[4] + '-camera-device-checked' : '', camera[4] + '-camera-device']" @click="cameraClick(k, camera[2])">{{camera[2]}}</li>
                    </vue-scroll>
                </ul>
            </div>
        </div>
        <div class="map" ref="chart"></div>
    </Panel>
</div>
</template>

<script>
import Search from '@/components/Search'
import ns from '@/store/constants/ns'
import types from '@/store/constants/types'
import { mapState } from 'vuex'
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'GMap',
    components: { Search },
    data() {
        return {
            gmap: null, //谷歌地图实例
            markerInfo: null, //鼠标停留设备图标上显示的信息窗口
            markerClusterer: null, //谷歌地图标记聚集类实例
            checkedOrchardName: '', //当前选中的果园名称
            checkedOrchardIndex: '', //当前选中的果园列表索引
            dict: [], //果园名称列表
            checkedDeviceName: '', //当前选中的设备名称
            checkedDeviceClass: '', //当前选中的设备显示样式的class
            checkedDeviceAlias: '', //当前选中的设备的别名 'fm1' | 'fm2' | 'waf' | 'camera'
            fm1MarkerList: [], //FM1地图标记对象列表
            fm2MarkerList: [], //FM2。。。
            wafMarkerList: [], //水肥。。。
            cameraMarkerList: [], //普通摄像机。。。
            checkedFM1Index: 0, //保存当前选中fm1设备的index
            checkedFM2Index: 0, 
            checkedWAFIndex: 0, 
            checkedCameraIndex: 0, 
            zoom: 1, //地图缩放级别  1 果园级别   2 设备级别
            scrollOptions: {
                vuescroll: {
                    mode: 'native',
                    zooming: false,
                },
                bar: {
                    keepShow: true,
                    size: '4px',
                    background: 'rgba(51, 126, 255, 1)'
                }
            },
            fm1MarkerIcon: {icon: '/img/fm1.png', active: '/img/fm1_active.png'},
            fm2MarkerIcon: {icon: '/img/fm2.png', active: '/img/fm2_active.png'},
            wafMarkerIcon: {icon: '/img/wf.png', active: '/img/wf_active.png'},
            AcameraMarkerIcon: {icon: '/img/gun.png', active: '/img/gun_active.png'},
            BcameraMarkerIcon: {icon: '/img/cloud.png', active: '/img/cloud_active.png'},
            AIcameraMarkerIcon: {icon: '/img/ai.png', active: '/img/ai_active.png'},
            CcameraMarkerIcon: {icon: '/img/360.png', active: '/img/360_active.png'},
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            orchardList: state => state.orchardList,
            fm1List: state => state.fm1List,
            fm2List: state => state.fm2List,
            wafList: state => state.wafList,
            cameraList: state => state.cameraList,
            checkedFM1: state => state.checkedFM1,
            checkedFM2: state => state.checkedFM2,
            checkedWAF: state => state.checkedWAF,
            checkedCamera: state => state.checkedCamera,
            checkedDeviceType: state => state.checkedDeviceType,
        })
    },
    watch: {
        'orchardList' () {
            const that = this
            that.dict = []
            for(let i = 0; i < that.orchardList.length; i++) {
                that.dict.push(that.orchardList[i][2]) //搜索果园对于的字典
            }
            that.changeOrchard(0) //默认选中第一个果园
        },
        'fm1List' () {
            const that = this
            that.fm1MarkerList.forEach(item => item.setMap(null))
            that.fm1MarkerList = []
            that.checkedFM1Index = 0
            that.createFM1Marker(that.fm1List)
            that.markerClusterer.addMarkers(that.fm1MarkerList)
        },
        'fm2List' () {
            const that = this
            that.fm2MarkerList.forEach(item => item.setMap(null))
            that.fm2MarkerList = []
            that.checkedFM2Index = 0
            that.createFM2Marker(that.fm2List)
            that.markerClusterer.addMarkers(that.fm2MarkerList)
        },
        'wafList' () {
            const that = this
            that.wafMarkerList.forEach(item => item.setMap(null))
            that.wafMarkerList = []
            that.checkedWAFIndex = 0
            that.createWAFMarker(that.wafList)
            that.markerClusterer.addMarkers(that.wafMarkerList)
        },
        'cameraList' () {
            const that = this
            that.cameraMarkerList.forEach(item => item.setMap(null))
            that.cameraMarkerList = []
            that.checkedCameraIndex = 0
            that.createCameraMarker(that.cameraList)
            that.markerClusterer.addMarkers(that.cameraMarkerList)
        },
        'checkedCamera' () {
            const that = this
            that.unDeviceClick('camera')
        },
        'checkedDeviceType' () {
            const that = this
            that.unDeviceClick(that.checkedDeviceType)
        }
    },
    mounted() {
        const that = this
        that.init()
    },
    methods: {
        init () {   //实例化地图
            const that = this
            const styledMapType = [
                {
                    "featureType": "landscape",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
            ]
            that.gmap = new google.maps.Map(that.$refs.chart, {
                center: new google.maps.LatLng(25.85097, 114.940278),
                zoom: 8,
                gestureHandling: 'greedy', //取消按住Ctrl进行缩放
                clickableIcons: false, //取消图标点击事件
                mapTypeId: 'hybrid',
                styles: styledMapType,
                fullscreenControl: false, //全屏控件
                mapTypeControl: false, //地图类型切换控件
                streetViewControl: false, //街景小人
                zoomControl: false, //缩放控件
                maxZoom: 20,
            })
            that.markerInfo = new google.maps.InfoWindow({content: '' })
            that.markerClusterer = new MarkerClusterer(that.gmap, [],{
                imagePath: '/img/m',
                gridSize: 30,
                maxZoom: 16,
            })
            google.maps.event.addListener(that.gmap, 'clusterclick', (device) => {
                if(device.type) {
                    that.unDeviceClick(device.type, device.id)
                }
            })
        },
        changeZoom (zoom, device) { //根据地图缩放级别来显示/隐藏图标
            const that = this
            that.zoom = zoom
            let point = null
            if(zoom == 1) {
                let orchard = that.orchardList[that.checkedOrchardIndex]
                point = new google.maps.LatLng(orchard[1], orchard[0])
                if(device === 'orchard') { //选中果园 设备数据变更为果园总体数据
                    that.checkedDeviceClass = ''
                    that.$store.commit(nameSpaced + types.MONITOR_SET_FM1_DEVICE, 0)
                    that.$store.commit(nameSpaced + types.MONITOR_SET_FM2_DEVICE, 0)
                    that.$store.commit(nameSpaced + types.MONITOR_SET_WAF_DEVICE, 0)
                    /*
                    if(that.fm1MarkerList.length > 0) {
                        point = that.fm1MarkerList[that.checkedFM1Index].getPosition()
                    }else if(that.fm2MarkerList.length > 0){
                        point = that.fm2MarkerList[that.checkedFM2Index].getPosition()
                    }else if(that.wafMarkerList.length > 0){
                        point = that.wafMarkerList[that.checkedWAFIndex].getPosition()
                    }else if(that.cameraMarkerList.length > 0){
                        point = that.cameraMarkerList[that.checkedCameraIndex].getPosition()
                    }
                    */
                }
                that.gmap.setZoom(8)
            }else if(zoom == 2) {
                if(device === 'fm1' && that.fm1MarkerList[that.checkedFM1Index]) {
                    point = that.fm1MarkerList[that.checkedFM1Index].getPosition()
                }else if(device === 'fm2' && that.fm2MarkerList[that.checkedFM2Index]) {
                    point = that.fm2MarkerList[that.checkedFM2Index].getPosition()
                }else if(device === 'waf' && that.wafMarkerList[that.checkedWAFIndex]) {
                    point = that.wafMarkerList[that.checkedWAFIndex].getPosition()
                }else if(device === 'camera' && that.cameraMarkerList[that.checkedCameraIndex]) {
                    point = that.cameraMarkerList[that.checkedCameraIndex].getPosition()
                }
                let zoom = that.gmap.getZoom()
                if(zoom < 15) {
                    that.gmap.setZoom(20)
                }
            }
            if(point) {
                //that.gmap.setCenter(point)
                that.gmap.panTo(point)
            }
        },
        changeOrchard(index) {
            const that = this
            const orchard = that.orchardList[index]
            if(orchard){
                that.checkedOrchardName = orchard[2]
                that.checkedOrchardIndex = index
                that.checkedDeviceName = ''
                that.markerClusterer.clearMarkers()
                that.markerClusterer.resetViewport()
                that.changeZoom(1, 'orchard')
                if(that.$store.state.orchardId) return
                that.$emit('change', orchard[4])
            }
            //that.gmap.setCenter( new google.maps.LatLng(orchard[1], orchard[0]) )
            //that.gmap.setZoom(8)
        },
        createdDeviceMarkerInfo (marker, info) { //创建设备提示信息框
            if(info){
                const that = this
                marker.addListener('mouseover', function() {
                    that.markerInfo.setContent('<div class="map-info-device">' + info + '</div>')
                    that.markerInfo.open(that.gmap, marker)
                })
                marker.addListener('mouseout', function() {
                    that.markerInfo.close()
                })
            }
        },
        createFM1Marker (data) {
            const that = this
            if(data.length === 0) {
                return
            }
            const icon = that.fm1MarkerIcon.icon
            const checkedIcon = that.fm1MarkerIcon.active
            for(let i = 0; i < data.length; i++) {
                that.fm1MarkerList[i] = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i][1], data[i][0]),
                    icon: icon,
                    //title: data[i][2],
                    visible: true,
                    zIndex: 200,
                    type: 'FM1',
                    deviceId: i,
                    map: that.gmap
                })
                that.createdDeviceMarkerInfo(that.fm1MarkerList[i], data[i][2])
                that.fm1MarkerList[i].addListener('click', function() {
                    that.fm1Click(i, data[i][2])
                })
            }
        },
        createFM2Marker (data) {
            const that = this
            if(data.length === 0) {
                return
            }
            const icon = that.fm2MarkerIcon.icon
            const checkedIcon = that.fm2MarkerIcon.active
            for(let i = 0; i < data.length; i++) {
                that.fm2MarkerList[i] = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i][1], data[i][0]),
                    icon: icon,
                    //title: data[i][2],
                    visible: true,
                    zIndex: 200,
                    type: 'FM2',
                    deviceId: i,
                    map: that.gmap
                })
                that.createdDeviceMarkerInfo(that.fm2MarkerList[i], data[i][2])
                that.fm2MarkerList[i].addListener('click', function() {
                    that.fm2Click(i, data[i][2])
                })
            }
        },
        createWAFMarker (data) {
            const that = this
            if(data.length === 0) {
                return
            }
            const icon = that.wafMarkerIcon.icon
            const checkedIcon = that.wafMarkerIcon.active
            for(let i = 0; i < data.length; i++) {
                that.wafMarkerList[i] = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i][1], data[i][0]),
                    icon: icon,
                    //title: data[i][2],
                    visible: true,
                    zIndex: 200,
                    deviceId: i,
                    type: 'WAF',
                    map: that.gmap
                })
                that.createdDeviceMarkerInfo(that.wafMarkerList[i], data[i][2])
                that.wafMarkerList[i].addListener('click', function() {
                    that.wafClick(i, data[i][2])
                })
            }
        },
        createCameraMarker (data) {
            const that = this
            if(data.length === 0) {
                return
            }
            for(let i = 0; i < data.length; i++) {
                let icon = that.AcameraMarkerIcon.icon
                let checkedIcon = that.AcameraMarkerIcon.active
                if(data[i][4] === 'B'){
                    icon = that.BcameraMarkerIcon.icon
                    checkedIcon = that.BcameraMarkerIcon.active
                }else if(data[i][4] === 'AI') {
                    icon = that.AIcameraMarkerIcon.icon
                    checkedIcon = that.AIcameraMarkerIcon.active
                }else if(data[i][4] === 'C') {
                    icon = that.CcameraMarkerIcon.icon
                    checkedIcon = that.CcameraMarkerIcon.active
                }
                if(!i) {
                    icon = checkedIcon
                }
                that.cameraMarkerList[i] = new google.maps.Marker({
                    position: new google.maps.LatLng(data[i][1], data[i][0]),
                    icon: icon,
                    //title: data[i][2],
                    visible: true,
                    type: data[i][4],
                    deviceId: i,
                    map: that.gmap
                })
                that.createdDeviceMarkerInfo(that.cameraMarkerList[i], data[i][2])
                that.cameraMarkerList[i].addListener('click', function() {
                    that.cameraClick(i, data[i][2])
                })
            }
        },
        unDeviceClick (type, index) { //未知设备点击事件
            const that = this
            let haveIndex = false
            if(index === 0 || index) {
                haveIndex = true
            }
            let i = 0
            if(that.fm1List[haveIndex? index : that.checkedFM1Index] && (type === 'fm1' || type === 'airTemp' || type === 'airHumidity' || type === 'lightIntensity' || type === 'airIntensity')) {
                i = haveIndex? index : that.checkedFM1Index
                if(that.checkedFM1 || haveIndex) {
                    that.fm1Click(i, that.fm1List[i][2], type)
                    if(!haveIndex) {
                        that.changeZoom(2, 'fm1')
                    }
                }
            }else if(that.fm2List[haveIndex? index : that.checkedFM2Index] && (type === 'fm2' || type === 'windSpeed' || type === 'rainfall' || type === 'soilTemp' || type === 'soilHumidity')) {
                i = haveIndex? index : that.checkedFM2Index
                if(that.checkedFM2 || haveIndex) {
                    that.fm2Click(i, that.fm2List[i][2], type)
                    if(!haveIndex) {
                        that.changeZoom(2, 'fm2')
                    }
                }
            }else if(that.wafList[haveIndex? index : that.checkedWAFIndex] && (type === 'waf' || type === 'soilEC' || type === 'fertFlow' || type === 'waterFlow' || type === 'soilPH')) {
                i = haveIndex? index : that.checkedWAFIndex
                if(that.checkedWAF || haveIndex) {
                    that.wafClick(i, that.wafList[i][2], type)
                    if(!haveIndex) {
                        that.changeZoom(2, 'waf')
                    }
                }
            }else if(type === 'camera' || type === 'A' || type === 'B' || type === 'AI') {
                i = haveIndex? index : that.checkedCamera
                that.cameraClick(i, that.cameraList[i][2])
                if(!haveIndex) {
                    that.changeZoom(2, 'camera')
                }
            }
        },
        fm1Click (index, value, type) {
            const that = this
            if(that.fm1MarkerList[index]) {
                const icon = that.fm1MarkerIcon.icon
                const checkedIcon = that.fm1MarkerIcon.active
                that.fm1MarkerList[that.checkedFM1Index].setIcon(icon)
                that.checkedFM1Index = index
                that.fm1MarkerList[index].setIcon(checkedIcon)
                that.checkedDeviceName = value
                that.checkedDeviceClass = 'fm1-checked'
                that.checkedDeviceAlias = 'fm1'
                that.$store.commit(nameSpaced + types.MONITOR_SET_DEVICE_TYPE, type? type : 'fm1') //物联网设备统计模块会自动选中fm1的数据展示
                that.$store.commit(nameSpaced + types.MONITOR_SET_FM1_DEVICE, index + 1) //物联网设备统计模块的数据切换为该设备的数据
                that.changeZoom(2, 'fm1')
            }
        },
        fm2Click (index, value, type) {
            const that = this
            if(that.fm2MarkerList[index]) {
                const icon = that.fm2MarkerIcon.icon
                const checkedIcon = that.fm2MarkerIcon.active
                that.fm2MarkerList[that.checkedFM2Index].setIcon(icon)
                that.checkedFM2Index = index
                that.fm2MarkerList[index].setIcon(checkedIcon)
                that.checkedDeviceName = value
                that.checkedDeviceClass = 'fm2-checked'
                that.checkedDeviceAlias = 'fm2'
                that.$store.commit(nameSpaced + types.MONITOR_SET_DEVICE_TYPE, type? type : 'fm2')
                that.$store.commit(nameSpaced + types.MONITOR_SET_FM2_DEVICE, index + 1)
                that.changeZoom(2, 'fm2')
            }
        },
        wafClick (index, value, type) {
            const that = this
            if(that.wafMarkerList[index]) {
                const icon = that.wafMarkerIcon.icon
                const checkedIcon = that.wafMarkerIcon.active
                that.wafMarkerList[that.checkedWAFIndex].setIcon(icon)
                that.checkedWAFIndex = index
                that.wafMarkerList[index].setIcon(checkedIcon)
                that.checkedDeviceName = value
                that.checkedDeviceClass = 'waf-checked'
                that.checkedDeviceAlias = 'waf'
                that.$store.commit(nameSpaced + types.MONITOR_SET_DEVICE_TYPE, type? type : 'waf')
                that.$store.commit(nameSpaced + types.MONITOR_SET_WAF_DEVICE, index + 1)
                that.changeZoom(2, 'waf')
            }
        },
        cameraClick (index, value) {
            const that = this
            if(that.cameraMarkerList[index]) {
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
                let icon = that.AcameraMarkerIcon.icon
                let checkedIcon = that.AcameraMarkerIcon.active
                if(that.cameraList[index][4] === 'B'){
                    icon = that.BcameraMarkerIcon.icon
                    checkedIcon = that.BcameraMarkerIcon.active
                }else if(that.cameraList[index][4] === 'AI') {
                    icon = that.AIcameraMarkerIcon.icon
                    checkedIcon = that.AIcameraMarkerIcon.active
                }else if(that.cameraList[index][4] === 'C') {
                    icon = that.CcameraMarkerIcon.icon
                    checkedIcon = that.CcameraMarkerIcon.active
                }
                let oldIcon = that.AcameraMarkerIcon.icon
                if(that.cameraList[that.checkedCameraIndex][4] === 'B'){
                    oldIcon = that.BcameraMarkerIcon.icon
                }else if(that.cameraList[that.checkedCameraIndex][4] === 'AI') {
                    oldIcon = that.AIcameraMarkerIcon.icon
                }else if(that.cameraList[that.checkedCameraIndex][4] === 'C') {
                    oldIcon = that.CcameraMarkerIcon.icon
                }
                that.cameraMarkerList[that.checkedCameraIndex].setIcon(oldIcon)
                that.checkedCameraIndex = index
                that.cameraMarkerList[index].setIcon(checkedIcon)
                that.checkedDeviceName = value
                that.checkedDeviceClass = that.cameraList[index][4] + '-camera-checked'
                that.checkedDeviceAlias = 'camera'
                that.$store.commit(nameSpaced + types.MONITOR_SET_CAMERA_CABLE, index)
                that.changeZoom(2, 'camera')
            }
        },
        queryOrchard (name) { //查询果园
            const that = this
            const len = that.orchardList.length
            for(let i = 0; i < len; i++) {
                if(that.orchardList[i][2] === name) {
                    that.changeOrchard(i)
                    return
                }
            }
        },
    },
    beforeDestroy () {
        const that = this
        that.gmap = null
        that.markerInfo = null
        that.markerClusterer = null
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/monitor/gmap.scss';
</style>