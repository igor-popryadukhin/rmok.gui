import { Dayjs } from 'dayjs'

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs (date?: dayjs.ConfigType, format?: dayjs.OptionType, locale?: string, strict?: boolean): Dayjs
  }
}
