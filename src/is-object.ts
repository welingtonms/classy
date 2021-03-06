/**
 * Checks if `value` is an [object](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types).
 * @returns {boolean} Returns `true` if `value` is an object, `false` otherwise.
 */
 export default function isObject(value: any): boolean {
  const type = typeof value

  return value != null && ['object', 'function'].includes(type)
}
