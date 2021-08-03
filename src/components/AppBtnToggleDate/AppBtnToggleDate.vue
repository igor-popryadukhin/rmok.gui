<template>
  <v-btn-toggle
    v-model="option"
    group
    dense
  >
    <template v-for="(item, key) in items">
      <slot
        name="item"
        :item="item"
        :disabled="disabled"
      >
        <v-tooltip
          :open-delay="1000"
          :close-delay="1000"
          bottom
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              :key="key"
              :value="item.value"
              :disabled="disabled"
              v-on="on"
              @click="onBtnClick(item.value)"
            >
              <slot
                name="btn"
                :item="item"
              >
                {{ item.title }}
              </slot>
            </v-btn>
          </template>
          <span>{{ tooltip(item.value) }}</span>
        </v-tooltip>
      </slot>
    </template>
    <slot name="item-append" />
  </v-btn-toggle>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AppBtnToggleDate',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    value: {
      type: String,
      default () {
        return null
      }
    },
    disabled: {
      type: Boolean,
      default () {
        return false
      }
    }
  },

  data () {
    return {
      option: null as string | null
    }
  },

  watch: {
    value (value: any) {
      this.option = value
    }
  },

  mounted () {
    this.option = this.value
  },

  methods: {
    onBtnClick (value: any) {
      this.$emit('change', value)
    },

    tooltip (value: string) {
      if ((/\d+,\d+/s.test(value))) {
        const range = value.split(',')
        const dates: Date[] = [
          new Date(+range[0] * 1000),
          new Date(+range[1] * 1000)
        ]

        if (dates[0].getDate() === dates[1].getDate()) {
          return `за ${dates[0].toLocaleDateString()}`
        } else {
          return [
            `период с ${dates[1].toLocaleDateString()}`,
            `по ${dates[0].toLocaleDateString()}`
          ].join(' — ')
        }
      }
      return ''
    }
  }
})
</script>

<style scoped>

</style>
