//通过toString() 来获取每个对象的类型
let __type = Object.prototype.toString;

//类型编码
var numberMap = {
    //null undefined IE6-8这里会返回[object Object]
    "[object Boolean]": 2,
    "[object Number]": 3,
    "[object String]": 4,
    "[object Function]": 5,
    "[object Symbol]": 6,
    "[object Array]": 7
    // "[object Date]": 7
};

var options = {
    async: false,
    dirtyComponent: {}
};

/**
 * 给数字类的加上'px'
 */
const specialStyle = {
    zIndex: 1
};


function styleHelper(styleName, styleNumber) {

    if (typeNumber(styleNumber) === 3) {
        const style = specialStyle[styleName] ? styleNumber : styleNumber + 'px'
        return style;
    }
    return styleNumber;
}


/**
 * 打印data数据的类型字符串，并返回相应数字
 * undefined: 0, null: 1, boolean:2, number: 3, string: 4, function: 5, symbol:6, array: 7, object:8
 * @param {any} data
 */
function typeNumber(data) {
    if (data === null) {
        return 1;
    }
    if (data === undefined) {
        return 0;
    }

    var a = numberMap[__type.call(data)];
    return a || 8;
}


/**
 * 对比新旧Vnode是否一样
 * @param {Vnode} pre
 * @param {Vnode} next
 */
function isSameVnode(pre, next) {

    if (pre.type === next.type && pre.key === next.key) {
        return true;
    }

    return false;
}


/**
 * 将节点的key放入map中
 *
 * @param {Vnode} old
 */
function mapKeyToIndex(old) {
    let hascode = {};
    old.forEach((el, index) => {
        if (el.key) {
            hascode[el.key] = index
        }
    });
    return hascode;
}


/**
 * 判断是否为与事件相关
 *
 * @param {any} name
 * @returns
 */
function isEventName(name) {
    return /^on[A-Z]/.test(name);
}

function isEventNameLowerCase(name) {
    return /^on[a-z]/.test(name);
}

/**
 * 将props的属性复制给obj
 */
function extend(obj, props) {
    for (let i in props) obj[i] = props[i];
    return obj;
}

/**
 * 空函数
 */
const noop = () => {
};

export {
    options,
    styleHelper,
    typeNumber,
    isSameVnode,
    mapKeyToIndex,
    isEventName,
    isEventNameLowerCase,
    extend,
    noop,
}
