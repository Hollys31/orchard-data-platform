<template>
    <div class="device-statistics">
        <panel icon="./img/title/3.png" title="物联网设备统计" textAlign="left" :unit="lineData.unit" :download="false">
            <div class="device-title">{{deviceTiele}}</div>
            <div class="item-wrap">
                <ul ref="items" class="items" v-if="environmentData[0]">
                    <li :class="{airTemp: type === 'airTemp'}" @click="change(isWeek, 'airTemp')">
                        <div>{{environmentData[0].value}} {{environmentData[0].value === '-'? '' : environmentData[0].unit}}</div>
                        <span>空气温度</span>
                    </li>
                    <li :class="{airHumidity: type === 'airHumidity'}" @click="change(isWeek, 'airHumidity')">
                        <div>{{environmentData[1].value}} {{environmentData[1].value === '-'? '' : environmentData[1].unit}}</div>
                        <span>空气湿度</span>
                    </li>
                    <li :class="{lightIntensity: type === 'lightIntensity'}" @click="change(isWeek, 'lightIntensity')">
                        <div>{{environmentData[2].value}} {{environmentData[2].value === '-'? '' : environmentData[2].unit}}</div>
                        <span>光照强度</span>
                    </li>
                    <li :class="{airIntensity: type === 'airIntensity'}" @click="change(isWeek, 'airIntensity')">
                        <div>{{environmentData[3].value}} {{environmentData[3].value === '-'? '' : environmentData[3].unit}}</div>
                        <span>气压强度</span>
                    </li>
                    <li :class="{windSpeed: type === 'windSpeed'}" @click="change(isWeek, 'windSpeed')">
                        <div>{{environmentData[4].value}} {{environmentData[4].value === '-'? '' : environmentData[4].unit}}</div>
                        <span>风速</span>
                    </li>
                    <li :class="{rainfall: type === 'rainfall'}" @click="change(isWeek, 'rainfall')">
                        <div>{{environmentData[5].value}} {{environmentData[5].value === '-'? '' : environmentData[5].unit}}</div>
                        <span>降雨量</span>
                    </li>
                    <li :class="{soilTemp: type === 'soilTemp'}" @click="change(isWeek, 'soilTemp')">
                        <div>{{environmentData[6].value}} {{environmentData[6].value === '-'? '' : environmentData[6].unit}}</div>
                        <span>土壤温度</span>
                    </li>
                    <li :class="{soilHumidity: type === 'soilHumidity'}" @click="change(isWeek, 'soilHumidity')">
                        <div>{{environmentData[7].value}} {{environmentData[7].value === '-'? '' : environmentData[7].unit}}</div>
                        <span>土壤湿度</span>
                    </li>
                    <li :class="{soilEC: type === 'soilEC'}" @click="change(isWeek, 'soilEC')">
                        <div>{{environmentData[8].value}} {{environmentData[8].value === '-'? '' : environmentData[8].unit}}</div>
                        <span>土壤盐度</span>
                    </li>
                    <li :class="{fertFlow: type === 'fertFlow'}" @click="change(isWeek, 'fertFlow')">
                        <div>{{environmentData[9].value}} {{environmentData[9].value === '-'? '' : environmentData[9].unit}}</div>
                        <span>肥流量</span>
                    </li>
                    <li :class="{waterFlow: type === 'waterFlow'}" @click="change(isWeek, 'waterFlow')">
                        <div>{{environmentData[10].value}} {{environmentData[10].value === '-'? '' : environmentData[10].unit}}</div>
                        <span>水流量</span>
                    </li>
                    <li :class="{soilPH: type === 'soilPH'}" @click="change(isWeek, 'soilPH')">
                        <div>{{environmentData[11].value}} {{environmentData[11].value === '-'? '' : environmentData[11].unit}}</div>
                        <span>土壤PH</span>
                    </li>
                </ul>
            </div>
            <div class="cut">
                <div class="cut-left iconfont" @click.stop="cut(1)">&#xe602;</div>
                <div class="cut-right iconfont" @click.stop="cut(0)">&#xe6dd;</div>
            </div>
            <ul class="selector">
                <li :class="{checked: isWeek}" @click="change(true)">七天数据</li>
                <li :class="{checked: !isWeek}" @click="change(false)">时刻数据</li>
            </ul>
            <div class="chart">
                <LineChart v-show="lineData.values.length > 0" :name="lineData.name" :titles="lineData.titles" :values="lineData.values" :unit="lineData.unit" />
                <NoData v-show="lineData.values.length === 0"/>
            </div>
        </panel>
    </div>
</template>

<script>
import LineChart from '@/components/charts/Line'
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'DeviceStatistics',
    components: { LineChart, NoData },
    data() {
        return {
            type: 'airTemp', //当前选择的数据类型
            deviceTiele: '监测站FM1设备数据',
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            isWeek: state => state.isWeek,
            lineData: state => state.lineData,
            checkedDeviceType: state => state.checkedDeviceType,
            environmentData: state => state.environmentData,
        })
    },
    watch: {
        'checkedDeviceType' () {
            const that = this
            const type = that.checkedDeviceType
            const node = that.$refs.items
            switch(type) {
                case 'fm1': 
                    that.deviceTiele = '监测站FM1设备数据'
                    that.deviceTiele = 'FM1设备信息'
                    node.setAttribute('style', 'left: 0')
                    that.change(that.isWeek, 'airTemp' )
                    break
                case 'fm2':
                    that.deviceTiele = '监测站FM2设备数据'
                    node.setAttribute('style', 'left: -100%')
                    that.change(that.isWeek, 'windSpeed' )
                    break
                case 'waf':
                    that.deviceTiele = '智能水肥设备数据'
                    node.setAttribute('style', 'left: -200%')
                    that.change(that.isWeek, 'soilEC' )
                    break
                default: that.change(that.isWeek, type )
            }
        }
    },
    methods: {
        change (isWeek, type) {
            const that = this
            if(type) {
                that.type = type
                that.$store.commit(nameSpaced + types.MONITOR_SET_DEVICE_TYPE, type)
            }else {
                that.$store.commit(nameSpaced + types.MONITOR_SET_DAY_WEEK, isWeek)
            }
            that.$store.commit(nameSpaced + types.MONITOR_SET_LINE_DATA, 
                isWeek? that.type + 'Week' : that.type + 'Day'
            )
        },
        cut (lr) {
            const that = this
            const node = that.$refs.items
            const style = node.getBoundingClientRect()
            const left = Math.abs(style.left) + 50
            if(left < style.width / 3) {
                lr ? that.deviceTiele = '智能水肥设备数据' : that.deviceTiele = '监测站FM2设备数据'
                node.setAttribute('style', lr ? 'left: -200%' : 'left: -100%')
            }else if(left < style.width / 3 * 2) {
                lr ? that.deviceTiele = '监测站FM1设备数据' : that.deviceTiele = '智能水肥设备数据'
                node.setAttribute('style', lr ? 'left: 0' : 'left: -200%')
            }else {
                lr ? that.deviceTiele = '监测站FM2设备数据' : that.deviceTiele = '监测站FM1设备数据'
                node.setAttribute('style', lr ? 'left: -100%' : 'left: 0')
            }
        }
    },
}
</script>
<style lang="scss" scoped>
@import '../../style/views/monitor/device-statistics.scss'
</style>
