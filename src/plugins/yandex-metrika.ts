import Vue from 'vue'
import router from '@/router'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VueYandexMetrika from 'vue-yandex-metrika'

if (process.env.NODE_ENV === 'production') {
  Vue.use(VueYandexMetrika, {
    env: process.env.NODE_ENV,
    id: process.env.VUE_APP_YANDEX_METRIKA_ID,
    options: {
      triggerEvent: true,
      webvisor: true
    },
    router
  })
}
