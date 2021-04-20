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
  data (): IData {
    return {
      text: '',
      textChanged: debounce((s: string) => {
        this.$emit('change', s)
      }, this.debounceDelay)
    }
  },

  inheritAttrs: false,

  model: {
    event: 'change',
    prop: 'value'
  },

  name: 'AppSearchInput',

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
    value: {
      default: '',
      type: String
    }
  },

  watch: {
    text (val: string) {
      this.textChanged(val)
    },

    value (val: string) {
      this.text = val
    }
  }
})
</script>

<style scoped>

</style>
