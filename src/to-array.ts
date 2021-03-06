export default function toArray(value) {
  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}
