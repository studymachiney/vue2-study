import { createElementVNode, createTextVNode } from './vdom/index'
import Watcher from './observe/watcher'

function createElm(vnode) {
    let { tag, data, children, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        patchProps(vnode.el, data)
        children.forEach(child => vnode.el.appendChild(createElm(child)))
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function patchProps(el, props) {
    for (let key in props) {
        if (key === 'style') {
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        } else {
            el.setAttribute(key, props[key])
        }
    }
}

function patch(oldVNode, vnode) {
    const isRealElement = oldVNode.nodeType
    if (isRealElement) {
        const elm = oldVNode
        const parentElm = elm.parentNode
        let newElm = createElm(vnode)
        parentElm.insertBefore(newElm, elm.nextSibling)
        parentElm.removeChild(elm) //删除旧节点
        return newElm
    } else {
        // diff算法
    }
}

export function initLifeCycle(Vue) {
    // 将虚拟dom转化成真实的dom
    Vue.prototype._update = function (vnode) {
        const vm = this
        const el = vm.$el

        // patch既有初始化的功能，又有更新的功能
        vm.$el = patch(el, vnode)
    }

    Vue.prototype._c = function () {
        return createElementVNode(this, ...arguments)
    }
    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments)
    }
    Vue.prototype._s = function (value) {
        return typeof value === 'string' ? value : JSON.stringify(value)
    }

    Vue.prototype._render = function () {
        return this.$options.render.call(this)
    }
}

export function mountComponent(vm, el) {
    vm.$el = el
    // 调用render方法生成虚拟dom
    const updateComponent = () => {
        vm._update(vm._render())
    }

    const watcher = new Watcher(vm, updateComponent, true) // true用于标识是一个渲染watcher
    console.log(watcher)

    // 根据虚拟dom生成真实dom

    // 插入到el元素中
}

// vue核心流程
//  1.创造响应式数据
//  2.模板转化成ast语法树
//  3.将ast语法树转换成render函数
//  4.后续每次数据更新只执行render函数
