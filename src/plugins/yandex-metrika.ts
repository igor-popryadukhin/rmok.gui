import Vue from 'vue'
import router from '@/router'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueYandexMetrika from 'vue-yandex-metrika'

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueYandexMetrika, {
    id: process.env.VUE_APP_YANDEX_METRIKA_ID,
    router,
    env: process.env.NODE_ENV,
    options: {
      webvisor: true,
      triggerEvent: true
    }
  })
}
