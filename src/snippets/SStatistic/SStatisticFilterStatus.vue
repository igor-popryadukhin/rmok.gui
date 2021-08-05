<template>
  <div>
    <v-autocomplete
      v-model="selected"
      :cache-items="false"
      :disabled="!isItems"
      :items="items"
      :label="$tc('Statistic filter by statuses')"
      :loading="!isItems"
      :no-data-text="$tc('No data available')"
      chips
      clearable
      dense
      item-text="name"
      item-value="id"
      multiple
      outlined
      single-line
      @focusout="$emit('change', selected)"
    >
      <template #selection="data">
        <v-chip
          class="ma-1"
          color="primary"
          small
          label
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          @click:close="remove(data.item)"
        >
          {{ data.item.name }}
        </v-chip>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

export default Vue.extend({
  name: 'SStatisticFilterResult',
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      default: () => [],
      type: Array
    }
  },
  data () {
    return {
      selected: this.value
    }
  },

  computed: {
    ...mapGetters({
      items: 'statuses/items'
    }),
    isItems () {
      return this.items.length > 0
    }
  },

  mounted () {
    if (!this.isItems) {
      this.fetchItems()
    }
  },

  methods: {
    ...mapActions({
      fetchItems: 'statuses/items'
    }),
    remove (item) {
      const index = this.selected.indexOf(item.id)
      if (index >= 0) this.selected.splice(index, 1)
    }
  },

  watch: {
    value (val) {
      this.selected = val
    }
  }
})
</script>

<style scoped>

</style>
