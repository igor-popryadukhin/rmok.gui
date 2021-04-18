<template>
  <div>
    <slot name="display"></slot>
    <v-btn
      :disabled="dPage <= 1 || disabled"
      icon
      small
      @click="dPage--"
    >
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <v-btn
      :disabled="dPage >= length || disabled"
      icon
      small
      @click="dPage++"
    >
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'AppPagination',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {

    length: {
      type: Number,
      required: true
    },

    disabled: {
      type: Boolean,
      default: false
    },

    value: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data () {
    return {
      dPage: this.value
    }
  },

  watch: {
    dPage (val) {
      this.$emit('change', val)
    }
  }
}
</script>

<style scoped>

</style>
