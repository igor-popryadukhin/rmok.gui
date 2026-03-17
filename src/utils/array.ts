/**
 * Объединение двух массивов объектов.
 *
 * @param array1
 * @param array2
 * @param key Свойство признака сравнения двух объектов.
 */
export function arrayObjectsUniqueMerge<T> (array1: T[], array2: T[], key: string): T[] {
  let start = 0;
  const merge: T[] = [];
  while (start < array1.length) {
    if (array1[start][key] !== array2[start][key]) {
      merge.push({ ...array1[start], ...array2[start] });
    }
    start = start + 1;
  }
  return merge;
}

/**
 * Объединение двух массивов объектов.
 *
 * @param array1
 * @param array2
 * @param key Свойство признака сравнения двух объектов.
 */
export function arrayObjectsUniqueConcat<T> (array1: T[], array2: T[], key: string): T[] {
  const items = [].concat(array1, array2);
  return [...new Set(items.map((item: T) => item[key]))]
    .map((e1: string | number) => {
      return items.find((e2) => e2[key] === e1);
    });
}
