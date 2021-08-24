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
          <span v-if="item.tooltip">{{ item.tooltip }}</span>
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
      type: [String, Object],
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
    }
  }
})
</script>

<style scoped>

</style>
