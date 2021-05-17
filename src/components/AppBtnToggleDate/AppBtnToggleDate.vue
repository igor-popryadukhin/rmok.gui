<template>
  <v-btn-toggle
    v-model="option"
    group
    dense
  >
    <template v-for="(item, key) in items">
      <slot name="item" v-bind="{ item }">
        <v-tooltip
          :open-delay="1000"
          :close-delay="1000"
          bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              :key="key"
              :value="item.value"
              @click="onBtnClick(item.value)"
            >
              {{ item.title }}
            </v-btn>
          </template>
          <span>{{ tooltip(item.value) }}</span>
        </v-tooltip>
      </slot>
    </template>
    <slot name="item-append"></slot>
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
    }
  },

  data () {
    return {
      option: null as string | null
    }
  },

  mounted () {
    this.option = this.value
  },

  watch: {
    value (value: any) {
      this.option = value
    }
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
