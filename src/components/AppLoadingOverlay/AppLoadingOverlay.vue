<template>
  <div
    class="app-loading-overlay-wrapping"
  >
    <div class="message">
      {{ $tc(message) }}
    </div>
    <div style="width: 250px">
      <v-progress-linear
        :color="$vuetify.theme.currentTheme.primary"
        indeterminate
        height="6"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class AppLoadingOverlay extends Vue {
  @Prop({ default: 'Loading content...' }) readonly message: string
}
</script>

<style lang="scss" scoped>

.app-loading-overlay-wrapping {
  display: flex;
  align-content: center;
  justify-content: center;
  position: absolute;
  height: 100%;
  width: 100%;
  pointer-events: none;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.24);
  z-index: 1;
}
</style>
