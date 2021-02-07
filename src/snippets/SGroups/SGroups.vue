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
    :dense="dense"
    :clearable="clearable"
    :outlined="outlined"
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
      <v-icon class="pl-5 pr-9">mdi-account-group</v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { debounce } from 'vuetify/src/util/helpers'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import Groups, { GroupInterface } from '@/api/Groups'

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: () => ''
    },
    dense: {
      type: Boolean,
      default: () => false
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
      selected: {} as unknown as GroupInterface,
      process: false,
      options: [] as GroupInterface[]
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
      search(this, Object.assign({}, this.params, params))
    },

    setSelected (data: GroupInterface) {
      this.selected = data
    },

    setData (data: GroupInterface[]) {
      this.options = data
    },

    pushData (data: GroupInterface) {
      if (this.options.findIndex<GroupInterface>((e) => e.id === data.id) === -1) {
        this.options.push(data)
      }
    },

    /**
     * Загрузить с сервера для установки текущего значения
     * @param id
     */
    setDefault (id: number) {
      return new Promise<void>((resolve, reject) => {
        new Groups()
          .getById(id)
          .then((response: GroupInterface) => {
            this.selected = response
            if (this.options.findIndex(value => value.id === id) === -1) {
              this.options.push(response)
            }

            resolve()
          }).catch(reject)
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
  ctx.process = true
  new Groups()
    .find(params)
    .then((response: ResponseInterface<{ count: number }, GroupInterface[]>) => {
      ctx.hintMessage = ctx.$t('found', { count: response.meta.count })
      ctx.options = response.data
    })
    .finally(() => (ctx.process = false))
}, 400)
</script>
