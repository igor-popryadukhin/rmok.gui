export function makeAudioElement (id?: string): HTMLAudioElement {
  const audioElement: HTMLAudioElement = document.createElement('audio')
  if (id) {
    audioElement.setAttribute('id', id)
  }
  audioElement.setAttribute('style', 'display: none')
  audioElement.setAttribute('controls', '')
  return audioElement
}

/**
 * Remove audio element
 * @param id
 */
export function removeAudioElement (id: string) {
  const element: HTMLElement | null = document.getElementById(id)
  if (element) {
    element.remove()
  }
}

/**
 *
 * @param obj1
 * @param obj2
 */
export function compareObjects (obj1: unknown, obj2: unknown): boolean {
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false
  }
  if (obj1 === undefined || obj2 === undefined) {
    return false
  }
  if (obj1 === null || obj2 === null) {
    return false
  }
  const obj1Keys = Object.keys(obj1)
  const obj2Keys = Object.keys(obj2)
  if (obj1Keys.length !== obj2Keys.length) {
    return false
  }
  for (const item of obj1Keys) {
    if (!obj2Keys.includes(item)) {
      return false
    }
  }
  for (let i = 0; i < obj1Keys.length; i++) {
    if (typeof obj1[obj1Keys[i]] === 'object') {
      return deepEqual(obj1[obj1Keys[i]], obj2[obj1Keys[i]])
    }
    if (obj1[obj1Keys[i]] !== obj2[obj2Keys[i]]) {
      return false
    }
  }
  return true
}
