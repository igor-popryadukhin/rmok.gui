<template>
  <hr class="app-divider"/>
</template>

<script>
export default {
  name: 'AppDivider'
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
  border-width: thin 0 0 0;
  transition: inherit;
}
</style>
