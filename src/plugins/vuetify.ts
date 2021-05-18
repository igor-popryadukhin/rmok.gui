import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import { Ripple } from 'vuetify/lib/directives'

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
