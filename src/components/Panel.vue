<template>
<div class="panel">
    <div v-if="title" class="panel-title" :style="'background-image: url(' + icon + ');'">
        <span :title="title">{{title}}</span>
    </div>
    <div ref="charts" class="charts" :style="title? '' : 'height: 100%;' ">
        <slot></slot>
    </div>
    <div class="panel-tools">
        <i v-show="download" class="iconfont download-icon" @click="downloadImg()" title="下载图表">&#xe603;</i>
    </div>
    <div v-show="unit" class="panel-unit" :style="download? '' : 'display: block' ">单位：{{unit}}</div>
    <div class="corner">
        <i></i>
        <i></i>
        <i></i>
        <i></i>
    </div>
</div>
    
</template>
<script>
/**
 * 数据面板
 * title: String 面板名称, 没有该属性则不显示, 为true时预留title的高度
 * line: 是否画标题底下的线
 * top: 图表内容容器的top值
 */
export default {
    name: 'PanelBg',
    props: {
        title: { type: [String, Boolean], default: '' },
        line: {type: Boolean, default: true},
        top: {type: Number, default: 0},
        download: { type: Boolean, default: true},
        unit: {type: String, default: ''},
        icon: {type: String, default: './img/title/1.png'}
    },
    methods: {
        downloadImg (node) { // 下载成图片
            const that = this
            if(!node) {
                node = that.$refs.charts
            }
            let chartDoms = node.getElementsByClassName('chart')
            if(chartDoms.length > 0) {
                for(let i = 0; i < chartDoms.length; i++) {
                    that.downloadImg(chartDoms[i])
                }
                return
            }
            let canvasDoms = node.querySelectorAll('canvas')
            if (!canvasDoms.length) {
                return
            }
            const name = that.title? that.title : Math.random().toString(36).substr(2)
            const w = canvasDoms[0].width + 40
            const h = canvasDoms[0].height + 40

            const offlineCanvas = document.createElement('canvas')
            offlineCanvas.width = w
            offlineCanvas.height = h
            const ctx = offlineCanvas.getContext('2d')
            ctx.fillStyle = 'rgba(18, 35, 87, 0.98)'
            ctx.fillRect(0, 0, w, h)
            let canvas = null
            for (let i = 0; i < canvasDoms.length; i++) {
                canvas = canvasDoms[i]
                ctx.drawImage(canvas, 20, 20, w - 20, h - 20)
            }
            // 创建download元素下载
            const domA = document.createElement('a')
            domA.download = name
            domA.href = offlineCanvas.toDataURL('image/png')
            document.body.appendChild(domA)
            domA.click()
            domA.remove()
        },
    }
}
</script>

<style lang="scss" scoped>
@import '../style/components/panel.scss';
</style>
