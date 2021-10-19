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
    :error-messages="errorMessages"
    single-line
    disable-lookup
    return-object
    no-filter
    persistent-hint
    @focus="onFocus"
    @select="onSelect"
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
        @click="$emit('select', item)"
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
      slot-scope="{ item }"
    >
      <v-list-item-title>{{ item.name }}</v-list-item-title>
    </template>
    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      #prepend
    >
      <v-icon class="pl-5 pr-9">
        mdi-projector-screen
      </v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import Projects, { ProjectInterface } from '@/api/Projects'

export default Vue.extend({
  name: 'SProjectsAutocomplete',

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
    disabled: {
      default: () => false,
      type: Boolean
    },
    errorMessages: {
      default: () => [],
      type: Array
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
      default: () => null,
      type: Object
    },
    visibleIcon: {
      default: false,
      type: Boolean
    }
  },

  data () {
    return {
      dParams: {},
      hintMessage: '',
      lockSearch: false,
      options: [] as ProjectInterface[],
      process: false,
      q: null,
      selected: {} as unknown as ProjectInterface
    }
  },

  watch: {
    q (q: string) {
      this.fetchData(Object.assign({}, this.dParams, { q }))
    },

    selected (value) {
      this.$emit('change', value)
    },

    value (val: any) {
      if (val === null) {
        this.$emit('clear')
      }
      this.selected = val
    }
  },

  created () {
    this.dParams = Object.assign({}, this.params)
  },

  methods: {
    fetchData (params = {}) {
      this.dParams = Object.assign(this.params, params)
      search(this, this.dParams)
    },

    focus () {
      this.$refs.ref.focus()
    },

    onFocus () {
      if (this.options.length === 0) {
        this.fetchData()
      }
    },

    onSelect (data: any) {
      this.$emit('select', data)
    },

    pushData (data: ProjectInterface) {
      if (this.options.findIndex((e: ProjectInterface) => e.id === data.id) === -1) {
        this.options.push(data)
      }
    },

    setData (data: ProjectInterface[]) {
      this.options = data
    },

    /**
     * Загрузить с сервера для установки текущего значения
     * @param id
     */
    setDefault (id: number) {
      return new Promise<void>((resolve, reject) => {
        new Projects()
          .getById(id)
          .then((response: ProjectInterface) => {
            this.pushData(response)
            this.selected = response

            resolve()
          }).catch(reject)
      })
    },

    setParams (params: any) {
      this.dParams = Object.assign({}, params)
    },

    setSelected (data: ProjectInterface) {
      this.selected = data
    }
  }
})

// Поиск проектов
const search = debounce((ctx: any, params: any) => {
  ctx.process = true
  new Projects()
    .find<{ count: number }, ProjectInterface[]>(params)
    .then((response) => {
      ctx.hintMessage = ctx.$t('found', { count: response.meta.count })
      ctx.options = response.data
    }).finally(() => (ctx.process = false))
}, 400)
</script>
