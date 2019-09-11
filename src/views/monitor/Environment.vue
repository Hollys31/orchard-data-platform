<template>
    <div class="environment">
        <div class="time" v-show="environmentData.length > 0">园区环境数据更新时间：{{environmentUpDate}}</div>
        <div class="item-wrap" v-show="environmentData.length > 0">
            <div class="item-list"  :class="{'to-right': toRight, 'to-left': toLeft}" style="left: 0;" ref="list">
                <div class="table" v-for="(list, i) in environment" :key="i">
                    <ul>
                        <li v-for="(item, j) in list" :key="j" >{{item.name}}</li>
                    </ul>
                    <ul>
                        <li v-for="(item, j) in list" :key="j" >{{item.value}} {{item.value === '-'? '' : item.unit}}</li>
                    </ul>
                    <ul>
                        <li v-for="(item, j) in list" :key="j" :class="{anomaly: item.status != '正常' && item.status != '暂无设备'}">{{item.status}}</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div v-show="environmentData.length > 0" class="cut">
            <div :class="['cut-left']" @click="cut(1)"></div>
            <div :class="['cut-right']" @click="cut(0)"></div>
        </div>
        <NoData v-show="environmentData.length === 0"/>
    </div>
</template>

<script>
import NoData from '@/components/NoData'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
import { setTimeout, setInterval, clearInterval } from 'timers';
const nameSpaced = ns.MONITOR + '/'
export default {
    name: 'Environment',
    components: { NoData },
    data() {
        return {
            toRight: false,
            toLeft: false,
            environment: [],
        }
    },
    computed: {
        ...mapState ( nameSpaced , {
            environmentData: state => state.environmentData,
            environmentUpDate: state => state.environmentUpDate,
        })
    },
    watch: {
        'environmentData' () {
            const that = this
            let fm1 = that.environmentData.slice(0, 4)
            let waf = that.environmentData.slice(8, 12)
            that.environment[0] = waf.concat(fm1)
            that.environment[1] = that.environmentData.slice(0, 8)
            that.environment[2] = that.environmentData.slice(4, 12)
        }
    },
    methods: {
        cut(lr) {
            //lr? to left : to right
            const that = this
            const list = that.$refs.list
            const listStyle = list.getBoundingClientRect()
            const width = listStyle.width/2
            const table = list.getElementsByClassName('table')
            let left = 0
            function roll() {
                left += 25
                list.style.left = lr? left + 'px': '-' + left + 'px'
                if(left >= width) {
                    lr? list.insertBefore(table[2], table[0]) : list.appendChild(table[0])
                    list.style.left = 0
                    return
                }else {
                    window.requestAnimationFrame(roll)
                }
            }
            roll()
            /*
            let timer = setInterval(() => {
                if(left >= width) {
                    clearInterval(timer)
                    lr? list.insertBefore(table[2], table[0]) : list.appendChild(table[0])
                    list.style.left = 0
                    return
                }
                left += 25
                list.style.left = lr? left + 'px': '-' + left + 'px'
            }, 16)
            */
        }
    }
}
</script>
<style lang="scss" scoped>
@import '../../style/views/monitor/environment.scss'
</style>
