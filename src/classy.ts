import isObject from './is-object';
import isFunction from './is-function';
import toArray from './to-array';

export type FunctionCondition<T> = (value: T) => boolean;

export type PropCondition<T> = {
	[P in keyof Partial<T>]:
		| number
		| string
		| boolean
		| number[]
		| string[]
		| boolean[]
		| FunctionCondition<T[P]>
		| undefined
		| null;
};

export type ObjectCondition = {
	[key: string]: boolean | undefined | null;
};

export type ClassyCondition = string | ObjectCondition;

export type ClassierCondition<T> = {
	[key: string]: boolean | ((props: T) => boolean);
};

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

export function prop<T>(
	...conditions: PropCondition<T>[]
): (props: T) => boolean {
	const safeConditions = toArray(conditions);

	return function (props: T): boolean {
		let res = false;

		for (let i = 0; i < safeConditions.length; i++) {
			const condition = safeConditions[i];
			const keys = Object.keys(condition);

			let temp = true;

			for (let j = 0; j < keys.length && temp; j++) {
				const key = keys[j];
				const value = props[key];

				if (Array.isArray(condition[key])) {
					temp =
						temp &&
						toArray(value).every((entry) =>
							condition[key].includes(entry)
						);
				} else if (isFunction(condition[key])) {
					temp =
						temp && Boolean(condition[key](value as typeof value));
				} else {
					temp = temp && condition[key] === value;
				}
			}

			res = res || temp;
		}

		return res;
	};
}

function handleConditionObject(conditions: ObjectCondition) {
	const res = Object.keys(conditions || {}).reduce((acc, clazz) => {
		if (conditions[clazz]) {
			return [...acc, clazz];
		}

		return acc;
	}, [] as string[]);

	return res.join(' ');
}

/**
 * Concatenate style properties or class names conditionally.
 * Conditions can be boolean or other primitive types, that will be coerced to strings.
 *
 * @example
 * ```jsx
 * classy(1, 'some-class', {
 *  'class-a': true,
 *  'class-b': false,
 * })
 * ```
 * @param conditions
 * @returns {(props: Object) => string} Returns function that consumes component props.
 */
export function classy(...conditions: ClassyCondition[]): string {
	let classes: string[] = [];

	for (let i = 0; i < conditions.length; i++) {
		const condition = conditions[i];

		if (isObject(condition)) {
			classes = classes.concat(
				handleConditionObject(condition as ObjectCondition)
			);
		} else if (condition) {
			classes.push(String(condition));
		}
	}

	return classes.join(' ');
}

/**
 * Handle conditional CSS property value when using `styled-components`.
 * Conditions can be boolean or use the `prop` helper for conditions based on components props.
 * @see {@link prop prop}
 *
 * @example
 * ```jsx
 * color: ${classier({
 *   red: prop({ variant: 'danger'}),
 *   yellowgreen: prop({ variant: 'success'}),
 * })}
 * ```
 * @param conditions
 * @returns {(props: Object) => string} Returns function that consumes component props.
 */
export function classier<T>(
	...conditions: ClassierCondition<T>[]
): (props: T) => string {
	return function (props: T): string {
		let classes: string[] = [];

		for (let i = 0; i < conditions.length; i++) {
			const condition = conditions[i];

			classes = Object.keys(condition).reduce((acc, key) => {
				let value = condition[key];

				if (isFunction(value)) {
					value = (condition[key] as ReturnType<typeof prop>)(props);
				}

				if (Boolean(value)) {
					return [...acc, key];
				}

				return acc;
			}, classes);
		}

		return classes.join(' ');
	};
}

/**
 * Custom React hook that exposes `classy` and `prop` functions for a specific component.
 * Conditions can be functions that consume components props,
 * objects, strings, or numbers (that will be coerced to strings).
 * @see {@link prop prop}
 * @see {@link classy classy}
 * @example
 * ```jsx
 * import useClassy from '@cheesebit/classy';
 *
 * const { prop, classy } = useClassy(props);
 *
 * classy(1, 'some-class', {
 *  'class-a': true,
 *  'class-b': prop({ someProp: 'someValue' }),
 * })
 * ```
 * @param conditions
 * @returns {(props: Object) => string} Returns function that consumes component props.
 */
function useClassy<T>(props: T): {
	prop: (...conditions: PropCondition<T>[]) => boolean;
	classy: (...conditions: ClassyCondition[]) => string;
} {
	function getPropFunction() {
		return function getPropBasedOn(
			...conditions: PropCondition<T>[]
		) {
			return prop(...conditions)(props);
		};
	}

	return {
		prop: getPropFunction(),
		classy,
	};
}

export default useClassy;
