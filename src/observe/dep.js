let id = 0

class Dep {
    constructor() {
        this.id = id++
        this.subs = [] // 存放当前属性对应的watcher有哪些
    }
    depend() {
        Dep.target.addDep(this)
        // this.subs.push(Dep.target)
    }
    addSub(watcher) {
        this.subs.push(watcher)
    }
    notify() {
        this.subs.forEach(watcher => watcher.update())
    }
}
Dep.target = null

export default Dep