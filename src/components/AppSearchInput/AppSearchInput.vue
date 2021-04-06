<template>
  <v-text-field
    v-model="text"
    :label="label"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable"
    prepend-inner-icon="mdi-magnify"
  >
    <template v-for="(_, slot) of $scopedSlots" #[slot]="scope">
      <slot :name="slot" v-bind="scope"/>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

interface IProps {
  label: string;
  dense: boolean;
  outlined: boolean;
  clearable: boolean;
  debounceDelay: number;
  value: string;
}

interface IData {
  text: string;
  textChanged: (s: string) => void;
}

interface IComputed {
  [key: string]: unknown;
}

interface IMethod {
  [key: string]: unknown;
}

export default Vue.extend<IData, IMethod, IComputed, IProps>({
  name: 'AppSearchInput',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    label: {
      type: String,
      default: 'Search'
    },
    dense: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    debounceDelay: {
      type: Number,
      default: 450
    },
    value: {
      type: String,
      default: ''
    }
  },

  inheritAttrs: false,

  data (): IData {
    return {
      text: '',
      textChanged: debounce((s: string) => {
        this.$emit('change', s)
      }, this.debounceDelay)
    }
  },

  watch: {
    value (val: string) {
      this.text = val
    },

    text (val: string) {
      this.textChanged(val)
    }
  }
})
</script>

<style scoped>

</style>
