<template>
  <hr
    class="app-divider"
    :style="cssVars"
  >
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppDivider extends Vue {
  @Prop({ default: () => 3 }) readonly thickness: number

  get cssVars () {
    return {
      '--thickness': this.thickness + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-divider {
  display: block;
  flex: 1 1 0px;
  max-width: 100%;
  height: 0px;
  max-height: 0px;
  border: solid;
  border-width: thin 0px var(--thickness) 0px;
  transition: inherit;
  color: #3a70d4;
}
</style>
