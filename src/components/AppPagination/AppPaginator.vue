<template>
  <div class="d-flex">
    <slot
      name="display"
      :page="dPage"
      :length="length"
    >
      <div class="mr-2" style="padding: 4px; font-size: 13px">
        {{ dPage }} - {{ length }}
      </div>
    </slot>
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

  data () {
    return {
      dPage: this.value
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
