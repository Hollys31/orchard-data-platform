<template>
    <div class="monitor">
        <div class="wrap">
            <!--果园信息-->
            <OrchardInfo /> 
            <!--物联设备统计-->
            <DeviceStatistics />
        </div>
        <div class="wrap">
            <!--地图-->
            <GMap @change="getData" />
        </div>
        <div class="wrap">
            <!--视频监控-->
            <Panel icon="./img/title/7.png" :title="orchardInfo.name? orchardInfo.name.replace( '有限公司', '').replace('果园', '')  + '果园实时监控': '果园实时监控'" :download="false" unit="台数">
                <Camera v-show="cameraList.length > 0" />
                <NoData v-show="cameraList.length === 0"/>
            </Panel>
            <!--果园农事活动-->
            <panel icon="./img/title/8.png" :title="new Date().getFullYear() + '年农事活动数量'" unit="次数">
                <Line2 v-show="farmingActivities.values.length > 0" :titles="farmingActivities.titles" 
                :values="farmingActivities.values" :unit="farmingActivities.unit" :names="farmingActivities.names" />
                <NoData v-show="farmingActivities.values.length === 0"/>
            </panel>
            <panel icon="./img/title/9.png" :title="new Date().getFullYear() + '年园区种植分布情况'" :unit="plantArea.unit">
                <Pie v-show="plantArea.data.length > 0" title="种植面积" name="种植面积" position="left" :data="plantArea.data" :unit="plantArea.unit"/>
                <NoData v-show="plantArea.data.length === 0"/>
            </panel>
        </div>
    </div>
</template>

<script>
import OrchardInfo from '@/views/monitor/OrchardInfo'
import DeviceStatistics from '@/views/monitor/DeviceStatistics'
import GMap from '@/views/monitor/GMap'
import Camera from '@/views/monitor/Camera'
import Line2 from '@/components/charts/Line2'
import Pie from '@/components/charts/Pie'
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'monitor',
    components: { OrchardInfo, DeviceStatistics, GMap, Camera, Line2, Pie, NoData },
    computed: {
        ...mapState ( nameSpaced , {
            orchardList: state => state.orchardList,
            cameraList: state => state.cameraList,
            fm1List: state => state.fm1List,
            fm2List: state => state.fm2List,
            wafList: state => state.wafList,
            deviceData: state => state.deviceData,
            checkedFM1: state => state.checkedFM1,
            checkedFM2: state => state.checkedFM2,
            checkedWAF: state => state.checkedWAF,
            farmingActivities: state => state.farmingActivities,
            plantArea: state => state.plantArea,
            orchardInfo: state => state.orchardInfo,
        })
    },
    watch: {
        'checkedFM1' () {
            const that = this
            let fm1Data = that.deviceData.fm1[that.checkedFM1]
            if(fm1Data) {
                that.$store.commit(nameSpaced + types.MONITOR_CHANGE_FM1_DEVICE, fm1Data)
            }else {
                let fm1Device = that.fm1List[that.checkedFM1 - 1]
                that.$store.dispatch(nameSpaced + types.MONITOR_GET_DEVICE_DATA, {equipmentId: fm1Device[3], type: fm1Device[4], device: 'fm1'})
            }
        },
        'checkedFM2' () {
            const that = this
            let fm2Data = that.deviceData.fm2[that.checkedFM2]
            if(fm2Data) {
                that.$store.commit(nameSpaced + types.MONITOR_CHANGE_FM2_DEVICE, fm2Data)
            }else {
                let fm2Device = that.fm2List[that.checkedFM2 - 1]
                that.$store.dispatch(nameSpaced + types.MONITOR_GET_DEVICE_DATA, {equipmentId: fm2Device[3], type: fm2Device[4], device: 'fm2'})
            }
        },
        'checkedWAF' () {

        },

    },
    data() {
        return {
            type: 'fm1', //当前选中的数据类型
        }
    },
    created() {
        const that = this
        if(that.$store.state.orchardId) {
            that.getData(that.$store.state.orchardId)
        }else {
            that.getData()
        }
    },
    methods: {
        getData (id) {
            const that = this
            if(id) {
                that.$store.dispatch(nameSpaced + types.MONITOR_GET_INIT_INFO, {gardenId: id})
            }else if(!that.orchardList.legnth){
                that.$store.dispatch(nameSpaced + types.MONITOR_GET_INIT_INFO, {gardenId: ''})
            }
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/monitor/monitor.scss'
</style>