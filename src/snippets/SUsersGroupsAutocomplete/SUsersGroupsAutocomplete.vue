<template>
  <v-autocomplete
    ref="ref"
    v-model="selected"
    :items="options"
    :search-input.sync="q"
    :loading="loading"
    :label="label"
    :no-data-text="$tc('No data available')"
    :disabled="disabled"
    :rules="rules"
    :dense="dense"
    :multiple="multiple"
    :outlined="outlined"
    item-text="name"
    item-value="id"
    cache-items
    single-line
    disable-lookup
    no-filter
    persistent-hint
    clearable
    @focus="onFocus"
  >
    <template
      slot="item"
      slot-scope="{ item, on, attrs }"
    >
      <v-list-item
        class="v-divider"
        :attrs="attrs"
        link
        v-on="on"
        @click="onselect"
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template #append-item>
      <v-divider class="mb-2" />
      <v-list-item
        disabled
        dense
      >
        <v-list-item-content>
          <v-list-item-title>
            {{ $tc('Start typing to initialize your search.') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>

    <template
      slot="selection"
      slot-scope="{ item, attrs, select }"
    >
      <template v-if="multiple">
        <v-chip
          v-bind="attrs"
          :input-value="select"
          class="ma-1"
          color="primary"
          label
          close
          small
          @click="select"
        >
          {{ item.name }}
        </v-chip>
      </template>
      <template v-else>
        <v-list-item-title>
          {{ item.name }}
        </v-list-item-title>
      </template>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import Groups from '@/api/Groups'

export default Vue.extend({
  name: 'SUsersGroupsAutocomplete',

  model: {
    event: 'change',
    prop: 'value'
  },

  props: {
    clearable: {
      default: () => false,
      type: Boolean
    },
    dense: {
      default: () => false,
      type: Boolean
    },
    multiple: {
      default: () => false,
      type: Boolean
    },
    disabled: {
      default: () => false,
      type: Boolean
    },
    label: {
      default: () => '',
      type: String
    },
    outlined: {
      default: () => false,
      type: Boolean
    },
    params: {
      default: () => {
        return {}
      },
      type: Object
    },
    rules: {
      default: () => [],
      type: Array
    },
    value: {
      default: () => 0,
      type: Number
    }
  },

  data () {
    return {
      dParams: {},
      lockSearch: false,
      options: [],
      loading: false,
      q: null,
      selected: 0,
      fetchData: debounce((params: any) => {
        this.loading = true
        return new Groups()
          .find(params)
          .then((response) => {
            this.options = response.data
          }).finally(() => (this.loading = false))
      }, 400)
    }
  },

  watch: {
    q (q: string) {
      this.fetchData(Object.assign({}, this.params, { q }))
    },

    selected (value) {
      this.$emit('change', value)
    },

    value (val: any) {
      this.selected = val
      this.fetchD()
    }
  },

  mounted () {
    this.selected = this.value
    this.fetchD()
  },

  methods: {
    fetchD () {
      if (this.multiple) {
        this.fetchData({
          group_ids: this.value.join(',')
        })
      } else {
        if (this.value > 0) {
          this.fetchData({
            group_ids: this.value
          })
        }
      }
    },

    focus () {
      this.$refs.ref.focus()
    },

    onFocus () {
      if (this.options.length === 0) {
        this.fetchData()
      }
    },

    onselect () {
      setTimeout(() => {
        this.$emit('selected', this.selected)
      }, 0)
    }
  }
})

</script>
