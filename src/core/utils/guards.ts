export function atOrThrow<T>(
  items: readonly T[],
  index: number,
  message = `Missing item at index ${index}`,
): T {
  const item = items[index];
  if (item === undefined) {
    throw new Error(message);
  }
  return item;
}

export function valueOrThrow<T>(
  value: T | null | undefined,
  message: string,
): T {
  if (value == null) {
    throw new Error(message);
  }
  return value;
}
