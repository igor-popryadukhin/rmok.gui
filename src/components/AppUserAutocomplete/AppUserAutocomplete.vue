<template>
  <v-autocomplete
    v-model="selected"
    :items="options"
    :multiple="multiple"
    :search-input.sync="q"
    :label="label"
    :rules="rules"
    :disabled="disabled"
    item-value="id"
    item-text="full_name"
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
        v-on="on"
      >
        {{ item.full_name }}
      </v-list-item>
    </template>
    <template
      v-else
      #item="{ item, on, attrs }"
    >
      <v-list-item
        v-bind="attrs"
        v-on="on"
        @click="selectedName = item.full_name"
      >
        {{ item.full_name }}
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
        {{ item.full_name }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { debounce } from 'vuetify/src/util/helpers'
import User from '@/api/interfaces/User'

export default Vue.extend({
  name: 'AppUserAutocomplete',

  mixins: [],

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
    value: {
      type: [Number, Object, Array],
      default: () => null
    }
  },

  data () {
    return {
      selectedName: null,
      q: null,
      selected: null as unknown as number | number[]
    }
  },

  computed: {
    ...mapGetters({
      options: 'filter/users'
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
    q (val: string) {
      val && this.options.findIndex((e: User) => (e.full_name || '').indexOf(val) > -1) === -1 && this.fetchOptions()
    }
  },

  created () {
    this.fetchOptions = debounce(this.fetchOptions, 350)
  },

  mounted () {
    this.selected = this.value

    if (this.options.length === 0) {
      this.fetchOptions()
    }
  },

  methods: {
    fetchOptions () {
      this.$store.dispatch('filter/users', this.paramsQuery)
    }
  }
})
</script>

<style scoped>

</style>
