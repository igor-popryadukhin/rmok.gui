<template>
  <component
    :is="layout"
    :key="2"
    tabindex="-1"
  />
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'

@Component
export default class App extends AppBase {
  get layout () {
    return this.$route.meta.layout || 'clean'
  }
}
</script>

<style lang="scss">

.is-dev {
  padding: 10px;
}
</style>
