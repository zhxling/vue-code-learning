import VNode, {createEmptyVnode} from './vnode'

import { isPrimitive, isTrue, isDef } from '../utils/index'
import {
    normalizeChildren,
    simpleNormalizeChildren
} from './helpers/index'

const SIMPLE_NORMALIZE = 1
const ALWAYS_NORMALIZE = 2

/** 
 * return: VNode | Array<VNode>
*/
export function createElememnt(
    context,  // component
    tag,      // 元素标签名
    data,     // VNodeData
    children, // VNode
    normalizationType,    // ????
    alwaysNormalize      // ???
){
    if(Array.isArray(data) || isPrimitive(data)) {
        normalizationType = children
        children = data
        data = undefined
    }

    if(isTrue(alwaysNormalize)) {
        normalizationType = ALWAYS_NORMALIZE
    }

    return _createElement(context, tag, data, children, normalizationType)
};


export function _createElement(
    context,
    tag,
    data,
    children,
    normalizationType
){
    // 保证对象不能重复引用
    if(isDef(data) && isDef(data.__ob__)) {
        process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
            'Always create fresh vnode data objects in each render!',
            context
        )
        return createEmptyVNode()
    }

    // v-bind中的对象语法
    if(isDef(data) && isDef(data.is)) {
        tag = data.is
    }

    // 在这个组件中：is被设置为假值
    if(!tag) {
        return createEmptyVnode()
    }

    // warn against non-primitive key
    // 模板里面的key必须为number或string
    if (process.env.NODE_ENV !== 'production' &&
        isDef(data) && isDef(data.key) && !isPrimitive(data.key)
        ) {
        if (!__WEEX__ || !('@binding' in data.key)) {
            warn(
            'Avoid using non-primitive value as key, ' +
            'use string/number value instead.',
            context
            )
        }
    }

    // 支持单函数作为默认插槽  ???
    if(Array.isArray(children) &&
        typeof children[0] === 'function'
    ) {
        data = data || {}
        data.scopeSlots = { default: children[0] }
        children.length = 0
    }
    

    if(normalizationType === ALWAYS_NORMALIZE) {
        children = nor
    }
};