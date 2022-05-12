import { observe } from './observe'

export function initState(vm) {
    const opts = vm.$options
    if (opts.data) {
        initData(vm)
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue
        }
    })
}

function initData(vm) {
    let data = vm.$options.data // date可能是函数或者对象

    data = typeof data === 'function' ? data.call(this) : data
    vm._data = data

    //对数据进行劫持
    observe(data)

    for(let key in data) {
        proxy(vm, '_data', key)
    }
   
}
