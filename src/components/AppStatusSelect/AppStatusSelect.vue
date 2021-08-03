<template>
  <v-select
    v-model="selected"
    :items="statuses"
    item-value="id"
    item-text="name"
    item-color="color"
    dense
    outlined
    hide-details
    clearable
    @input="(val) => $emit('change', val)"
  />
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
    value: {
      type: [Number, Object],
      default: null
    }
  },

  data () {
    return {
      selected: 0 as number
    }
  },

  computed: {
    ...mapGetters({
      statuses: 'statuses/items'
    })
  },

  watch: {
    value (val: number) {
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
