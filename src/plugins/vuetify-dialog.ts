import Vue from 'vue'
import vuetify from '@/plugins/vuetify'

import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import i18n from '@/plugins/i18n'
import $store from '@/store'

Vue.use(VuetifyDialog, {
  context: {
    store: $store,
    i18n,
    vuetify
  }
})
