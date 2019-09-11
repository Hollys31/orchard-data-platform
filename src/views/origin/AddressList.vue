<template>
<div class="address-list">
    <el-date-picker type="date" v-model="currSelectedDate" :picker-options="pickerOptions" align="right" @change="doDatePickerChange" ></el-date-picker>
    <div class="iconfont">&#xe7a3;</div>
    <Panel icon="./img/title/23.png" title="溯源地址" :download="false"> 
        <div class="plane-content">
            <vue-scroll ref="scroll" :ops="scrollOptions"  @handle-scroll="handleScroll">
                <ul class="list-container">
                    <li v-for="(item, index) in originAddress" :key="index">
                        <div class="item-title">{{ item.date }}</div>
                        <ul>
                            <li class="sub-item" v-for="(subItem, subIndex) in item.list" :key="subIndex">
                                <div v-show="subItem.prov" :title="subItem.prov">{{ subItem.prov }}</div>
                                <div v-show="subItem.city" :title="subItem.city">{{ subItem.city }}</div>
                                <div v-show="subItem.town" :title="subItem.town">{{ subItem.town }}</div>
                                <div v-show="subItem.village" :title="subItem.village">{{ subItem.village }}</div>
                                <div v-show="subItem.addr" :title="subItem.addr">{{ subItem.addr }}</div>
                                <div v-show="subItem.name" :title="subItem.name">{{ subItem.name }}</div>
                                <div v-show="subItem.time" :title="subItem.time">{{ subItem.time }}</div>
                                <div v-show="subItem.phone" :title="subItem.phone">{{ subItem.phone }}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </vue-scroll>
        </div>
        <NoData v-show="originAddress.length === 0" />
    </Panel>
</div>
</template>
<script>
import NoData from '@/components/NoData'
import echarts from '@/lib/echarts'
import { formatTime } from '@/lib/util'
import types from '@/store/constants/types'
import ns from '@/store/constants/ns'
import { mapState } from 'vuex'
const nameSpaced = ns.ORIGIN + '/'

export default {
    name: 'AddressList',
    components: { NoData },
    computed: {
        ...mapState ( nameSpaced , {
            originAddress: state => state.originAddress,
            maxPageNum: state => state.maxPageNum,
        })
    },
    watch: {
        'originAddress'() {
            const that = this
            if(that.currSelectedDate) {
                that.moveToDate(that.currSelectedDate)    
            }
        }
    },
    data () {
        return {
            currSelectedDate: '',
            scrollOptions: {
                bar: {
                    background: 'rgba(51, 126, 255, 1)'
                }
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
            },
            page: 1, //当前页数
        }
    },
    methods: {
        doDatePickerChange (date) {
            const that = this
            that.currSelectedDate = formatTime(date, 'yyyy-MM-dd')
            that.moveToDate()
            //scroll.scrollTo( { x: 0, y: 0 } )
        },
        handleScroll(vertical, horizontal, nativeEvent) {
            const that = this
            if(vertical.process === 1 && that.page < that.maxPageNum) {
                ++that.page
                that.$store.dispatch(nameSpaced + types.ORIGIN_GET_NEXT_PAGE, {page: that.page})
            }
        },
        moveToDate () {
            const that = this
            const scroll = that.$refs.scroll
            const len = that.originAddress.length
            let count = 0
            for(let i = 0; i < len; i++) {
                if(i) {
                    count += that.originAddress[i-1].list.length
                }
                if(that.currSelectedDate === that.originAddress[i].date) {
                    scroll.scrollTo( { x: 0, y: count * 50 + i * 50 - i * 20 } )
                    return
                }
            }
            that.$store.dispatch(nameSpaced + types.ORIGIN_GET_DATE_ADDRESS, {time: that.currSelectedDate})
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../../style/views/origin/address-list.scss';
</style>
