<template>
  <v-select
    v-model="selected"
    :items="options"
    :dense="dense"
    :outlined="outlined"
    :label="label"
    item-text="name"
    item-value="id"
  >
    <template v-slot:item="{ item, on, attrs }">
      <v-list-item
        v-bind="attrs"
        v-on="on"
        :color="item.color"
      >
        {{ item.name }}
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts">
import { Database } from '@/api/Database'
import i18n from '@/plugins/i18n'
import Vue, { PropType } from 'vue'
import { UserInterface } from '@/api/Users'

interface ParamsInterface {
  project_id?: number
}

export default Vue.extend({
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

  methods: {
    fetchData (params = {}) {
      new Database()
        .statuses(Object.assign({}, params, this.params))
        .then((response) => {
          this.options = response.data
        })
    }
  },

  model: {
    event: 'change',
    prop: 'value'
  },

  name: 'SStatusesSelect',

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
      type: [Object, Array] as PropType<UserInterface | UserInterface[]>
    },
    visibleIcon: {
      default: false,
      type: Boolean
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
  }
})
</script>
