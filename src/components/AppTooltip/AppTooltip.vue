<template>
  <v-tooltip
    open-delay="1200"
    close-delay="500"
    max-width="300"
    bottom
  >
    <template #activator="{ on, attrs }">
      <slot
        name="activator"
        :on="on"
        :attrs="attrs"
      />
    </template>
    <slot />
  </v-tooltip>
</template>

<script lang="ts">

import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class AppTooltip extends Vue {}
</script>

<style scoped>

</style>
