<template>
  <v-autocomplete
    v-model="selected"
    :items="utcOffsetOptions"
    :multiple="multiple"
    :search-input.sync="q"
    :label="label"
    :rules="rules"
    :error-messages="errorMessages"
    :disabled="disabled"
    item-value="value"
    item-text="name"
    dense
    outlined
    clearable
    @input="(val) => $emit('change', val)"
  >
    <template
      v-if="multiple"
      #item="{ item, on, attrs }"
    >
      <v-list-item
        v-bind="attrs"
        :input-value="item.value"
        v-on="on"
      >
        {{ item.name }}
      </v-list-item>
    </template>

    <template
      v-if="multiple"
      #selection="{ item }"
    >
      <v-chip
        outlined
        label
        x-small
      >
        {{ item.name }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppTimeZoneAutocomplete',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    rules: {
      type: [Array],
      default: () => []
    },
    errorMessages: {
      type: [Array],
      default: () => []
    },
    value: {
      type: [Number, Object, Array, String],
      default: null
    }
  },

  data () {
    return {
      q: null,
      qOld: null,
      selected: 0 as number | number[],
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
        },
        {
          name: '+0 UTC',
          value: 0
        }
      ]
    }
  },

  computed: {
    paramsQuery () {
      const paramsQuery: Record<number, unknown | number> = {}

      if (this.q) {
        paramsQuery.q = this.q
      }

      return paramsQuery
    }
  },

  watch: {
    value (val: number | number[]) {
      this.selected = val
    }
  },

  mounted () {
    this.selected = this.value
  }
})
</script>

<style scoped>

</style>
