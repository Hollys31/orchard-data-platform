const localData = false //是否使用本地数据
let api = {
    localData: localData,
    //首页api
    postHomeData: '/orchard/bs/v1/home/count/fulldata/', //获取首页数据
    getCameraToken: '/orchard/bs/v1/wisdom/count/getCameraToken', //获取摄像机token

    //物联监控api
    postInitInfo: '/orchard/bs/v1/wisdom/count/info', //获取初始化信息
    postDeviceData: '/orchard/bs/v1/wisdom/count/getEquipmentData', //获取设备数据
    postCameraCtrl: '/orchard/bs/v1/wisdom/count/controllerCamera', //摄像机设备控制api
    //种植分布api
    postPlantData: '/orchard/bs/v1/plant/count/total/', //获取种植分布页面数据

    //农事活动api
    postFarmingData: '/orchard/bs/v1/work/count/autoFertilization/', //获取农事活动页面数据

    //出库入库api
    postWarehouseData: '/orchard/bs/v1/warehouse/count/total/', //获取出库入库页面数据

    //溯源数据api
    postOriginData: '/orchard/bs/v1/source/count/distributed/', //获取溯源页面数据
    postAddressData: '/orchard/bs/v1/source/count/time', //获取溯源页面的地址数据
    postNextPage: ' /orchard/bs/v1/source/count/address', //获取下一页溯源地址

    //登录api
    login: '/orchard/bs/v1/check', //用户登录
    logout: '/orchard/bs/v1/logout', //用户登出
    getverifyImg: '/orchard/bs/v1/getcode', //获取验证码

    //地图json api
    getChinaMap: '/map/', //获取全国地图
    getProvinceMap: '/map/province/', //获取省级地图json
    getCityMap: '/map/city/', //获取市、县级地图json
}
if(localData) {
    api = {
        localData: localData,
        //首页api
        postHomeData: '/json/home.json',
        getCameraToken: '', //获取摄像机token
    
        //物联监控api
        postInitInfo: '/json/monitor.json', //获取初始化信息
        postInitOrchardInfo: '/json/monitorOrchard.json', //获取初始化信息
        postDeviceData: '/json/monitorDevice.json', //获取设备数据
        postCameraCtrl: '/orchard/bs/v1/wisdom/count/controllerCamera', //摄像机设备控制api
    
        //种植分布api
        postPlantData: '/json/plant.json', //获取种植分布页面数据
    
        //农事活动api
        postFarmingData: '/json/farming.json', //获取农事活动页面数据
    
        //出库入库api
        postWarehouseData: '/json/warehouse.json', //获取出库入库页面数据
    
        //溯源数据api
        postOriginData: '/json/origin.json', //获取溯源页面数据
    
        //登录api
        login: '/json/login.json', //用户登录
        logout: '/json/logout.json', //用户登出
    
        //地图json api
        getChinaMap: '/map/', //获取全国地图
        getProvinceMap: '/map/province/', //获取省级地图json
        getCityMap: '/map/city/', //获取市、县级地图json
    }
}
export default api
