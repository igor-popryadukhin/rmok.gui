<template>
  <div
    class="loading-bar-container"
    :style="cssVars"
  >
    <div class="bar" />
    <div
      v-show="loading"
      class="loading-bar"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { Prop } from 'vue-property-decorator';

@Component
export default class AppDivider extends Vue {
  @Prop({ default: () => 3 }) readonly thickness!: number
  @Prop({ default: () => '#3a70d4' }) readonly color!: string
  @Prop({ default: () => false }) readonly loading!: boolean

  get cssVars () {
    return {
      '--thickness': this.thickness + 'px',
      '--color': this.color
    };
  }
}
</script>

<style lang="scss" scoped>
.loading-bar-container {
  height: var(--thickness);
  width: 100%;
  position: relative;
  overflow: hidden;
}

.bar {
  height: 100%;
  width: 100%;
  background-color: var(--color);
  opacity: 0.6;
  position: absolute;
}

.loading-bar {
  height: 100%;
  width: 50%;
  background-color: var(--color);
  position: absolute;
  left: -50%;
  animation: loading 2s ease-in 0.5s infinite;
}

@keyframes loading {
  0% {
    transform:translateX(0)
  }
  to {
    transform:translateX(400%)
  }
}
</style>
