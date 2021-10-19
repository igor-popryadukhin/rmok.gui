<template>
  <span
    :style="styles"
    class="spinner spinner--rotate-diamond"
  >
    <div
      :style="diamondStyle"
      class="diamond"
    />
    <div
      :style="diamondStyle"
      class="diamond"
    />
    <div
      :style="diamondStyle"
      class="diamond"
    />
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
    diamondStyle () {
      const size = parseInt(this.size)
      return {
        height: size / 4 + 'px',
        width: size / 4 + 'px'
      }
    },
    styles () {
      const size = parseInt(this.size)
      return {
        height: size / 4 + 'px',
        width: this.size
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  $accent: #41b883;
  $duration: 1500ms;
  $timing: linear;

  .spinner {
    position: relative;
    * {
      line-height: 0;
      box-sizing: border-box;
    }
    .diamond {
      position: absolute;
      left: 0;
      top: 0;
      border-radius: 2px;
      background: $accent;
      transform: translateX(-50%) rotate(45deg) scale(0);
      animation: diamonds $duration $timing infinite;
      @for $i from 1 through 4 {
        &:nth-child(#{$i}) {
          animation-delay: -($duration / 1.5) * $i;
        }
      }
    }
  }
  @keyframes diamonds {
    50% {
      left: 50%;
      transform: translateX(-50%) rotate(45deg) scale(1);
    }
    100% {
      left: 100%;
      transform: translateX(-50%) rotate(45deg) scale(0);
    }
  }
</style>
