const types = [
    // ***************************************************************全局
    'SWITCH_LOADING', // 更改全局loading状态
    'SET_DATA_LOADING_TIPS', //设置数据加载提示信息
    'SWITCH_SCREEN_FULL', // 更改全屏状态
    'SET_CHART_FULL_ID', // 更改图表全屏状态
    'SET_NEXT_PANEL_ID', //设置下一个面板的ID
    'GET_WINDOW_SIZE', // 获取窗口宽高
    'SET_CURR_ROUTER', // 设置当前路由
    'SET_FLASH', //设置是否使用flash播放视频
    'SET_USER_TYPE', //设置用户类型
    'GET_CAMERA_TOKEN', //获取摄像头token
    'SET_CAMERA_TOKEN', //设置摄像头token
    // ***************************************************************首页
    'HOME_GET_DATA', //获取首页数据
    //设置种植分布情况数据
    'HOME_SET_PLANT_DISTRIBUTE',
    //设置总体数据
    'HOME_SET_TOTAL_DATA', 
    //设置库存比较数据
    'HOME_SET_INVENTORY_CONTRAST', 
    //设置采摘排行数据
    'HOME_SET_PICK_RANK',
    //设置溯源区域数据
    'HOME_SET_ORIGIN_REGION',
    //设置设备占比数据
    'HOME_SET_DEVICE_RATIO',
    //设置施肥用量统计数据
    'HOME_SET_FERT_QUANTITY',
    //设置种植作物出库入库总量数据
    'HOME_SET_OUTBOUND_INVENTORY',
    // ***************************************************************物联监控
    //获取初始化信息
    'MONITOR_GET_INIT_INFO',
    //获取设备数据（FM1、FM2数据）
    'MONITOR_GET_DEVICE_DATA',
    //切换fm1设备
    'MONITOR_CHANGE_FM1_DEVICE',
    //切换fm2设备
    'MONITOR_CHANGE_FM2_DEVICE',
    //切换waf设备
    'MONITOR_CHANGE_WAF_DEVICE',
    //设置果园列表
    'MONITOR_SET_ORCHARD_LIST',
    //设置当前选择果园的果园信息
    'MONITOR_SET_ORCHARD_INFO',
    //设置当前选择果园的设备数据
    'MONITOR_SET_DEVICE_DATA',
    //设置当前选择果园的设备列表
    'MONITOR_SET_DEVICE_LIST',
    //设置当前果园的环境信息
    'MONITOR_SET_ENVIRONMENT_INFO',
    //设置农事活动信息
    'MONITOR_SET_FARMING_INFO',
    //设置果树种植面积
    'MONITOR_SET_PLANT_AREA',
    //设置折线图数据
    'MONITOR_SET_LINE_DATA',
    //设置时刻或七天数据
    'MONITOR_SET_DAY_WEEK',
    //设置当前选择的摄像机
    'MONITOR_SET_CAMERA_CABLE',
    //设置当前选择的FM1设备
    'MONITOR_SET_FM1_DEVICE',
    //设置当前选择的FM2设备
    'MONITOR_SET_FM2_DEVICE',
    //设置当前选择的水肥设备
    'MONITOR_SET_WAF_DEVICE',
    //设置当前选择的设备类型
    'MONITOR_SET_DEVICE_TYPE',
    //发送摄像机控制命令
    'MONITOR_CAMERA_CTRL_CMD',
    //发送摄像机控制命令 执行中
    'MONITOR_SET_CAMERA_CTRL',
    // ***************************************************************种植分布
    'PLANT_GET_DATA', // 获取种植分布页面数据
    // ***************************************************************农事活动
    'FARMING_GET_DATA', // 获取农事活动页面数据
    // ***************************************************************出库入库
    'WAREHOUSE_GET_DATA', // 获取出库入库页面数据
    // ****************************************************************溯源数据
    'ORIGIN_GET_DATA', // 获取溯源数据
    'ORIGIN_GET_DATE_ADDRESS', //获取指定日期的溯源地址
    'ORIGIN_GET_NEXT_PAGE', //获取下一页溯源地址
    'ORIGIN_SET_DATE_ADDRESS', //设置指定日期的溯源地址
    'ORIGIN_SET_NEXT_PAGE', //设置下一页溯源地址
    'ORIGIN_SET_TIME_ADDRESS', //设置溯源地址实时数据
    'ORIGIN_SET_DISTRIBUTE_DATA', //设置溯源分布数据
    'ORIGIN_SET_RANK_DATA', //设置溯源城市排行数据
    'ORIGIN_SET_FREQUENCY_DATA', // 设置溯源次数
    'ORIGIN_SET_ADDRESS_DATA', // 设置溯源地址数据
    // ****************************************************************地图
    //获取地图
    'MAP_GET_JSON_FILE',
    //保存下载的地图
    'MAP_SAVE_MAP_JSON',
    //设置post参数
    'MAP_SET_POST_DATA',
    //设置当前选择的区域名称
    'MAP_SET_REGION_NAME',
    // ****************************************************************登录
    'LOGIN_POST_USER_IN', // 用户登录
    'LOGIN_GET_USER_OUT', // 用户登出
    'LOGIN_SET_LOG_STATUS', //设置登录状态
    'LOGIN_SET_LOG_MSG', //设置登录返回的信息
    'LOGIN_SET_VERIFY_CODE', //设置验证码
]

const typesObj = {}
types.forEach(type => { typesObj[type] = type })
export default typesObj