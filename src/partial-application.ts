/* eslint-disable @typescript-eslint/no-explicit-any */
// Based on https://dev.to/ycmjason/how-to-make-functions-partially-applicable-in-javascript--416b

/**
 * Takes the given function `fn` that expects any number of arguments and
 * returns another function that takes fewer arguments.
 * @param {function} fn - Function to be made partially applicable.
 * @returns {function}
 * @example
 * ```
 * function foo(a, b, c) {
 *  return a + b + c
 * }
 * const partiallyApplicableFoo = enablePartialApplication(foo)
 * // Now you can call partiallyApplicableFoo as:
 * partiallyApplicableFoo(1)(2)(3) // returns 6
 * partiallyApplicableFoo(1,2)(3) // returns 6
 * partiallyApplicableFoo(1)(2,3) // returns 6
 * ```
 */
 export default function enablePartialApplication(fn: (...args: any[]) => any) {
  return function partiallyAppplicable(
    ...args: any[]
  ): (...args: any[]) => any {
    if (args.length >= fn.length) {
      return fn(...args)
    }

    return enablePartialApplication(fn.bind(null, ...args))
  }
}
