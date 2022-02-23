<template>
  <div
    class="dot-pulse-wrapper"
    :style="style"
  >
    <div class="dot-pulse" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppSpinnerFadingCircle extends Vue {
  @Prop({ default: '#767676FF' }) readonly color: string
  // @Prop({ default: 18 }) readonly size: number | string

  get style () {
    return {
      '--color': this.color,
      // '--size': typeof this.size === 'string' ? this.size : this.size + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>

.dot-pulse-wrapper {
  width: 70px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

.dot-pulse {
  position: relative;
  left: -9999px;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: var(--color);
  color: var(--color);
  box-shadow: 9999px 0 0 -5px var(--color);
  animation: dotPulse 1.5s infinite linear;
  animation-delay: .25s;
}

.dot-pulse::before, .dot-pulse::after {
  content: '';
  display: inline-block;
  position: absolute;
  top: 0;
  width: 8px;
  height: 8px;
  border-radius: 5px;
  background-color: var(--color);
  color: var(--color);
}

.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px var(--color);
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px var(--color);
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: .5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9984px 0 0 -5px #9880ff;
  }
  30% {
    box-shadow: 9984px 0 0 2px #9880ff;
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px #9880ff;
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -5px #9880ff;
  }
  30% {
    box-shadow: 9999px 0 0 2px #9880ff;
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px #9880ff;
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px #9880ff;
  }
  30% {
    box-shadow: 10014px 0 0 2px #9880ff;
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px #9880ff;
  }
}

</style>
