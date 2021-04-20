<template>
    <div v-bind:style="styles" class="spinner spinner--scale-out"></div>
</template>

<script>
export default {
  computed: {
    styles () {
      return {
        animationDuration: this.duration,
        backgroundColor: this.background,
        height: this.size,
        width: this.size
      }
    }
  },
  props: {
    background: {
      default: '#41b883'
    },
    duration: {
      default: '1.0s'
    },
    size: {
      default: '40px'
    }
  }
}
</script>

<style lang="scss" scoped>
  .spinner {
    border-radius: 100%;
    display: inline-block;
    animation: sk-scaleout 1s ease-in-out infinite;
  }
  @keyframes sk-scaleout {
    0% {
      transform: scale(0);
    } 100% {
        transform: scale(1.0);
        opacity: 0;
      }
  }
</style>
