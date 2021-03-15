import Vue from 'vue'

Vue.mixin(Vue.extend({
  computed: {
    $screenHeight () {
      return this.$vuetify.breakpoint.height
    },

    $screenWidth () {
      return this.$vuetify.breakpoint.width
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
      if (obj === null || obj === undefined) { return false }
      return {}.hasOwnProperty.call(obj, key)
    }
  }
}))
