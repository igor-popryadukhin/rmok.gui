<template>
  <v-text-field
    v-model="text"
    :label="label"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable"
    :disabled="disabled"
    prepend-inner-icon="mdi-magnify"
  >
    <template
      v-for="(_, slot) of $scopedSlots"
      #[slot]="scope"
    >
      <slot
        :name="slot"
        v-bind="scope"
      />
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

interface Props {
  label: string;
  dense: boolean;
  outlined: boolean;
  clearable: boolean;
  debounceDelay: number;
  value: string;
}

interface Data {
  text: string;
}

interface Computed {
  [key: string]: unknown;
}

interface Method {
  [key: string]: unknown;
}

export default Vue.extend<Data, Method, Computed, Props>({
  name: 'AppSearchInput',

  inheritAttrs: false,

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    clearable: {
      default: true,
      type: Boolean
    },
    debounceDelay: {
      default: 450,
      type: Number
    },
    dense: {
      default: true,
      type: Boolean
    },
    label: {
      default: 'Search',
      type: String
    },
    outlined: {
      default: true,
      type: Boolean
    },
    disabled: {
      default: false,
      type: Boolean
    },
    value: {
      default: '',
      type: String
    }
  },

  data (): Data {
    return {
      text: ''
    }
  },

  watch: {
    value (val: string) {
      this.text = val
    }
  },

  created () {
    this.text = this.value

    this.$watch('text', debounce((val?: string) => {
      this.$emit('change', val)
    }, this.debounceDelay))
  }
})
</script>

<style scoped>

</style>
