import Vue from 'vue'

Vue.mixin(Vue.extend({
  computed: {
    $screenHeight () {
      return this.$vuetify.breakpoint.height
    },

    $headerHeight () {
      return 64 // Высота header
    },

    $locale (): string {
      return 'ru'
    },

    $isDebug (): boolean {
      return Boolean(localStorage.getItem('debug-enabled'))
    }
  },

  methods: {
    assertObjectHasAttribute (obj: any, key: string): boolean {
      if (obj === null) { return false }
      return {}.hasOwnProperty.call(obj, key)
    }
  }
}))
