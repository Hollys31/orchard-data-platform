//对服务器返回的数据格式化处理函数
export default {
    /**
     * 把数据处理成{titles:['name1', 'name2',...], values: [value1, value2,...]}的数据格式
     * @param {Object} data 待处理的数据对象
     * @param {String} name  作为name的字段 
     * @param {String} value 作为值的字段
     * @param {Int} decimal 小数保留位数
     */
    arr (data, name, value, decimal = 2) {
        const len = data.length
        let titleArr = []
        let valueArr = []
        for(let i = 0; i < len; i++) {
            if(data[i]){
                if(data[i][name]) {
                    titleArr.push(data[i][name])
                }
                if(data[i][value]) {
                    if(data[i][value] == parseInt(data[i][value])) {
                        valueArr.push(data[i][value])
                    }else {
                        valueArr.push( parseFloat( parseFloat(data[i][value]).toFixed(decimal) ) )
                    }
                }else {
                    valueArr.push(0)
                }
            }
        }
        return { titles: titleArr, values: valueArr }
    },
    /**
     * 把数据处理成{data: [{name: 'name', value: value},...]}对象形式
     * @param {Object} data 待处理的数据对象
     * @param {String} name  作为name的字段 
     * @param {String} value 作为值的字段
     * @param {Int} decimal 小数保留位数
     * @param {Boolean} is0 是否舍弃值为0的项
     */
    obj (data, name, value, decimal = 2, is0 = true) {
        const len = data.length
        let dataArr = []
        for(let i = 0; i < len; i++) {
            if(data[i]){
                let num = 0
                if(data[i][value]) {
                    if(data[i][value] == parseInt(data[i][value])) {
                        num = parseInt(data[i][value])
                    }else {
                        num = parseFloat(parseFloat(data[i][value].toFixed(decimal)))
                    }
                }
                if(data[i][name]) {
                    if(num || is0) {
                        dataArr.push(
                            {
                                name: data[i][name],
                                value: num
                            }
                        )
                    }
                }
            }
        }
        return { data: dataArr }
    },
    /**
     * 把数据处理成多维数组形式
     * @param {Object} data 待处理的数据对象
     * @param {String} param 需要处理的字段
     * 返回 [[param1, param2], [param1, param2], [param1, param2]]
     */
    coord (data) {
        const len = data.length
        const argLen = arguments.length
        let dataArr = []
        for(let i = 0; i < len; i++) {
            if(data[i]){
                let arr = []
                for(let j = 1; j < argLen; j++) {
                    arr.push( data[i][ arguments[j] ])
                }
                dataArr.push(arr)
            }
        }
        return dataArr
    },
    /**
     * 按照日期进行排序
     * @param {Array} data 
     * @param {String} name 日期存放的字段  格式 2019-06-04
     */
    dateSort (data, name) {
        const len = data.length
        for(let i = 0; i < len; i++) {
            if(!data[i]){continue}
            for(let j = 0; j < len - 1 - i; j++) {
                let beforYear = parseInt(data[j][name])
                let beforMonth = parseInt(data[j][name].slice(5, 7))
                let beforDay = parseInt(data[j][name].slice(8, 10))
                let afterYear = parseInt(data[j + 1][name])
                let afterMonth = parseInt(data[j + 1][name].slice(5, 7))
                let afterDay = parseInt(data[j + 1][name].slice(8, 10))
                if(beforYear > afterYear) {
                    let item = data[j]
                    data[j] = data[j + 1]
                    data[j + 1] = item
                }else if(beforYear === afterYear && beforMonth > afterMonth) {
                    let item = data[j]
                    data[j] = data[j + 1]
                    data[j + 1] = item
                }else if(beforYear === afterYear && beforMonth === afterMonth && beforDay > afterDay) {
                    let item = data[j]
                    data[j] = data[j + 1]
                    data[j + 1] = item
                }
            }
        }
        return data
    }
}