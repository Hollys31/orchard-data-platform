 <template>
    <div class="home">
        <div class="wrap">
            <Panel icon="./img/title/1.png" :title="region + '主要溯源排行'" unit="次数">
                <!--主要溯源区域图表-->
                <Scatter v-show="originRegion.data.length > 0" :data="originRegion.data" />
                <NoData v-show="originRegion.data.length === 0"/>
            </Panel>
            <Panel icon="./img/title/2.png" :title="region + (inventoryContrast.cropName ? inventoryContrast.cropName + '品质库存量比较' : '主要作物库存量比较')" :unit="inventoryContrast.unit">
                <!--主要作物库存量比较图表-->
                <Pie right="85" v-show="inventoryContrast.data.length > 0" name="总库存量" title="库存比较" :data="inventoryContrast.data" :unit="inventoryContrast.unit" />
                <NoData v-show="inventoryContrast.data.length === 0" />
            </Panel>
            <Panel icon="./img/title/3.png" :title="region + '智能设备占比情况'" :unit="deviceRatio.unit">
                <!--智能设备占比情况图表-->
                <Device v-show="deviceRatio.data.length > 0" class="radar" :data="deviceRatio.data" :indicator="deviceRatio.indicator" :unit="deviceRatio.unit" />
                <NoData v-show="deviceRatio.data.length === 0" />
            </Panel>
        </div>
        <div class="wrap">
            <!--地图-->
                <JsonMap title="种植分布情况" :data="plantDistribute" @change="getData" :searchBar="false" :top="160"/>
                <TotalData :type="type" />
        </div>
        <div class="wrap">
            <Panel icon="./img/title/4.png" :title="region + '主产作物施肥用量统计'" :unit="fertQuantity.unit">
                <!--主产作物施肥用量统计图表-->
                <Line3 v-show="fertQuantity.values.length > 0" :titles="fertQuantity.titles" :values="fertQuantity.values" :names="fertQuantity.names" :unit="fertQuantity.unit" />
                <NoData v-show="fertQuantity.values.length === 0"/>
            </Panel>
            <Panel icon="./img/title/5.png" :title="region + '品种采摘量排行'" :unit="pickRank.unit" >
                <!--品种采摘量排行图表-->
                <Pie1 v-show="pickRank.data.length > 0" name="采摘量" :data="pickRank.data" :unit="pickRank.unit" />
                <NoData v-show="pickRank.data.length === 0"/>
            </Panel>
            <Panel icon="./img/title/6.png" :title="region + '种植作物出库入库总量'" :unit="outboundInventory.unit">
                <!--种植作物出库入库总量图表-->
                <Line1 v-show="outboundInventory.values.length > 0" :titles="outboundInventory.titles" :values="outboundInventory.values" :names="outboundInventory.names" :unit="outboundInventory.unit" />
                <NoData v-show="outboundInventory.values.length === 0"/>
            </Panel>
        </div>
    </div>
</template>

<script>
import JsonMap from '@/views/JsonMap'
import TotalData from './TotalData'
import Device from './Device'
import Pie from '@/components/charts/Pie'
import Pie1 from '@/components/charts/Pie1'
import Line3 from '@/components/charts/Line3'
import Line1 from '@/components/charts/Line1'
import Scatter from '@/components/charts/Scatter'
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.HOME + '/'
export default {
    name: 'Home',
    components: { JsonMap, TotalData, Pie, Device, Pie1, Line3, Line1, Scatter, NoData },
    computed: {
        ...mapState ( nameSpaced , {
            numberOfOrchard: state => state.numberOfOrchard,
            plantArea: state => state.plantArea,
            numberOfPlant: state => state.numberOfPlant,
            inventoryContrast: state => state.inventoryContrast,
            pickRank: state => state.pickRank,
            originRegion: state => state.originRegion,
            deviceRatio: state => state.deviceRatio,
            fertQuantity: state => state.fertQuantity,
            outboundInventory: state => state.outboundInventory,
            plantDistribute: state => state.plantDistribute,
        })
    },
    data () {
        return {
            region: '', //当前数据所在的区域
            type: 0, //当前处在的行政级别
        }
    },
    methods: {
        getData (data) {
            const that = this
            that.region = data.name
            that.type = data.type
            if(data.name === '全国') {
                data.name = ''
            }
            that.$store.dispatch(nameSpaced + types.HOME_GET_DATA, data)
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../../style/views/home/home.scss';
</style>