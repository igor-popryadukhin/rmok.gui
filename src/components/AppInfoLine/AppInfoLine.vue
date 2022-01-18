<template>
  <div
    class="view-info-line-wrapper"
    :style="cssVars"
  >
    <div class="view-info-line">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppInfoLine extends Vue {
  @Prop({ default: () => 0 }) readonly top!: number
  @Prop({ default: () => 50 }) readonly height!: number
  @Prop({ default: () => 400 }) readonly width!: number
  @Prop({ default: () => 1 }) readonly opacity!: number
  @Prop({ default: () => 'white' }) readonly backgroundColor!: number

  get cssVars () {
    return {
      '--background-color': this.backgroundColor,
      '--height': this.height + 'px',
      '--width': this.width + 'px',
      '--position-top': this.top + 'px',
      '--opacity': this.opacity
    }
  }
}
</script>

<style lang="scss" scoped>
.view-info-line-wrapper {
  display: flex;
  align-content: center;
  justify-content: center;
  position: absolute;
  height: var(--height);
  width: 100%;
  pointer-events: none;
  top: var(--position-top);
  left: 0;
  background-color: transparent;
  z-index: 100;
}

.view-info-line {
  pointer-events: all !important;
  height: var(--height);
  width: var(--width);
  background-color: var(--background-color);
  opacity: var(--opacity);
  padding: 10px;
  border-radius: 2px;
  user-select: none;
  z-index: 100;
}
</style>
