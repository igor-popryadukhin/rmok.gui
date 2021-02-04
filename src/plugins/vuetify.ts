import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

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
