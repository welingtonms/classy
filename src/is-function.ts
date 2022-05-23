export default function isFunction( value: any ): value is CallableFunction {
	const type = typeof value;

	return value != null && type == 'function';
}
