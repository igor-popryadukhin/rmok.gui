<template>
  <span />
</template>

<script lang="ts">
import Vue from 'vue'
import { CountUp } from 'countup.js'
// See: https://github.com/inorganik/CountUp.js
export default Vue.extend({
  name: 'AppCountUp',
  props: {
    delay: {
      type: Number,
      required: false,
      default: 0
    },
    endVal: {
      type: Number,
      required: true
    },
    options: {
      type: Object,
      required: false,
      default: () => {
        return {
          useEasing: true,
          useGrouping: true,
          separator: ' ',
          decimal: '.',
          prefix: '',
          suffix: '',
          duration: 1
        }
      }
    }
  },
  data () {
    return {
      instance: null as null | CountUp
    }
  },
  // computed: {},
  watch: {
    endVal: {
      handler (value) {
        if (this.instance && typeof this.instance.update === 'function') {
          this.instance.update(value)
        }
      },
      deep: false
    }
  },

  mounted () {
    this.create()
  },

  beforeDestroy () {
    this.destroy()
  },

  methods: {
    create () {
      if (this.instance) {
        return
      }
      const instance = new CountUp(
        this.$el as HTMLElement,
        this.endVal,
        this.options
      )
      if (instance.error) {
        // error
        return
      }

      this.instance = instance
      if (this.delay < 0) {
        this.$emit('ready', instance, CountUp)
        return
      }
      setTimeout(() => instance.start(() => this.$emit('ready', instance, CountUp)), this.delay)
    },

    destroy () {
      this.instance = null
    },

    start (callback?: (args?: any) => any) {
      if (this.instance && typeof this.instance.start === 'function') {
        return this.instance.start(callback)
      }
    },

    pauseResume () {
      if (this.instance && typeof this.instance.pauseResume === 'function') {
        return this.instance.pauseResume()
      }
    },

    reset () {
      if (this.instance && typeof this.instance.reset === 'function') {
        return this.instance.reset()
      }
    },

    update (newEndVal: string | number) {
      if (this.instance && typeof this.instance.update === 'function') {
        return this.instance.update(newEndVal)
      }
    }
  }
})
</script>

<style scoped>

</style>
