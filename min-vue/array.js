const arratProto = Array.prototype

// 创建一个对象作为拦截器
export const arrayMethods = Object.create(arratProto)

// 改变数组自身内容的七个方法
const methodToPatch = [
    'push',
    'pop',
    'unshift',
    'shift',
    'splice',
    'sort',
    'reverse'
]

methodToPatch.forEach(method => {
    const original = arratProto[method]

    Object.defineProperty(arrayMethods, method, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function mutator (...args) {
            const result = original.apply(this, args)

            const ob = this.__ob__

            ob.dep.notify()
            return result
        }
    })
})
