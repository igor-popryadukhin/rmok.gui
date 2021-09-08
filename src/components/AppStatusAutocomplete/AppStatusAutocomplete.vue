<template>
  <v-autocomplete
    v-model="selected"
    :items="options"
    :multiple="multiple"
    :search-input.sync="q"
    :label="label"
    :disabled="disabled"
    item-value="id"
    item-text="name"
    item-color="color"
    dense
    outlined
    clearable
    hide-selected
  >
    <template
      v-if="multiple"
      #item="{ item, on, attrs }"
    >
      <v-list-item
        v-bind="attrs"
        :color="item.color"
        :input-value="item.id"
        v-on="on"
      >
        {{ item.name }}
      </v-list-item>
    </template>

    <template
      v-if="multiple"
      #selection="{ item }"
    >
      <v-chip
        :color="item.color"
        outlined
        label
        x-small
      >
        {{ item.name }}
      </v-chip>
    </template>
  </v-autocomplete>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { debounce } from 'vuetify/src/util/helpers'

export default Vue.extend({
  name: 'AppStatusAutocomplete',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    label: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => null
    },
    value: {
      type: [Number, Object, Array],
      default: null
    }
  },

  data () {
    return {
      q: null,
      selected: 0 as number | number[]
    }
  },

  computed: {
    ...mapGetters({
      options: 'filter/statuses'
    }),

    paramsQuery () {
      const paramsQuery: Record<string, unknown | string> = {}

      if (this.q) {
        paramsQuery.q = this.q
      }

      return paramsQuery
    }
  },

  watch: {
    value (val: number | number[]) {
      this.selected = val
    },

    options (val: { id: number }[]) {
      if (Array.isArray(this.selected)) {
        // TODO: Проверит наличие и если нет загрузить с сервера
        // Передайте в качестве параметров массив идентификаторов
        // this.$store.dispatch('filter/statuses_append', [1,2,3,...]) Добавит в хранилище новые элементы если есть
      } else {
        if (this.selected > 0 && val.findIndex((e: { id: number }) => e.id === this.selected) === -1) {
          this.$store.dispatch('filter/statuses_append', [this.selected])
        }
      }
    },

    q (val?: string) {
      !!val && this.options.findIndex((e: { name: string }) => e.name?.toLowerCase().indexOf(val.toLowerCase()) > -1) === -1 && this.fetchOptions()
    }
  },

  created () {
    this.fetchOptions = debounce(this.fetchOptions, 350)
  },

  mounted () {
    if (this.options.length === 0) {
      this.fetchOptions()
    }

    // TODO: Даже если не передать входящие параметры, всё ровно произойдёт действие
    // И родитель будет уведомлён об изменении.
    // Корче,спроси меня почему так.
    this.$watch('selected', async (val: number | number[]) => {
      if (Array.isArray(val)) {
        const stack: number[] = []
        val.forEach((id) => {
          if (this.options.findIndex((e1: any) => e1.id === id) === -1) {
            stack.push(id)
          }
        })

        if (stack.length > 0) {
          // загружаю данные с сервера
          await this.$store.dispatch('filter/statuses_append', stack)
          this.$emit('change', val)
        } else {
          this.$emit('change', val)
        }
      } else if (val > 0 && this.options.findIndex((e: { id: number }) => e.id === val) === -1) {
        await this.$store.dispatch('filter/statuses_append', [val])
        this.$emit('change', val)
      } else {
        this.$emit('change', val)
      }
    })

    this.$watch('params', (e: any) => {
      this.$appDebug('Params changing')
      this.fetchOptions()
    })

    if (this.multiple) {
      this.selected = this.value || []
    } else {
      this.selected = this.value
    }
  },

  methods: {
    fetchOptions () {
      // Параметры передаваемые в свойстве имеют приоритет
      this.$store.dispatch('filter/statuses', Object.assign({}, this.paramsQuery, this.params))
    }
  }
})
</script>

<style scoped>

</style>
