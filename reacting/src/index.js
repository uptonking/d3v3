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
    findDOMNode,
    // babel的默认设置是调用createElement这个函数
    createElement,
    render,
    cloneElement,
    createPortal,
    Children,
    Component: ReactClass,
};
