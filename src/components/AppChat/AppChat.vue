<template>
  <div
    class="d-flex app-chat-container"
    :style="style"
  >
    <div class="app-chat-wrap-messages">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, PropSync, Ref } from 'vue-property-decorator'

@Component
export default class AppBlockResize extends Vue {
  @Prop({ default: '#f2f2f2' }) bgColor!: string

  get style () {
    return {
      backgroundColor: `${this.bgColor}`
    }
  }
}
</script>

<style lang="scss" scoped>
.app-chat-wrap-messages {
  width: 100%;
  padding: 12px;
}

.app-chat-container {
  box-sizing: border-box;
  height: calc(100vh - 266px);
  overflow-y: auto;
  padding: 10px;
}
</style>
