import { def, isObject, hasOwn } from './utils/index.js'
import { arrayMethods } from './array.js'

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

class Dep{
    constructor() {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    removeSub (sub) {
        remove(this.subs, sub)
    }
    depend () {
        if (window.target) {
            this.addSub(window.target)
        }
    }
    notify () {
        const subs = this.subs.slice()
        
        for (let i = 0; i < subs.length; i++) {
            subs[i].update()
        }
    }
}

function remove (arr, item) {
    if (arr.length) return
    
    const index = arr.indexOf(item)

    if (index > -1) {
        arr.splice(index, 1)
    }
}

class Watcher{
    constructor(vm, expOrFn, cb) {
        this.vm = vm
        this.cb = cb
        this.getter = parsePath(expOrFn)
        this.value = this.get()
    }
    get () {
        window.target = this
        const vm = this.vm
        let value = this.getter.call(vm, vm)

        window.target = undefined

        return value
    }

    update () {
        const oldValue = this.value
        this.value = this.get()

        this.cb.call(this.vm, this.value, oldValue)
    }
}

const bailRE = /[^\w.$]/

function parsePath (path) {
    if (bailRE.test(path)) {
        return
    }

    const segments = path.split('.')
    return function(obj) {
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            
            if (!obj) return
            
            obj = obj[seg]
        }

        return obj
    }
}

class Observer{
    constructor(data) {
        debugger
        this.$data = data
        this.dep = new Dep()
        def(data, '__ob__', this)  // 标记转换为响应式数据
        if (Array.isArray(data)) {
            // TODO 数组响应式
            const augment = hasProto ? protoAugment : copyAugment

            augment(data, arrayMethods, arrayKeys)
        } else {
            this.walk(this.$data)
        }
    }
    observeArray (items) {
        for (let i = 0; i < items.length; i++) {
            this.observeArray(items[i])
        }
    }
    walk (obj) {
        for (let key in obj) {
            this.defineReactive(obj, key)
            this.proxyData(key)
        }
    }
    defineReactive (obj, key, val) {
        if (arguments.length === 2) {
            val = obj[key]
        }

        // if (typeof val === 'object') {
        //     new Observer(val)
        // }

        const dep = new Dep()

        const childOb = observe(val)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get () {
                console.log(`${key}被读取了: ${val}`)

                if (childOb) {
                    childOb.dep.depend()
                }

                dep.depend()  // 在getter中收集依赖 
                return val
            },
            set (newVal) {
                console.log(`${key}被修改了: ${newVal}`)

                if (newVal === val) {
                    return
                }

                val = newVal

                dep.notify()  //在setter中通知更新
            }
            
        })
    }
    proxyData (key) {
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get () {
                console.log(`proxy-${key}被读取了：${this.$data[key]}`)

                return this.$data[key]
            },
            set(newVal){
                console.log(`proxy-${key}被修改了：${newVal}`)

                if (newVal === this.$data[key]) {
                    return
                }

                this.$data[key] = newVal
            },
        })
    }
}

export function observe (value) {
    if (!isObject(value)) {
        return
    }

    let ob

    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
        ob = value.__ob__
    } else {
        ob = new Observer(value)
    }

    return ob
}


// 能力检测，因为有些浏览器不支持该属性
const hasProto = '__proto__' in {}

function protoAugment (target, src, keys) {
    target.__proto__ = src
}

function copyAugment (target, src, keys) {
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]
        def(target, key, src[key])
    }
}

let car = new Observer({
    // brand: 'BMA',
    // price: 1000000,
    color: ['yellow', 'red']
})

car.color[0]
// car.brand
// car.$data.price
