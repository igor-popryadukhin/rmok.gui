
function declOfNum (number: number, words: string[]): string {
  return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]]
}

interface TitleOptionsInterface {
  h: string[];
  m: string[];
  s: string[];
}

const defaultOptions = {
  h: ['час', 'часов', 'часа'],
  m: ['минута', 'минуты', 'минут'],
  s: ['секунда', 'секунды', 'секунд']
} as TitleOptionsInterface

export function secondsToHms (d: number, titles: TitleOptionsInterface = defaultOptions) {
  const h: number = Math.floor(d / 3600)
  const m = Math.floor(d % 3600 / 60)
  const s = Math.floor(d % 3600 % 60)

  const hDisplay = h > 0 ? ` ${h} ` + declOfNum(h, titles.h) : ''
  const mDisplay = m > 0 ? ` ${m} ` + declOfNum(m, titles.m) : ''
  const sDisplay = s > 0 ? ` ${s} ` + declOfNum(s, titles.s) : ''
  return hDisplay + mDisplay + sDisplay
}

export function secondsToHmsDigital (d: number) {
  const h: number = Math.floor(d / 3600)
  const m: number = Math.floor(d % 3600 / 60)
  const s: number = Math.floor(d % 3600 % 60)

  return String(h).padStart(2, '00') + ':' + String(m).padStart(2, '00') + ':' + String(s).padStart(2, '00')
}
