<template>
    <div class="orchard-info">
        <panel icon="./img/title/12.png" title="果园信息" :download="false">
            <div class="contact" v-show="orchardInfo.name">
                <div class="pic">
                    <i></i><i></i><i></i><i></i>
                    <img :src="orchardInfo.pic" alt="">
                </div>
                <div class="contact-info">
                    <div>
                        <span class="orchard-info-name">{{orchardInfo.name}}</span>
                    </div>
                    <div>
                        <span class="principal">负责人：{{orchardInfo.principal}}</span>
                    </div>
                    <div>
                        <span class="orchard-info-area">种植面积：{{orchardInfo.area}}亩</span>
                    </div>
                    <div>
                        <span class="address" :title="orchardInfo.address">地址：{{orchardInfo.address}}</span>
                    </div>
                </div>
            </div>
            <div class="plant-info" v-show="orchardInfo.name">
                <i></i><i></i><i></i><i></i>
                <div>
                    <i></i>
                    <p><span><span>{{orchardInfo.count}}</span>&nbsp;人<br />果园农户</span></p>
                </div>
                <div>
                    <i></i>
                    <p><span><span>{{orchardInfo.breed}}</span>&nbsp;种<br />种植品种</span></p>
                </div>
                <div>
                    <i></i>
                    <p><span><span>{{orchardInfo.deviceCount}}</span>&nbsp;台<br />设备数量</span></p>
                </div>
            </div>
            <NoData v-show="!orchardInfo.name"/>
        </panel>
    </div>
</template>

<script>
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'OrchardInfo',
    components: { NoData },
    computed: {
        ...mapState ( nameSpaced , {
            orchardInfo: state => state.orchardInfo,
        })
    },
}
</script>
<style lang="scss" scoped>
@import '../../style/views/monitor/orchard-info.scss'
</style>
