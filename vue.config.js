module.exports = {
    publicPath: './',
    productionSourceMap: false,
    lintOnSave: false,
    devServer: {
        port: 8080,
        https: false,
        hotOnly: false,
        disableHostCheck: true,
        proxy: {
            '/orchard': {
                //target: 'http://trace.yufengtek.com',
                target: 'http://testorchdbs.yufengtek.com',
                //target: 'http://192.168.2.41:8090',
                //target: 'http://192.168.2.169:8090',
                changeOrigin: true
            },
        }
    }
}