<template>
<div class="grid">
    <canvas ref="bg"></canvas>
</div>
</template>

<script>
export default {
    name: 'Grid',
    data() {
        return {
            ctx: null, //画布
        }
    },
    watch: {
        '$store.state.windowResizeState' () { //监听浏览器窗口变化
            this.draw()
        },
    },
    mounted() {
        this.draw()
    },
    methods: {
        draw () {
            const that = this
            const canvas = that.$refs.bg
            const style = that.$el.getBoundingClientRect()
            const w = parseInt(style.width)
            const h = parseInt(style.height)
            
            if(isNaN(w) || w === 0){
                setTimeout(that.draw(), 500)
            }else {
                canvas.width = w < 1024? 1024 : w
                canvas.height = h < 576? 576 : h
                that.ctx = canvas.getContext('2d')
                that.ctx.fillStyle = '#051a3b'
                that.ctx.fillRect (0, 0, w, h)
                that.ctx.save()
            }
            /*
            that.ctx.shadowBlur = 10 //阴影模糊尺寸
            that.ctx.shadowColor = 'rgba(255, 255, 255, 1)' //阴影颜色
            that.ctx.lineWidth = 2
            const row = [74, 70, 52, 46, 40, 36, 34, 30, 26, 24, 22, 20, 18, 16]
            let height = h
            let a = 0.05
            for(let i = 0; i < 14; i++) { //横线
                height -= row[i]
                that.ctx.strokeStyle = 'rgba(255, 255, 255,' + (a - (i * 0.006))+ ')'
                that.ctx.beginPath()
                that.ctx.moveTo(0, height)
                that.ctx.lineTo(w, height)
                that.ctx.stroke()
            }
            //height = height - 100
            const gradient = that.ctx.createLinearGradient(0, h, 0, height);
            gradient.addColorStop(0,'rgba(255, 255, 255, 0.05)');
            gradient.addColorStop(0.9,'rgba(255, 255, 255, 0)');
            gradient.addColorStop(1,'rgba(255, 255, 255, 0)');
            that.ctx.strokeStyle = gradient
            that.ctx.beginPath() //竖线4
            that.ctx.moveTo(w/10*1, h)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线5
            that.ctx.moveTo(w/10*3.5, h)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线6
            that.ctx.moveTo(w/10*6.5, h)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线7
            that.ctx.moveTo(w/10*9, h)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线3
            that.ctx.moveTo(0, h - 130)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线2
            that.ctx.moveTo(0, h - 250)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线1
            that.ctx.moveTo(0, h - 350)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线8
            that.ctx.moveTo(w, h - 130)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线9
            that.ctx.moveTo(w, h - 250)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.beginPath() //竖线10
            that.ctx.moveTo(w, h - 350)
            that.ctx.lineTo(w/2, height)
            that.ctx.stroke()
            that.ctx.save()
            */
        }
    },
    beforeDestroy() {
        this.ctx = null
    }
}
</script>

<style lang="scss" scoped>
.grid {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: -1;
}
</style>