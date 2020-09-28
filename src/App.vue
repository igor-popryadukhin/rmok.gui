<template>
  <component
    :is="layout"
    tabindex="-1"
    @keydown.ctrl="$root.$emit('on-keydown-ctrl')"
    @keyup.ctrl="$root.$emit('on-keyup-ctrl')"
  />
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
  html { overflow-y: auto }
</style>
