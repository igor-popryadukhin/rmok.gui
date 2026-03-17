<template>
  <span
    :style="styles"
    class="spinner spinner--rotate-square4"
  >
    <span class="loader-inner" />
  </span>
</template>

<script>
export default {
  props: {
    color: {
      default: '#41b883'
    },
    size: {
      default: '40px'
    }
  },
  computed: {
    styles () {
      return {
        height: this.size,
        width: this.size
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .spinner {
    position: relative;
    border: 4px solid #41b883;
    animation: loader 2s infinite ease;
    * {
      line-height: 0;
      box-sizing: border-box;
    }
  }

  .loader-inner {
    vertical-align: top;
    display: inline-block;
    width: 100%;
    background-color: #41b883;
    animation: loader-inner 2s infinite ease-in;
  }

  @keyframes loader {
    0% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(180deg);
    }

    50% {
      transform: rotate(180deg);
    }

    75% {
      transform: rotate(360deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes loader-inner {
    0% {
      height: 0%;
    }

    25% {
      height: 0%;
    }

    50% {
      height: 100%;
    }

    75% {
      height: 100%;
    }

    100% {
      height: 0%;
    }
  }
</style>
