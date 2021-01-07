import Vue from 'vue'
import vuetify from '@/plugins/vuetify'

import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'
import i18n from '@/plugins/i18n'

Vue.use(VuetifyDialog, {
  context: {
    i18n,
    vuetify
  }
})
