<template>
  <span v-text="numberFormatted" />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppNumberFormat',
  props: {
    locale: {
      type: String,
      required: false,
      default: 'ru-RU'
    },
    value: {
      type: Number,
      required: true
    }
  },

  computed: {
    numberFormatted () {
      return new Intl.NumberFormat(this.locale).format(this.value);
    }
  }
});
</script>

<style scoped>

</style>
