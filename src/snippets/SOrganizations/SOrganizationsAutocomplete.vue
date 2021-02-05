<template>
  <v-autocomplete
    ref="ref"
    v-model="selected"
    :items="options"
    :search-input.sync="q"
    :cache-items="false"
    :loading="process"
    item-value="id"
    :messages="hintMessage"
    :label="label"
    :no-data-text="$tc('No data available')"
    :disabled="disabled"
    :rules="rules"
    :outlined="outlined"
    :dense="dense"
    :clearable="clearable"
    single-line
    disable-lookup
    return-object
    no-filter
    persistent-hint
  >
    <template
      slot="item"
      slot-scope="{ item, on, attrs }"
    >
      <v-list-item class="v-divider" link v-on="on" :attrs="attrs">
        <v-list-item-content>
          <v-list-item-title>
            {{ item.name }}
          </v-list-item-title>
        </v-list-item-content>
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
      slot-scope="{ item }"
    >
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </template>

    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      v-slot:prepend
    >
      <v-icon class="pl-5 pr-9">mdi-city-variant</v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import Organizations, { OrganizationInterface } from '@/api/Organizations'

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: () => ''
    },
    clearable: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    outlined: {
      type: Boolean,
      default: () => false
    },
    dense: {
      type: Boolean,
      default: () => false
    },
    params: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visibleIcon: {
      type: Boolean,
      default: false
    },
    visibleFound: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => null
    }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  data () {
    return {
      q: null,
      hintMessage: '',
      lockSearch: false,
      selected: null,
      process: false,
      options: [] as OrganizationInterface[]
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
    }
  },

  methods: {
    fetchData (params = {}) {
      return search(this, Object.assign({}, this.params, params))
    },

    setSelected (data: OrganizationInterface) {
      this.selected = data
    },

    setData (data: OrganizationInterface[]) {
      this.options = data
    },

    pushData (data: OrganizationInterface) {
      if (this.options.findIndex((e: OrganizationInterface) => e.id === data.id) === -1) {
        this.options.push(data)
      }
    },

    /**
     * Загрузить с сервера для установки текущего значения
     * @param id
     */
    setDefault (id: number) {
      new Organizations()
        .getById(id)
        .then((response: OrganizationInterface) => {
          this.pushData(response)
          this.selected = response
        })
    },

    focus () {
      this.$refs.ref.focus()
    }
  }
})

/**
 * Поиск пользователей
 */
const search = debounce((ctx: any, params: any) => {
  return new Promise<void>(resolve => {
    ctx.process = true
    new Organizations()
      .find(params)
      .then((response: ResponseInterface<{ count: number }, OrganizationInterface[]>) => {
        if (ctx.visibleFound) { ctx.hintMessage = ctx.$t('found', { count: response.meta.count }) }
        ctx.options = response.data
      })
      .finally(() => {
        resolve()
        ctx.process = false
      })
  })
}, 400)
</script>
