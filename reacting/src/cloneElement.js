import { createElement } from "./createElement"

/**
 * 遍历vnode的属性，并赋值给新对象
 */
 function cloneElement(vnode, props) {

    let config={}, children;

    for (let propName in vnode.props) {
        if (propName === 'children') {
            children = vnode.props[propName]
        } else {
            config[propName] = vnode.props[propName]
        }
    }

    config = { ...config, ...props };

    let newKey = props.key ? props.key : vnode.key;
    let newRef = props.ref ? props.ref : vnode.ref;
    config['key'] = newKey;
    config['ref'] = newRef;

    return createElement(vnode.type, config, children);
}

export {
    cloneElement,
};
