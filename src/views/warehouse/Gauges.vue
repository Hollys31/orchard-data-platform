<template>
    <div class="gauges">
        <div class="gauge">
            <div>{{data.inDay ? data.inDay : 0}}<span>&nbsp;{{data.unit}}</span></div>
            <div>入库</div>
            <div>今日入库信息</div>
        </div>
        <div class="gauge">
            <div>{{data.outDay ? data.outDay : 0}}<span>&nbsp;{{data.unit}}</span></div>
            <div>出库</div>
            <div>今日出库信息</div>
        </div>
        <div class="gauge">
            <div>{{data.surplus ? data.surplus : 0}}<span>&nbsp;{{data.unit}}</span></div>
            <div>库存</div>
            <div>剩余库存</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Gauges',
    props: {
        data: {type: Object, default: {inDay: 0, outDay: 0, surplus: 0, unit: 'KG'}}
    }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 1366px){
    .gauges {
        >div {
            >div {
                &:nth-child(1) {
                    font-size: 16px;
                    >span {
                        font-size: 12px;
                    }
                }
                &:nth-child(2) {
                    font-size: 14px;
                    line-height: 16px;
                }
                &:nth-child(3) {
                    font-size: 14px;
                    line-height: 30px;
                }
            }
        }
    }
}
@media screen and (min-width: 1367px){
    .gauges {
        >div {
            >div {
                &:nth-child(1) {
                    font-size: 20px;
                    >span {
                        font-size: 14px;
                    }
                }
                &:nth-child(2) {
                    font-size: 18px;
                    line-height: 30px;
                }
                &:nth-child(3) {
                    font-size: 16px;
                    line-height: 60px;
                }
            }
        }
    }
}
.gauges {
    width: 88%;
    height: 100%;
    padding: 0 6%;
    display: flex;
    >div {
        width: 34%;
        height: 70%;
        padding-top: 10%;
        text-align: center;
        background-repeat: no-repeat;
        background-position: center 30%;
        background-size: auto 50%;
        >div {
            &:nth-child(1) {
                font-weight: 600;
                >span {
                    font-weight: 400;
                }
            }
            &:nth-child(2) {
                font-weight: 600;
            }
        }
        &:nth-child(1) {
            background-image: url('../../assets/images/icons/103.png');
        }
        &:nth-child(2) {
            background-image: url('../../assets/images/icons/104.png');
        }
        &:nth-child(3) {
            background-image: url('../../assets/images/icons/105.png');
        }
    }
}
</style>
