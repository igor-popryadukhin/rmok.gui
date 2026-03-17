import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { Ripple } from 'vuetify/lib/directives';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ru from 'vuetify/lib/locale/ru';

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    locales: { ru },
    current: 'ru'
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
});
