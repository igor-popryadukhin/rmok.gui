
/**
 * Creates an instance of an audio element
 * @param id
 */
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
