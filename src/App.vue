<template>
  <v-fade-transition hide-on-leave>
    <component
      :is="layout"
      tabindex="-1"
      @keydown.ctrl="$root.$emit('on-keydown-ctrl')"
      @keyup.ctrl="$root.$emit('on-keyup-ctrl')"
    />
  </v-fade-transition>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'App',
  data: () => ({
    //
  }),
  computed: {
    layout () {
      return this.$route.meta.layout || 'clean'
    }
  }
})
</script>

<style lang="scss">
  html { overflow-y: hidden !important; }

  .v-overlay {
    backdrop-filter: blur(1px);
  }

  .v-overlay__scrim {
    backdrop-filter: blur(1px);
  }
</style>
