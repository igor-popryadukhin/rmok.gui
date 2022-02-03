<template>
  <div
    :style="styles"
    class="spinner spinner--rotate-square-6"
  >
    <div
      :style="outerStyles"
      class="inner-square inner-square-1"
    />
    <div
      :style="innerStyles"
      class="inner-square inner-square-2"
    />
  </div>
</template>
<script>
export default {
  props: {
    color: {
      default: '#41b883'
    },
    size: {
      default: '90px'
    }
  },
  computed: {
    innerStyles () {
      const size = this.calcWidth(this.outerWidth) + 'px'
      return {
        border: '2px solid ' + this.color,
        height: size,
        width: size
      }
    },
    outerStyles () {
      const size = this.outerWidth + 'px'
      return {
        border: '2px solid ' + this.color,
        height: size,
        width: size
      }
    },
    outerWidth () {
      const size = parseInt(this.size, 10)
      return this.calcWidth(size)
    },
    styles () {
      return {
        height: this.size,
        width: this.size
      }
    }
  },
  methods: {
    calcWidth (outerWidth) {
      const r = 45 * Math.PI / 180
      const s = Math.abs(Math.cos(r))
      const c = Math.abs(Math.sin(r))
      return (outerWidth * c - outerWidth * s) / (Math.pow(c, 2) - Math.pow(s, 2))
    }
  }
}
</script>
<style lang="scss" scoped>
  .spinner{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .inner-square {
      content: "";
      position: absolute;
      width: 30px;
      height: 30px;
    }
    .inner-square-1 {
      animation: spinner--rotate-square-6 2.5s linear infinite;
    }
    .inner-square-2 {
      width: 44px;
      height: 44px;
      animation: spinner--rotate-square-6 2.5s linear infinite;
      animation-direction: reverse;
    }
  }
  @keyframes spinner--rotate-square-6 {
    from {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
</style>
