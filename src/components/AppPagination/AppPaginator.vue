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
  data () {
    return {
      dPage: this.value
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  name: 'AppPagination',

  props: {

    disabled: {
      default: false,
      type: Boolean
    },

    length: {
      required: true,
      type: Number
    },

    value: {
      default: 0,
      required: false,
      type: Number
    }
  },

  watch: {
    dPage (val) {
      this.$emit('change', val)
    },

    value (val) {
      this.dPage = this.value
    }
  }
}
</script>

<style scoped>

</style>
