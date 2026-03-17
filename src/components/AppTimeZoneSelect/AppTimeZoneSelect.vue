<template>
  <v-select
    v-model="selected"
    :items="utcOffsetOptions"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    item-value="value"
    item-text="name"
    dense
    outlined
    clearable
    @input="(val) => $emit('change', val)"
  />
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'AppTimeZoneSelect',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Array],
      default: () => []
    },
    value: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      q: null,
      qOld: null,
      selected: null as unknown | number | null,
      utcOffsetOptions: [
        {
          name: '+2 Калининград',
          value: 2
        },
        {
          name: '+3 Москва',
          value: 3
        },
        {
          name: '+4 Самара',
          value: 4
        },
        {
          name: '+5 Екатеринбург',
          value: 5
        },
        {
          name: '+6 Омск',
          value: 6
        },
        {
          name: '+7 Красноярск',
          value: 7
        },
        {
          name: '+8 Иркутск',
          value: 8
        },
        {
          name: '+9 Якутск',
          value: 9
        },
        {
          name: '+10 Владивосток',
          value: 10
        },
        {
          name: '+11 Магадан',
          value: 11
        },
        {
          name: '+12 Камчатка',
          value: 12
        }
      ]
    };
  },

  watch: {
    value (val?: number) {
      this.selected = val || null;
    }
  },

  mounted () {
    this.selected = this.value || null;
  }
});
</script>

<style scoped>

</style>
