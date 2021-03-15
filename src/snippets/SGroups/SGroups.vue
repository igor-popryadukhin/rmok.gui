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
    :multiple="multiple"
    :outlined="outlined"
    single-line
    disable-lookup
    return-object
    no-filter
    persistent-hint
    @focus="onFocus"
  >
    <template
      slot="item"
      slot-scope="{ item, on, attrs }"
    >
      <v-list-item
        class="v-divider"
        v-on="on"
        :attrs="attrs"
        link
        @click="onselect"
      >
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
      v-if="visibleIcon && innerIcon"
      v-slot:prepend-inner
    >
      <v-icon>{{ iconName }}</v-icon>
    </template>
    <template
      v-else-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      v-slot:prepend
    >
      <v-icon class="pl-5 pr-9">{{ iconName }}</v-icon>
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
    multiple: {
      type: Boolean,
      default: () => false
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
    iconName: {
      type: String,
      default: 'mdi-account-group'
    },
    visibleIcon: {
      type: Boolean,
      default: false
    },
    innerIcon: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Object, Array],
      default: () => null
    }
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  data () {
    return {
      dParams: {},
      q: null,
      hintMessage: '',
      lockSearch: false,
      selected: null as unknown & GroupInterface | GroupInterface[] | null, // Одна группа или массив групп, зависит т параметра multiple
      process: false,
      options: [] as unknown & GroupInterface[]
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
    setParams (params: any) {
      this.dParams = Object.assign({}, params)
    },

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
      if (this.options.findIndex((e) => e.id === data.id) === -1) {
        this.options.push(data)
      }
    },

    /**
     * Загрузить с сервера для установки текущего значения
     *
     * @param ids
     */
    setDefault (ids: number | number[]) {
      return new Promise<void>((resolve, reject) => {
        if (Array.isArray(ids)) {
          new Groups()
            .getByIds(ids)
            .then((response) => {
              this.$data.selected = response.data
              this.$data.options = response.data
              resolve()
            }).catch(reject)
        } else {
          new Groups()
            .getById(ids)
            .then((response: GroupInterface) => {
              this.selected = response
              if (this.options.findIndex(value => value.id === ids) === -1) {
                this.options.push(response)
              }

              resolve()
            }).catch(reject)
        }
      })
    },

    /**
     * Очистить выбранный элемент
     */
    clear () {
      this.selected = null
    },

    focus () {
      this.$refs.ref.focus()
    },

    onselect () {
      setTimeout(() => {
        this.$emit('selected', this.selected)
      }, 0)
    },

    onFocus () {
      if (this.options.length === 0) {
        this.fetchData()
      }
    },

    chipRemove (item: GroupInterface | null) {
      if (Array.isArray(this.selected) && item) {
        const index = this.selected.findIndex((e: GroupInterface) => e.id === item.id)
        if (index >= 0) this.selected.splice(index, 1)
      } else {
        this.selected = null
      }
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
