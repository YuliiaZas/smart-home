export function isObjectKey<T extends object>(key: string, object: T): key is Extract<keyof T, string> {
  return key in object;
}
