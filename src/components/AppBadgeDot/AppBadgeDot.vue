<template>
  <span class="badge-dot" />
</template>

<script>
export default {
  name: 'AppBadgeDot'
}
</script>

<style scoped>
.badge-dot:before {
  position: absolute;
  top: 30px;
  right: 0px;
  width: 10px;
  padding: 5px 5px;
  border-radius: 50%;
  background: #38ff00;
  color: white;
  content: "";
  overflow: visible;
  z-index: 2;
}
</style>
