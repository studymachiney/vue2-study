import { newArrayProto } from './array'

class Observer {
    constructor(data) {
        // Object.defineProperty只能劫持已经存在的属性(vue2单独为此写了一些api $set $delete)
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false
        })
        if(Array.isArray(data)) {
            // 重写数组的七个变异方法(可以修改数组本身的)
            data.__proto__ = newArrayProto // 保留原数组特性，并重写部分方法
            this.observeArray(data)
        } else {
            this.walk(data)
        }
    }

    walk(data) { // 循环对象，对属性依次劫持
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
    }
    observeArray(data) { // 观测数组 对属性依次劫持
      data.forEach(item => observe(item))  
    }
}

export function defineReactive(target, key, value) {
    observe(value)
    Object.defineProperty(target, key, {
        get() {
            return value
        },
        set(newValue) {
            if (value === newValue) return
            observe(newValue)
            value = newValue
        }
    })
}

export function observe(data) {
    // 只对对象进行劫持
    if (typeof data !== 'object' || data === null) {
        return
    }
    if(data.__ob__ instanceof Observer) { // 说明被代理过
        return data.__ob__
    }
    return new Observer(data)
}
