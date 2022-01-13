<template>
  <v-autocomplete
    v-model="selected"
    :items="options"
    :multiple="multiple"
    :search-input.sync="q"
    :label="label"
    :disabled="disabled"
    item-value="id"
    item-text="name"
    item-color="color"
    cache-items
    dense
    outlined
    clearable
    hide-selected
    @input="(val) => $emit('change', val)"
  >
    <template
      v-if="multiple"
      #item="{ item, on, attrs }"
    >
      <v-list-item
        v-bind="attrs"
        :color="item.color"
        :input-value="item.id"
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
        :color="item.color"
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
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  name: 'AppContactTagAutocomplete',

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
    // Включает элемент с нулевым значением и помещает его в начало списка.
    noResultItem: {
      type: Boolean,
      default: false
    },
    noResultItemTitle: {
      type: String,
      default: () => 'No tags'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, Object, Array],
      default: null
    }
  },

  data () {
    return {
      q: null,
      qOld: null,
      selected: 0 as number | number[]
    }
  },

  computed: {
    options () {
      const statuses: unknown[] = this.$store.getters['filter/contact_tags'].map((e: unknown) => e)

      if (this.noResultItem) {
        statuses.unshift({
          id: 0,
          name: this.noResultItemTitle,
          color: 'grey'
        })
      }

      return statuses
    },

    paramsQuery () {
      const paramsQuery: Record<string, unknown | string> = {}

      if (this.q) {
        paramsQuery.q = this.q
      }

      return paramsQuery
    }
  },

  watch: {
    q (val: string) {
      // @ts-expect-error: val && this.options.findIndex((e) => e.name?.toLowerCase().indexOf(val.toLowerCase()) > -1) === -1 && this.fetchOptions()
      val && this.options.findIndex((e) => e.name?.toLowerCase().indexOf(val.toLowerCase()) > -1) === -1 && this.fetchOptions()
    }
  },

  created () {
    this.fetchOptions = debounce(this.fetchOptions, 450)
  },

  mounted () {
    this.selected = this.value

    if (this.options.length === 0 || (this.options.length === 1 && this.noResultItem)) {
      this.fetchOptions()
    }
  },

  methods: {
    fetchOptions () {
      this.$store.dispatch('filter/contact_tags', this.paramsQuery)
    }
  }
})
</script>

<style scoped>

</style>
