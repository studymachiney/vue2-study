import Dep from './dep'

let id = 0

class Watcher {
    constructor(vm, fn, options) {
        this.id = id
        this.renderWatcher = options
        this.getter = fn // getter表示调用这个函数发生取值
        this.deps = [] // 记录dep
        this.depsId = new Set()
        this.get()
    }
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    get() {
        Dep.target = this
        this.getter()
        Dep.target = null // 渲染完毕清空
    }
    update() {
        queueWatcher(this) // 暂存当前的watcher
        // this.get() // 重新渲染
    }
    run() {
        this.get()
    }
}

let queue = []
let has = []
let pending = false // 防抖

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    queue = []
    has = {}
    pending = false
    flushQueue.forEach(q => q.run())
}

function queueWatcher(watcher) {
    const id = watcher.id
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true
        if (!pending) {
            nextTick(flushSchedulerQueue, 0)
            pending = true
        }
    }
}

let callbacks = []
let waiting = false
function flushCallbacks() {
    let cbs = callbacks.slice(0)
    waiting = false
    callbacks = []
    cbs.forEach(cb => cb())
}
export function nextTick(cb) {
    callbacks.push(cb)
    if(!waiting) {
        Promise.resolve().then(flushCallbacks)
        waiting = true
    }
}

export default Watcher
