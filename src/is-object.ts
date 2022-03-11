export default function isObject(value: any): boolean {
	const type = typeof value;

	return value != null && ['object', 'function'].includes(type);
}
