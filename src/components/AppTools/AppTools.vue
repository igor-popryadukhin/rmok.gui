<template>
  <div
    class="d-flex app-tools"
    style="margin-bottom: 10px"
  >
    <slot name="left"></slot>
    <v-spacer />
    <slot name="right"></slot>
  </div>
</template>

<script>
export default {
  name: 'AppTools'
}
</script>

<style lang="scss" scoped>
  .app-tools {}
  .app-tools > * {
    margin-right: 5px;
  }
</style>
