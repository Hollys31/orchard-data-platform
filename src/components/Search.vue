<template>
    <div class="search">
        <input ref="input" :class="color? 'bg-color' : ''" type="text" @click.stop="" @focus="isFocus = true" v-model="key" @keyup.enter="search()" :placeholder="tips">
        <span v-show="key != ''" @click.stop="key = ''">&#xe65f;</span>
        <ul v-show="isFocus && (history.length > 0 || refer.length > 0)" class="history" :class="color? 'bg-color' : ''">
            <li v-for="(item, index) in history" :key="index" @click.stop="key = item; search()">
                {{item}}
                <span @click.stop="clearHistory(index)">&#xe65f;</span>
            </li>
            <li v-for="(item, index) in refer" :key="index + 1000" @click.stop="key = item; search()">
                {{item}}
            </li>
            <li v-show="history.length > 0" @click.stop="clearHistory()">清空列表</li>
        </ul>
        <div class="button" @click="search()">搜索</div>
    </div>
</template>

<script>
/**
 * tips: 搜索框提示文字
 * save: 搜索历史保存在localStorage的字段
 * dict: 用户输入时自动匹配的字典
 * options: 搜索选项列表
 * color: 搜索框背景颜色
 */
export default {
    name: 'Search',
    props: {
        tips: { type: String, default: '输入搜索内容' },
        save: { type: String, default: 'history' },
        dict: { type: Array, default: () => {return []}},
        options: {type: Array, default: () => {return []}},
        color: {type: Boolean, default: false}
    },
    data() {
        return {
            key: '',
            isFocus: false,
            history: [],
            refer: [],
        }
    },
    watch: {
        'key' () {
            const that = this
            if(that.key) {
                that.queryDict()
            }else {
                that.refer = []
            }
        }
    },
    created () {
        const that = this
        const history = localStorage.getItem(that.save)
        if(history != null && history != '') {
            that.history = history.split('^%')
        }
        top:
        for(let i = 0; i < that.options.length; i++) {
            for(let j = 0; j < that.history.length; j++) {
                if(that.history[j] == that.options[i]) {
                    continue top
                }
            }
            that.history.push(that.options[i])
        }
        that.setHistory()
        window.onclick = function() {
            that.isFocus = false
        }
    },
    methods: {
        queryDict () { //匹配用户查询
            const that = this
            that.refer = []
            that.dict.forEach(item => {
                let r = new RegExp(that.key)
                if( r.test(item) && that.key != item) {
                    that.refer.push(item)
                }
            })
        },
        search () {
            const that = this
            if(that.$store.state.loading) {
                return
            }
            let pass = true
            if(that.dict.length > 0) { //若有字典 则必须匹配字典才能查询
                pass = false
                that.dict.forEach(item => {
                    if( that.key == item) {
                        pass = true
                    }
                })
            }
            if(pass) {
                that.isFocus = false
                that.$emit('search', that.key)
                for(let i = 0; i < that.history.length; i++) { //搜索历史是否已存在该值
                    if(that.history[i] == that.key) {
                        return
                    }
                }

                //保存到搜索历史
                that.history.unshift(that.key)
                that.setHistory()
            }
        },
        setHistory () { //保存搜索历史
            const that = this
            let history = ''
            that.history.forEach((item, i) => { (i != that.history.length - 1) ? history += (item + '^%') : history += item })
            localStorage.setItem(that.save, history)
        },
        clearHistory (index) { //清除搜索历史
            const that = this
            if(index || index === 0) {
                that.history.splice(index, 1)
                that.setHistory()
            }else {
                that.history = []
                localStorage.removeItem(that.save)
            }
        }
    },
}
</script>

<style lang="scss" scoped>
@import '../style/components/search.scss';
</style>
