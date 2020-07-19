export function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
        value: val,
        enumerable: !!enumerable,
        writable: true,
        configurable: true
    })
}

export function isObject (obj) {
    return obj !== null && typeof obj === 'object'
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  
}


/**
 * 检查一个值是否为原生值
 */

 export function isPrimitive(value) {
     return (
         typeof value === 'string' ||
         typeof value === 'number' ||
         typeof value === 'symbol' ||
         typeof value === 'boolean'
     )
 }

 export function isTrue(v) {
     return v === true
 };
