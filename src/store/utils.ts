/**
 * Удаляет объект из массива.
 *
 * @param array Массив из которого требуется удалить объект
 * @param propertyName Имя свойства объекта
 * @param value Значение для сравнения
 * @return Массив, содержащий удаленные элементы.
 * Если удален только один элемент, возвращается массив из одного элемента.
 * Если элементы не удалены, возвращается пустой массив.
 */
export function deleteObjectFromArray<T> (array: T[], propertyName: string, value: any) {
  const index = array.findIndex((e) => e[propertyName] === value)
  if (index > -1) {
    return array.splice(index, 1)
  }
  return []
}
