import {createElement} from './createElement'
import {cloneElement} from './cloneElement'
import {Children} from './children'
import {render, findDOMNode, createPortal} from './vdom'
import {ReactClass} from './component'

export {
    ReactClass as Component,
    Children,
    createElement,
};

export default {

    //DOM相关方法
    findDOMNode,
    render,

    //React工具方法
    createElement,
    cloneElement,
    Children,

    //组件相关
    Component: ReactClass,

    //将子节点渲染到父组件以外的DOM节点的方法
    createPortal,
}
