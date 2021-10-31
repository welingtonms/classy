export default function isFunction(value: any): boolean {
  const type = typeof value;

  return value != null && type == "function";
}
