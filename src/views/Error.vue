<template>
    <div class="error">
        <div class="error-word"></div>
        <div class="to-website"><a href="//www.yufengtek.com"></a></div>
        <div class="to-from" @click="refresh()"></div>
    </div>
</template>

<script>
export default {
    name: 'Error',
    methods: {
        refresh() {
            const that = this
            const from = that.$store.state.currRouter.from
            if(from) {
                that.$router.push(from)
            }else {
                that.$store.state.orchardId ? that.$router.push('monitor') : that.$router.push('home')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100% !important;
    height: 100% !important;
    //min-width: 1024px;
    //min-height: 576px;
    padding: 0 !important;
    background-image: url('../assets/images/error.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    .error-word {
        position: absolute;
        left: 0;
        top: 0;
        width: 15.25rem;
        margin-top: 7rem;
        margin-left: 2.5rem;
        height: 7.175rem;
        background-image: url('../assets/images/icons/64.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .to-website, .to-from {
        width: 5.35rem;
        height: 1.6rem;
        margin-left: 2.5rem;
        margin-top: 15rem;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
    }
    .to-website {
        background-image: url('../assets/images/icons/63.png');
        >a {
            display: block;
            width: 100%;
            height: 100%;
        }
    }
    .to-from {
        background-image: url('../assets/images/icons/62.png');
    }
}
</style>
