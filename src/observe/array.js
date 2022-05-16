// 重写数组中的部分方法

let oldArrayProto = Array.prototype

export let newArrayProto = Object.create(oldArrayProto)

let methods = [
    // 改变原数组的方法
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice'
]

methods.forEach(method => {
    newArrayProto[method] = function (...args) {
        // 重写数组的方法
        const result = oldArrayProto[method].call(this, ...args) // 内部调用原来的方法 函数劫持 切片编程

        // 劫持新增的数据
        let inserted
        let ob = this.__ob__
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
            default:
                break
        }
        
        if(inserted) {
            ob.observeArray(inserted)
        }
        
        ob.dep.notify()
        return result
    }
})
