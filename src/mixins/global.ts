import Vue from 'vue'

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
    }
  },

  methods: {
    assertObjectHasAttribute (obj: any, key: string): boolean {
      if (obj === null || obj === undefined) { return false }
      return {}.hasOwnProperty.call(obj, key)
    }
  }
}))
