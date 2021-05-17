<template>
  <div v-bind:style="styles" class="spinner spinner--circle-2"></div>
</template>
<script>
export default {
  computed: {
    styles () {
      return {
        border: this.stroke + ' solid ' + this.background,
        borderTopColor: this.color,
        height: this.size,
        width: this.size
      }
    }
  },
  props: {
    background: {
      default: '#3a70d4'
    },
    color: {
      default: 'white'
    },
    size: {
      default: '40px'
    },
    stroke: {
      default: '5px'
    }
  }
}
</script>
<style lang="scss" scoped>
  .spinner {
    box-sizing: border-box;
    border-radius: 100%;
    border: 10px solid rgba(255, 255, 255, 0.2);
    animation: circle-2-spin 1s infinite linear;
  }
  @keyframes circle-2-spin {
    100% {
      transform: rotate(360deg);
    }
  }
</style>
