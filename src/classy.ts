import { useEffect, useRef } from 'react'

import enablePartialApplication from './partial-application'
import isObject from './is-object'
import isFunction from './is-function'
import toArray from './to-array'

export type PropCondition = {
  [key: string]: number | string | boolean | number[] | string[] | boolean[] | undefined
}

export type FunctionCondition<T> = (props: T) => boolean

export type ObjectCondition<T> = {
  [key: string]: undefined | boolean | FunctionCondition<T>
}

export type ClassCondition<T> = ObjectCondition<T> | string | undefined

/**
 * Return a function that checks conditions against a props object.
 * @param conditions
 * @returns {(props: T) => boolean}
 * @example
 * ```jsx
 * const A = (props) => (
 *   <div className={clsx({
 *      'class-a': prop({ 'prop-a': 'value-1', 'prop-b': 1, 'prop-c': true })(props)
 *    })}
 *   >
 *   </div>
 * )
 * ```
 */
export function prop<T extends Record<string, any>>(
  conditions: PropCondition | PropCondition[]
): FunctionCondition<T> {
  const safeConditions = toArray(conditions)

  return function (props: T): boolean {
    let res = false

    for (let i = 0; i < safeConditions.length; i++) {
      const condition = safeConditions[i]
      const keys = Object.keys(condition)

      let temp = true

      for (let j = 0; j < keys.length && temp; j++) {
        const key = keys[j]
        const value = props[key]

        if (Array.isArray(condition[key])) {
          temp = temp && toArray(condition[key]).includes(value)
        } else if (isFunction(condition[key])) {
          temp = temp && Boolean(condition[key](value))
        } else {
          temp = temp && condition[key] === value
        }
      }

      res = res || temp
    }

    return res
  }
}

function handleConditionObject<T>(conditions: ObjectCondition<T>, props: T) {
  const classes = Object.keys(conditions || {})

  const res = classes.reduce((acc, clazz) => {
    let value = conditions[clazz]

    if (isFunction(value)) {
      value = (conditions[clazz] as FunctionCondition<T>)(props)
    }

    if (value) {
      return [...acc, clazz]
    }

    return acc
  }, [] as string[])

  return res.join(' ')
}

/**
 * Concatenate style properties or class names conditionally.
 * Conditions can be functions that consume components props,
 * objects, strings, or numbers (that will be coerced to strings).
 * @example
 * ```jsx
 * classy(1, 'some-class', {
 *  'class-a': true,
 *  'class-b': (props) => props.showClassB,
 * }, (props) => props.className)
 * ```
 * @param conditions
 * @returns {(props: Object) => string} Returns function that consumes component props.
 */
export function classy<T>(...conditions: ClassCondition<T>[]): (props: T) => string {
  return function (props: T): string {

    let classes: string[] = []

    for (let i = 0; i < conditions.length; i++) {
      const condition = conditions[i]

      if (isObject(condition)) {
        classes = classes.concat(handleConditionObject(condition as ObjectCondition<T>, props))
      } else if (condition) {
        classes.push(String(condition))
      }
    }

    return classes.join(' ')
  }
}

/**
 * Custom React hook that exposes `classy` and `prop` functions for a specific component.
 * Conditions can be functions that consume components props,
 * objects, strings, or numbers (that will be coerced to strings).
 * @see {@link prop prop}
 * @see {@link class class}
 * @example
 * ```jsx
 * classy(1, 'some-class', {
 *  'class-a': true,
 *  'class-b': (props) => props.showClassB,
 * }, (props) => props.className)
 * ```
 * @param conditions
 * @returns {(props: Object) => string} Returns function that consumes component props.
 */
export function useClassy<T>(
  props: T
): {
  prop: (conditions: PropCondition | PropCondition[]) => boolean
  classy: (...conditions: ClassCondition<T>[]) => string
} {
  function getPropFunction() {
    return function getPropBasedOn(conditions: PropCondition | PropCondition[]) {
      return prop(conditions)(props)
    }
  }

  function getClassy() {
    return function getClassyFor(...conditions: ClassCondition<T>[]) {
      return classy<T>(...conditions)(props)
    }
  }

  return {
    prop: getPropFunction(),
    classy: getClassy(),
  }
}

export default enablePartialApplication(classy)
