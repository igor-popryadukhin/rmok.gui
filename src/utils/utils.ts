export function makeAudioElement (id?: string): HTMLAudioElement {
  const audioElement: HTMLAudioElement = document.createElement('audio');
  if (id) {
    audioElement.setAttribute('id', id);
  }
  audioElement.setAttribute('style', 'display: none');
  audioElement.setAttribute('controls', '');
  return audioElement;
}

/**
 * Remove audio element
 * @param id
 */
export function removeAudioElement (id: string): void {
  const element: HTMLElement | null = document.getElementById(id);
  if (element) {
    element.remove();
  }
}

/**
 *
 * @param obj1
 * @param obj2
 */
export function compareObjects (obj1: unknown, obj2: unknown): boolean {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false;
  }
  if (obj1 === undefined || obj2 === undefined) {
    return false;
  }
  if (obj1 === null || obj2 === null) {
    return false;
  }
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  if (obj1Keys.length !== obj2Keys.length) {
    return false;
  }
  for (const item of obj1Keys) {
    if (!obj2Keys.includes(item)) {
      return false;
    }
  }
  return true;
}

export function randomColor (): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function generatePassword (length = 6): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%@_^';
  let retVal = '';
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

/**
 * Генератор UUID
 */
export function generateUUID () {
  let d = new Date().getTime();
  let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;// Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16;// random number between 0 and 16
    if (d > 0) { // Use timestamp until depleted
      // tslint:disable-next-line:no-bitwise
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else { // Use microseconds since page-load if supported
      // tslint:disable-next-line:no-bitwise
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    // tslint:disable-next-line:no-bitwise
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function isEmpty (value: unknown): boolean {
  return (value === null ||
    value === '' ||
    value === undefined ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'number' && isNaN(value)));
}

/**
 * The method creates a new array with all the elements that passed the validation,
 * specified in the passed function.
 * Asynchronous!
 * @param arr
 * @param callback
 */
export async function filter<T> (arr: T[], callback: CallableFunction) {
  const fail = Symbol('filter');
  return (await Promise.all(arr.map(async (item: T) => (
    await callback(item)) ? item : fail
  ))).filter((i) => i !== fail);
}

/**
 * @param ms
 */
export async function sleep (ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
export function deleteObjectFromArray<T, V> (array: T[], propertyName: string, value: V) {
  const index = array.findIndex((e) => e[propertyName] === value);
  if (index > -1) {
    return array.splice(index, 1);
  }
  return [];
}
