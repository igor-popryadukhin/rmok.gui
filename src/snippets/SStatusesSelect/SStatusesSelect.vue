<template>
  <v-select
    v-model="selected"
    :items="options"
    :dense="dense"
    :outlined="outlined"
    :label="label"
    :disabled="disabled"
    :clearable="clearable"
    item-text="name"
    item-value="id"
    return-object
    @focus="onFocus"
  >
    <template v-slot:item="{ item, on, attrs }">
      <v-list-item
        v-bind="attrs"
        v-on="on"
        :color="item.color"
      >
        <span :style="{ color: item.color }">{{ item.name }}</span>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Database, StatusInterface } from '@/api/Database'
import { ProjectInterface } from '@/api/Projects'
import Statuses from '@/api/Statuses'
import i18n from '@/plugins/i18n'
import Vue, { PropType } from 'vue'

interface ParamsInterface {
  project_id?: number
}

export default Vue.extend({
  name: 'SStatusesSelect',

  model: {
    event: 'change',
    prop: 'value'
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
      default: () => i18n.tc('Status'),
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
      type: Object as PropType<ParamsInterface>
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
      type: Object as PropType<StatusInterface>
    }
  },

  created () {
    if (this.autoload) {
      this.fetchData()
    }
  },

  data () {
    return {
      options: [],
      selected: null
    }
  },

  watch: {

    selected (value) {
      this.$emit('change', value)
    },

    value (val: any) {
      this.selected = val
    },

    params (val: any) {
      this.fetchData(val ?? {})
    }
  },

  methods: {
    fetchData (params = {}) {
      new Statuses()
        .findBy(Object.assign({}, params, this.params))
        .then((response) => {
          this.options = response.data
        })
    },

    /**
     * Загрузить с сервера для установки текущего значения
     * @param id
     */
    setDefault (id: number) {
      return new Statuses()
        .findById(id)
        .then((response: StatusInterface) => {
          this.selected = response
          if (!this.options.includes(response)) {
            this.options.push(response)
          }
        })
    },

    onFocus () {
      if (this.options.length === 0) {
        this.fetchData()
      }
    }
  }
})
</script>
