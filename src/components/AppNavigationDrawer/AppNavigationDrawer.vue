<template>
  <v-navigation-drawer
    v-model="panelVisible"
    :mobile-breakpoint="0"
    :right="right"
    width="400"
    absolute
    temporary
    hide-overlay
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
import { Prop, VModel } from 'vue-property-decorator'

@Component
export default class AppNavigationDrawer extends Vue {
  @Prop({ type: Boolean, default: () => true }) right!: boolean
  @VModel({ type: Boolean, default: () => false }) panelVisible!: boolean
}
</script>

<style lang="scss">

</style>
