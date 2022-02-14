<template>
  <v-navigation-drawer
    v-model="panelVisible"
    :mobile-breakpoint="0"
    :right="right"
    :width="width"
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
  @Prop({ type: Number, default: () => 400 }) width!: number|string
  @Prop({ type: [Number, String], default: () => '100%' }) height!: number|string
  @Prop({ type: Boolean, default: () => true }) right!: boolean
  @VModel({ type: Boolean, default: () => false }) panelVisible!: boolean
}
</script>

<style lang="scss">

</style>
