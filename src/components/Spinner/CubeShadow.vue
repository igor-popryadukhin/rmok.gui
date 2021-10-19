<template>
  <div
    :style="styles"
    class="spinner spinner--cube-shadow"
  />
</template>

<script>
export default {
  props: {
    background: {
      default: '#41b883'
    },
    duration: {
      default: '1.8s'
    },
    size: {
      default: '40px'
    }
  },
  computed: {
    styles () {
      return {
        animationDuration: this.duration,
        backgroundColor: this.background,
        height: this.size,
        width: this.size
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .spinner{
    animation: cube-shadow-spinner 1.8s cubic-bezier(0.75, 0, 0.5, 1) infinite;
  }
  @keyframes cube-shadow-spinner {
    50% {
      border-radius: 50%;
      transform: scale(0.5) rotate(360deg);
    }
    100% {
      transform: scale(1) rotate(720deg);
    }
  }
</style>
