import {flattenChildren} from './createElement'
import {typeNumber} from './utils'

const Children = {

    //对每个子组件执行callback，返回新数组
    //context不是组件的context而是组件上下文
    map(childVnode, callback, context) {
        if (childVnode === null || childVnode === undefined) {
            return [childVnode]
        }
        if (typeNumber(childVnode) !== 7) {
            return [callback.call(context, childVnode, 0)]
        }

        // 新数组
        var ret = [];
        flattenChildren(childVnode).forEach((oldVnode, index) => {
            let newVnode = callback.call(context, oldVnode, index);
            if (newVnode === null) {
                return
            }
            ret.push(newVnode)
        });

        return ret;
    },

    //对每个子组件执行callback，无返回值
    forEach(childVnode, callback, context) {
        let flatten = flattenChildren(childVnode);

        if (typeNumber(flatten) === 7) {
            flattenChildren(childVnode).forEach(callback, context);
        } else {
            callback.call(context, childVnode, 0)
        }
    },

    // 子组件转换成数组，常用于排序前
    toArray(childVnode) {
        if (childVnode == null) {
            return [];
        }
        return Children.map(childVnode, function (el) {
            return el;
        });
    },

    //todo 检查是否只有1个子组件
    only(childVnode) {
        if (typeNumber(childVnode) !== 7) {
            return childVnode
        }
        throw new Error("React.Children.only expect only one child, which means you cannot use a list inside a component");
    },

    // 计算子组件的数量
    count(childVnode) {
        if (childVnode === null) {
            return 0
        }
        if (typeNumber(childVnode) !== 7) {
            return 1
        }
        return flattenChildren(childVnode).length
    },


};

export {
    Children,
};
