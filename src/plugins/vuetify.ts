import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'
import i18n from '@/plugins/i18n'

Vue.use(Vuetify)

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
})

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    current: 'ru',
    t: (key: string, ...params: Array<string | number>) => i18n.t(key, params).toString()
  },
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#3a70d4'
      },
      light: {
        primary: '#3a70d4'
      }
    }
  }
})
