<template>
  <v-autocomplete
    v-model="selected"
    v-bind="$props"
    :items="options"
    :search-input.sync="q"
    :cache-items="false"
    :loading="process"
    :error-messages="errorMessages"
    :no-data-text="$tc('No data available')"
    full-width
    ref="ref"
    item-value="id"
    item-color="color"
    disable-lookup
    return-object
    no-filter
    persistent-hint
    @update:search-input="onTagsSearchInput"
    @focus="onTagsSearchInput('')"
  >
    <template
      slot="item"
      slot-scope="{ item }"
    >
      {{ item.name }}
    </template>

    <template v-slot:append-item>
      <v-divider class="mb-2"></v-divider>
      <v-list-item disabled dense>
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
          :color="item.color"
          label
          close
          small
          outlined
          @click="select"
          @click:close="chipRemove(item)"
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

    <template
      v-slot:prepend-inner
    >
      <v-icon>mdi-tag</v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { Contacts } from '@/api/Contacts'
import { ContactTagInterface } from '@/api/Schemas/ContactInterface'
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  name: 'SContactTags',

  data () {
    return {
      // Поиск тегов
      onTagsSearchInput: debounce((q: string) => {
        new Contacts()
          .getTags({ q })
          .then((response) => {
            this.options = response.data
          })
      }, 250),
      // Коллекция доступных тегов
      options: [] as unknown & ContactTagInterface[],
      process: false,
      q: null,
      selected: null as unknown & ContactTagInterface | ContactTagInterface[]
    }
  },

  methods: {
    chipRemove (item: ContactTagInterface | null) {
      if (Array.isArray(this.selected) && item) {
        const index = this.selected.findIndex((e: ContactTagInterface) => e.id === item.id)
        if (index >= 0) this.selected.splice(index, 1)
      } else {
        this.selected = null
      }
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  mounted () {
    if (Array.isArray(this.value)) {
      this.selected = this.value
      this.options = this.value
    }
  },

  props: {
    autoload: {
      default: false,
      type: Boolean
    },

    clearable: {
      default: () => false,
      type: Boolean
    },

    dense: {
      default: () => false,
      type: Boolean
    },

    disabled: {
      default: () => false,
      type: Boolean
    },

    errorMessages: {
      default: () => [],
      type: Array as PropType<string[]>
    },

    label: {
      default: () => '',
      type: String
    },

    multiple: {
      default: () => false,
      type: Boolean
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

    readonly: {
      default: () => false,
      type: Boolean
    },

    rules: {
      default: () => [],
      type: Array
    },

    value: {
      default: () => null,
      type: [Object, Array] as PropType<ContactTagInterface | ContactTagInterface[]>
    },

    visibleIcon: {
      default: false,
      type: Boolean
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    value (value: ContactTagInterface | ContactTagInterface[]) {
      this.selected = value

      if (this.options.length === 0 && Array.isArray(value)) {
        this.options = value
      }
    }
  }
})
</script>
