<template>
  <v-select
    v-model="selected"
    :items="statuses"
    :multiple="multiple"
    item-value="id"
    item-text="name"
    item-color="color"
    dense
    outlined
    hide-details
    clearable
    hide-selected
    @input="(val) => $emit('change', val)"
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
  </v-select>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'AppStatusSelect',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, Object, Array],
      default: null
    }
  },

  data () {
    return {
      selected: 0 as number | number[]
    }
  },

  computed: {
    ...mapGetters({
      statuses: 'statuses/items'
    })
  },

  watch: {
    value (val: number | number[]) {
      this.selected = val
    }
  },

  mounted () {
    this.selected = this.value

    if (this.statuses.length === 0) {
      this.fetchStatuses()
    }
  },

  methods: {
    ...mapActions({
      fetchStatuses: 'statuses/items'
    })
  }
})
</script>

<style scoped>

</style>
