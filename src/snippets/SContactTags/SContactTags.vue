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
    :label="label"
    ref="ref"
    item-text="name"
    item-value="id"
    item-color="color"
    full-width
    disable-lookup
    no-filter
    persistent-hint
    @update:search-input="onTagsSearchInput"
    @focus="onTagsSearchInput('')"
  >
    <template
      slot="item"
      slot-scope="{ item, on, attrs }"
    >
      <v-list-item
        v-on="on"
        v-bind="attrs"
        :disabled="item.id > 0 && itemDisabled === 0 || item.id === 0 && itemDisabled === -1"
      >
        {{ item.name }}
      </v-list-item>
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
    },

    notags: {
      default: () => false,
      type: Boolean
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

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
      process: false,
      q: null,
      selected: null as unknown & number | number[]
    }
  },

  watch: {
    selected (value) {
      this.$emit('change', value)
    },

    value (value: number | number[]) {
      this.selected = value
    }
  },

  computed: {
    /**
     * Список тегов контактов
     */
    options: {
      get () {
        let tags = this.$store.getters['filter/contact_tags']
        // Внедряем тег "Без тегов" если передана опция notags
        if (this.notags) {
          tags = [{ id: 0, name: this.$tc('Without tags') }, ...tags]
        }
        return tags
      },

      set (val?: ContactTagInterface) {
        this.$store.commit('filter/contact_tags', val)
      }
    },
    /**
     * Toggle тегов между переключениями c тегом "без тегов"
     */
    itemDisabled: function () {
      if (Array.isArray(this.selected)) {
        const index = this.selected.findIndex((value: number) => value === 0)
        if (index === 0) {
          return 0
        } else {
          const index = this.selected.findIndex((value: number) => value !== 0)
          if (index === 0) {
            return -1
          } else {
            return 1
          }
        }
      }
      return false
    }
  },

  methods: {
    chipRemove (item: ContactTagInterface | null) {
      if (Array.isArray(this.selected) && item) {
        const index = this.selected.findIndex((value: number) => value === item.id)
        if (index >= 0) this.selected.splice(index, 1)
      } else {
        this.selected = null
      }
    }
  }
})
</script>
