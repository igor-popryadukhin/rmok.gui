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
    :hide-details="hideDetails"
    hide-selected
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
          @click:close="chipRemove(item)"
        >
          <v-avatar
            v-if="item.userpic"
            left
          >
            <v-img :lazy-src="item.userpic" />
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
      #prepend
    >
      <v-icon class="pl-5 pr-9">
        mdi-account
      </v-icon>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Users, { UserInterface } from '@/api/Users'
import { compareObjects } from '@/utils/utils'
import Vue, { PropType } from 'vue'
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  name: 'SUsers',

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
    hideDetails: {
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
    showOrganization: {
      default: false,
      type: Boolean
    },
    value: {
      default: () => null,
      type: [Object, Array] as PropType<UserInterface | UserInterface[]>
    },
    visibleIcon: {
      default: false,
      type: Boolean
    }
  },

  data () {
    return {
      oldParams: {},
      dParams: {},
      hintMessage: '',
      lockSearch: false,
      options: [] as unknown & UserInterface[],
      process: false,
      q: null,
      selected: null as unknown & UserInterface | null
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
      if (val === null) {
        (this as any).$refs.ref.blur()
      }
      this.selected = val
    },

    params (val: any) {
      if (typeof val === 'object') {
        if (!compareObjects(this.oldParams, val)) {
          this.oldParams = val
          this.fetchData()
        }
      }
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

    fetchData (params = {}) {
      this.dParams = Object.assign({}, this.params, params)
      search(this, this.dParams)
    },

    focus () {
      (this as any).$refs.ref.focus()
    },

    onFocus () {
      if (this.options.length < 2) {
        this.fetchData()
      }
    },

    pushData (data: UserInterface) {
      if (this.options.findIndex((e) => e.id === data.id) === -1) {
        this.options.push(data)
      }
    },

    setData (data: UserInterface[]) {
      this.options = data
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

    setParams (params: any) {
      this.dParams = Object.assign({}, params)
    },

    setSelected (data: UserInterface | null) {
      this.selected = data
    }
  },

  model: {
    event: 'change',
    prop: 'value'
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
      ctx.hintMessage = ctx.$t('Found', { count: response.meta.count })
      ctx.options = response.data
    }).finally(() => (ctx.process = false))
}, 400)
</script>
