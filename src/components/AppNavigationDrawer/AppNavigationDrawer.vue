<template>
  <v-navigation-drawer
    v-model="panelVisible"
    :mobile-breakpoint="0"
    width="400"
    absolute
    temporary
    hide-overlay
    right
    touchless
  >
    <v-container
      class="pa-4"
      fluid
    >
      <slot />
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { ModelSync } from 'vue-property-decorator'

@Component
export default class AppNavigationDrawer extends Vue {
  @ModelSync('visible', 'change', { type: Boolean, default: () => false })
  readonly panelVisible!: boolean
}
</script>

<style lang="scss">

</style>
