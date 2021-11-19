import { ProfileState } from '@/store/profile/state'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { version } from '../../package.json'

interface Data {
  [keys: string]: any;
}

interface Methods {
  [keys: string]: any;
}

interface Computed {
  $profile: ProfileState;
  [keys: string]: any;
}

interface Props {
  [keys: string]: any;
}

Vue.mixin(Vue.extend<Data, Methods, Computed, Props>({
  computed: {
    ...mapGetters({
      profileRolePermissions: 'profile/role/permissions',
      date_time_format: 'settings/date_time_format',
      $tooltip: 'settings/tooltip',
      $settings_vue_keep_alive: 'settings/vue_keep_alive'
    }),

    $profile (): ProfileState {
      return this.$store.getters['profile/profile']
    },

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
    }
  },

  methods: {
    /**
     * @deprecated
     * @param obj
     * @param key
     */
    assertObjectHasAttribute (obj: any, key: string): boolean {
      if (obj === null || obj === undefined) { return false }
      return {}.hasOwnProperty.call(obj, key)
    },

    /**
     * Метод Window.confirm() отображает модальное диалоговое окно с дополнительным сообщением и двумя кнопками: OK и Отмена.
     */
    $confirm (): boolean {
      return window.confirm(this.$tc('Do you really want to leave? you have unsaved changes!'))
    },

    /**
     * Проверяет, предоставлен ли атрибут по текущему токену.
     *
     * @param value
     * @param strict
     */
    $isGranted (value: string | string[], strict = false): boolean {
      const rolesAvailable: string[] = this.profileRolePermissions
      if (Array.isArray(value)) {
        let granted = false

        for (const role1 of rolesAvailable) {
          for (const role2 of value) {
            if (!granted) { granted = role1 === role2 }
          }
        }

        return granted
      }

      return rolesAvailable.includes(value)
    }
  }
}))
