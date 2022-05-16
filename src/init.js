import { initState } from './state'
import { compileToFunction } from './compiler'
import { mountComponent } from './lifeCycle'

export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options

        // 初始化状态
        initState(vm)

        if (options.el) {
            vm.$mount(options.el) // 数据挂载
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this
        el = document.querySelector(el)
        let opts = vm.$options
        if (!opts.render) {
            let template
            if (!opts.template && el) {
                template = el.outerHTML
            } else {
                if (el) {
                    template = opts.template
                }
            }

            if (template && el) {
                // 对模板进行编译
                const render = compileToFunction(template)
                opts.render = render //最终获取render方法
            }
        }

        mountComponent(vm, el)
    }
}
