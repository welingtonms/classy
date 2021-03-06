/**
 * Checks if `value` is a function.
 * @returns {boolean} Returns `true` if `value` is a function, `false` otherwise.
 */
 export default function isFunction(value: any): boolean {
  const type = typeof value

  return value != null && type == 'function'
}
