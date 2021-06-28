import Vue from 'vue'
import { mapGetters } from 'vuex'
import { version } from '../../package.json'

Vue.mixin(Vue.extend({
  computed: {
    $headerHeight () {
      return 64 // Высота header
    },

    $isDebug (): boolean {
      return Boolean(localStorage.getItem('debug-enabled'))
    },

    $locale (): string {
      return 'ru'
    },

    $screenHeight () {
      return this.$vuetify.breakpoint.height
    },

    $screenWidth () {
      return this.$vuetify.breakpoint.width
    },

    $version () {
      return version
    },

    ...mapGetters({
      date_time_format: 'settings/date_time_format',
      $tooltip: 'settings/tooltip'
    })
  },

  methods: {
    assertObjectHasAttribute (obj: any, key: string): boolean {
      if (obj === null || obj === undefined) { return false }
      return {}.hasOwnProperty.call(obj, key)
    },

    /**
     * Метод Window.confirm() отображает модальное диалоговое окно с дополнительным сообщением и двумя кнопками: OK и Отмена.
     */
    $confirm (): boolean {
      return window.confirm(this.$tc('Do you really want to leave? you have unsaved changes!'))
    }
  }
}))
