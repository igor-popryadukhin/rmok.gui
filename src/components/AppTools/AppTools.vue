<template>
  <div
    class="d-flex app-tools"
    style="margin-bottom: 10px"
  >
    <slot name="left" />
    <v-spacer />
    <slot name="right" />
  </div>
</template>

<script>
export default {
  name: 'AppTools'
}
</script>

<style lang="scss" scoped>
  .app-tools {}
  .app-tools > *:not(:last-child) {
    margin-right: 5px;
  }
</style>
