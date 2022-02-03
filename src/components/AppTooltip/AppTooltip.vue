<template>
  <v-tooltip
    :bottom="bottom"
    open-delay="1200"
    close-delay="500"
    max-width="300"
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
import { Prop } from 'vue-property-decorator'

@Component
export default class AppTooltip extends Vue {
  @Prop({ default: () => true }) readonly bottom!: boolean
}
</script>

<style scoped>

</style>
