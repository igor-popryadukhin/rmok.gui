import dayjs, { OpUnitType } from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ru'

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(isLeapYear)
dayjs.locale('ru')

function declOfNum (number: number, words: string[] | string): string {
  if (Array.isArray(words)) {
    return words[(number % 100 > 4 && number % 100 < 20) ? 2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]]
  }
  return words
}

interface TitleOptionsInterface {
  h: string[] | string;
  m: string[] | string;
  s: string[] | string;
}

const defaultOptions = {
  h: ['час', 'часа', 'часов'],
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

export function secondsToHmsDigital (seconds: number) {
  const h: number = Math.floor(seconds / 3600)
  const m: number = Math.floor(seconds % 3600 / 60)
  const s: number = Math.floor(seconds % 3600 % 60)

  return String(h).padStart(2, '00') + ':' + String(m).padStart(2, '00') + ':' + String(s).padStart(2, '00')
}

export function makeUnixUTCTimestampRangeString (
    method?: 'add' | 'subtract',
    amount?: number,
    unit?: OpUnitType
): string {
  switch (method) {
    case 'subtract': {
      return `${dayjs().set('hour', 0).set('minute', 0).set('second', 0).subtract(amount || 0, unit).utc().unix()},${dayjs().set('hour', 23).set('minute', 59).set('second', 59).subtract(amount || 0, unit).utc().unix()}`
    }

    case 'add': {
      return `${dayjs().set('hour', 0).set('minute', 0).set('second', 0).add(amount || 0, unit).utc().unix()},${dayjs().set('hour', 23).set('minute', 59).set('second', 59).add(amount || 0, unit).utc().unix()}`
    }

    default: return `${dayjs().set('hour', 0).set('minute', 0).set('second', 0).utc().unix()},${dayjs().set('hour', 23).set('minute', 59).set('second', 59).utc().unix()}`
  }
}
