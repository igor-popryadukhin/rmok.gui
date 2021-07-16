<template>
  <v-select
    v-model="selected"
    :items="statuses"
    :dense="dense"
    :outlined="outlined"
    :label="label"
    :disabled="disabled"
    :clearable="clearable"
    item-text="name"
    item-value="id"
    return-object
    @focus="onFocus"
    :multiple="multiple"
  >
    <template v-slot:selection="{ attrs, item, select, selected }">
      <template v-if="multiple">
        <v-chip
          v-bind="attrs"
          :input-value="selected"
          close
          :color="item.color"
          label
          small
          outlined
          @click="select"
          @click:close="removeChip(item)"
        >
          {{ item.name }}
        </v-chip>
      </template>
      <template v-else>
        {{ item.name }}
      </template>
    </template>
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
import i18n from '@/plugins/i18n'
import Vue, { PropType } from 'vue'
import { mapGetters } from 'vuex'

interface ParamsInterface {
  project_id?: number
}

interface StatusInterface {
  id: number;
  name: string;
  color?: string;
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
      type: [Object, Array] as PropType<StatusInterface | StatusInterface[]>
    }
  },

  created () {
    if (this.autoload) {
      this.fetchData()
    }
  },

  data () {
    return {
      selected: null as unknown as StatusInterface | StatusInterface[]
    }
  },

  computed: {
    ...mapGetters({
      statuses: 'filter/statuses'
    })
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
      this.$store.dispatch('filter/statuses', Object.assign({}, params, this.params))
    },

    onFocus () {
      // Загружаю статусы с сервера
      this.fetchData()
    },

    removeChip (item: unknown & StatusInterface) {
      if (Array.isArray(this.selected)) {
        const index = this.selected.findIndex(value => value.id === item.id)
        if (index > -1) {
          this.selected.splice(index, 1)
          this.selected = [...this.selected]
        }
      }
    }
  }
})
</script>
