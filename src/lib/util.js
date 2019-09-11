// 获取url上的参数
export function getQueryString(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
    const r = location.search.substr(1).match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
}
// cookie操作
export function cookie(name, value, expireDay) {
    if (!name) {
        return
    }
    let arr = null
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if (value == null) { // 获取cookie
        arr = document.cookie.match(reg)
        if (arr) {
            return decodeURIComponent(arr[2])
        }
        return null
    } else { // 设置cookie
        if (!expireDay) {
            expireDay = 10
        }
        const exp = new Date()
        exp.setTime(exp.getTime() + expireDay * 24 * 60 * 60 * 1000)
        document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString()
    }
}

// 时间格式化
export function formatTime(date = new Date, format = 'yyyy-MM-dd hh:mm:ss') {
    const o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
    }

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }

    for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
        }
    }
    return format
}
//浏览器判断
export function getBrowserType() {
    let userAgent = navigator.userAgent //取得浏览器的userAgent字符串 
    let isOpera = userAgent.indexOf("Opera") > -1 //判断是否Opera浏览器 
    // let isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera //判断是否IE浏览器 
    let isIE = window.ActiveXObject || "ActiveXObject" in window
    // let isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE //判断是否IE的Edge浏览器 
    let isEdge = userAgent.indexOf("Edge") > -1 //判断是否IE的Edge浏览器
    let isFF = userAgent.indexOf("Firefox") > -1 //判断是否Firefox浏览器 
    let isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1 //判断是否Safari浏览器 
    let isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && !isEdge //判断Chrome浏览器 

    if (isIE) {
        let reIE = new RegExp("MSIE (\\d+\\.\\d+);")
        reIE.test(userAgent)
        let fIEVersion = parseFloat(RegExp["$1"])
        if (userAgent.indexOf('MSIE 6.0') != -1) { return "IE6" }
        else if (fIEVersion == 7) { return "IE7" }
        else if (fIEVersion == 8) { return "IE8" }
        else if (fIEVersion == 9) { return "IE9" }
        else if (fIEVersion == 10) { return "IE10" }
        else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) { return "IE11" }
        else { return "0" }//IE版本过低
    }//isIE end 

    if (isFF) { return "FF" }
    if (isOpera) { return "Opera" }
    if (isSafari) { return "Safari" }
    if (isChrome) { return "Chrome" }
    if (isEdge) { return "Edge" }
}

export function ttof(str) { //true to false 
    if (str) {
        try {
            str = window.btoa ? window.btoa(str) : str
        } catch (error) {

        }
        return str
    }
}

export function ftot(str) { //false to true
    if (str) {
        try {
            str = window.atob ? window.atob(str) : str
        } catch (error) {

        }
        return str
    }
}

//获取图表容器元素
function getChartsNode(el, name) {
    if (el) {
        const className = el.getAttribute('class')
        if (!name) {
            name = 'charts'
        }
        if (className === name || className === 'chart') {
            return el
        } else if (el.localName === 'body') {
            return false
        }
        return getChartsNode(el.parentNode, name)
    }
}

//获取DOM元素大小
export function getElementSize(el, name) {
    const node = getChartsNode(el, name)
    if (node) {
        const elStyle = node.getBoundingClientRect()
        return { height: elStyle.height, width: elStyle.width }
    } else {
        return { height: 0, width: 0 }
    }
}

//图表容器大小改变监听器
export function setElementResizeListeners(el, callback) {
    const node = getChartsNode(el)
    if (node) {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
        const observer = new MutationObserver((mutationList) => {
            callback()
        })
        observer.observe(node, {
            childList: false, //是否观察子节点的变动
            attributes: true, //是否观察属性的变动
            characterData: false, //是否节点内容或节点文本的变动
            subtree: false, //是否观察所有后代节点的变动
            attributeOldValue: false, //观察 attributes 变动时，是否记录变动前的属性值
            characterDataOldValue: false, //观察 characterData 变动时，是否记录变动前的属性值
            attributeFilter: ['resize'], //表示需要观察的特定属性（比如['class','src']），不在此数组中的属性变化时将被忽略
        })
    }
}

//获取最大刻度
export function getMax(arr, max = 0) {
    if (!max) {
        arr.forEach(item => {
            if (item instanceof Array) {
                item.forEach(val => {
                    if (val > max) {
                        max = val
                    }
                })
            } else {
                if (item > max) {
                    max = item
                }
            }
        })
    }
    if (max === 0) {
        return 100
    }
    if (max < 0.1) {
        return max > 0.04 ? (max > 0.08 ? 0.12 : 0.08) : 0.04
    }
    if (max < 1) {
        return max > 0.4 ? (max > 0.8 ? 1.2 : 0.8) : 0.4
    }
    if (max < 10) {
        return max > 4 ? (max > 8 ? 12 : 8) : 4
    }
    function a(max, n = 1) {
        if (max / n < 100) {
            max = parseInt(max / n) * n
            max += n === 1 ? 10 - max % 10 : n
            return max % 4 ? max + 10 : max
        }
        return a(max, n * 10)
    }
    return a(max)
}

//浏览器全屏
export function fullScreen() {
    var el = document.documentElement;
    var rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
        el.mozRequestFullScreen || el.msRequestFullScreen;
    if (typeof rfs != "undefined" && rfs) {
        rfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}

//退出浏览器全屏
export function exitFullScreen() {
    var el = document;
    var cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
        el.mozCancelFullScreen || el.exitFullScreen;
    if (typeof cfs != "undefined" && cfs) {
        cfs.call(el);
    } else if (typeof window.ActiveXObject != "undefined") {
        //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript != null) {
            wscript.SendKeys("{F11}");
        }
    }
}