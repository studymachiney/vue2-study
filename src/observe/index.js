import { newArrayProto } from './array'
import Dep from './dep'

class Observer {
    constructor(data) {
        this.dep = new Dep()

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

function dependArray(value) {
    for(let i = 0; i<value.length; i++) {
        let current = value[i]
        console.log(current)
        current?.__ob__?.dep.depend()
        if(Array.isArray(current)) {
            dependArray(current)
        }
    }
}

export function defineReactive(target, key, value) {
    let childOb = observe(value)
    let dep = new Dep()
    Object.defineProperty(target, key, {
        get() {
            if(Dep.target) {
                dep.depend() // 让这个属性的收集器记住当前的watcher
                if(childOb) {
                    childOb.dep.depend() // 让数组和对象本身也实现依赖收集

                    if(Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value
        },
        set(newValue) {
            if (value === newValue) return
            observe(newValue)
            value = newValue
            dep.notify()
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
