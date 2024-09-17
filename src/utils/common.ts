export function getValue<T>(value: string, arr: T[]): T {
  const val = arr.find((item) => (item === value));

  if (!val) {
    throw new Error(`"${value}" not found in ${arr}!`);
  }

  return val as T;
}
