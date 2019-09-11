<template>
    <div class="no-data"><div class="no-data-text">{{$store.state.tips}}</div></div>
</template>

<script>
export default {
    name: 'NoData',
}
</script>

<style lang="scss" scoped>
@import '../style/components/no-data.scss';
</style>
