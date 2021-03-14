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
    :error-messages="errorMessages"
    :label="label"
    :no-data-text="$tc('No data available')"
    :disabled="disabled"
    :readonly="readonly"
    :rules="rules"
    :outlined="outlined"
    :dense="dense"
    :clearable="clearable"
    :multiple="multiple"
    single-line
    disable-lookup
    return-object
    no-filter
    persistent-hint
    @focus="onFocus"
  >
    <template
      slot="item"
      slot-scope="scope"
    >
      <v-list-item-content>
        <v-list-item-title>
          {{ scope.item.first_name || '' }} {{ scope.item.last_name || '' }}
        </v-list-item-title>
        <v-list-item-subtitle v-if="scope.item.role">
          {{ scope.item.role.name }}
        </v-list-item-subtitle>
        <v-list-item-subtitle v-if="showOrganization && scope.item.organization">
          {{ scope.item.organization.name }}
        </v-list-item-subtitle>
      </v-list-item-content>
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
          <v-avatar v-if="item.userpic" left>
            <v-img :lazy-src="item.userpic"></v-img>
          </v-avatar>
          {{ item.first_name }} {{ item.last_name }}
        </v-chip>
      </template>
      <template v-else>
        <v-list-item-title>
          {{ item.first_name }} {{ item.last_name }}
        </v-list-item-title>
      </template>
    </template>

    <template
      v-if="visibleIcon && ['lg', 'md'].includes($vuetify.breakpoint.name)"
      v-slot:prepend
    >
      <v-icon class="pl-5 pr-9">mdi-account</v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import Users, { UserInterface } from '@/api/Users'
import { debounce } from 'vuetify/src/util/helpers'

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
    clearable: {
      type: Boolean,
      default: () => false
    },
    disabled: {
      type: Boolean,
      default: () => false
    },
    readonly: {
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
    rules: {
      type: Array,
      default: () => []
    },
    value: {
      type: [Object, Array] as PropType<UserInterface | UserInterface[]>,
      default: () => null
    },
    autoload: {
      type: Boolean,
      default: false
    },
    showOrganization: {
      type: Boolean,
      default: false
    },
    errorMessages: {
      type: Array as PropType<string[]>,
      default: () => []
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
      selected: null as unknown & UserInterface | null,
      process: false,
      options: [] as unknown & UserInterface[]
    }
  },

  watch: {
    q (q: string) {
      this.fetchData({ q })
    },

    selected (value) {
      this.$emit('change', value)
    },

    value (val: any) {
      this.selected = val
    }
  },

  created () {
    if (this.autoload) {
      this.fetchData()
    }
  },

  methods: {
    chipRemove (item: UserInterface | null) {
      if (Array.isArray(this.selected) && item) {
        const index = this.selected.findIndex((e: UserInterface) => e.id === item.id)
        if (index >= 0) this.selected.splice(index, 1)
      } else {
        this.selected = null
      }
    },

    setParams (params: any) {
      this.dParams = Object.assign({}, params)
    },

    fetchData (params = {}) {
      this.dParams = Object.assign({}, this.params, params)
      search(this, this.dParams)
    },

    setSelected (data: UserInterface | null) {
      this.selected = data
    },

    setData (data: UserInterface[]) {
      this.options = data
    },

    pushData (data: UserInterface) {
      if (this.options.findIndex((e) => e.id === data.id) === -1) {
        this.options.push(data)
      }
    },

    /**
     * Загрузить с сервера для установки текущего значения
     * @param param
     */
    setDefault (param: number | number[]) {
      return new Promise<void>((resolve, reject) => {
        if (Array.isArray(param)) {
          /*
            Массив идентификаторов
            Здесь загружаем массив пользователей
           */
          new Users()
            .getByIds(param)
            .then((response) => {
              this.$data.selected = response.data
              this.$data.options = response.data
              resolve()
            }).catch(reject)
        } else {
          // Только одного
          new Users()
            .getById(param)
            .then((response: UserInterface) => {
              this.selected = response
              if (this.options.findIndex(value => value.id === param) === -1) {
                this.options.push(response)
              }
              resolve()
            }).catch(reject)
        }
      })
    },

    onFocus () {
      if (this.options.length === 0) {
        this.fetchData()
      }
    },

    focus () {
      (this as any).$refs.ref.focus()
    }
  }
})

/**
 * Поиск пользователей
 */
const search = debounce((ctx: any, params: any) => {
  ctx.process = true
  new Users()
    .find<{ count: number }, UserInterface[]>(params)
    .then((response) => {
      ctx.hintMessage = ctx.$t('found', { count: response.meta.count })
      ctx.options = response.data
    }).finally(() => (ctx.process = false))
}, 400)
</script>
