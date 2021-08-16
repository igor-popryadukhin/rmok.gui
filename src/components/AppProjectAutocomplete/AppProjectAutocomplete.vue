<template>
  <v-autocomplete
    v-model="selected"
    :items="options"
    :multiple="multiple"
    :search-input.sync="q"
    :label="label"
    :rules="rules"
    :error-messages="errorMessages"
    item-value="id"
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
import { mapGetters } from 'vuex'

export default Vue.extend({
  name: 'AppProjectAutocomplete',

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
    rules: {
      type: [Array],
      default: () => []
    },
    errorMessages: {
      type: [Array],
      default: () => []
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
    ...mapGetters({
      options: 'filter/projects'
    }),

    paramsQuery () {
      const paramsQuery: Record<string, unknown | string> = {}

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

    if (this.options.length === 0) {
      this.fetchOptions()
    }
  },

  methods: {
    fetchOptions () {
      this.$store.dispatch('filter/projects', this.paramsQuery)
    }
  }
})
</script>

<style scoped>

</style>
