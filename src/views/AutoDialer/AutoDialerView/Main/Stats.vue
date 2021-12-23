<template>
  <v-sheet>
    <ul class="statistic">
      <li
        v-for="(item, key) in stats"
        :key="key"
        class="statistic_li"
      >
        <div class="mr-2">
          {{ item.title }}
        </div>
        <v-spacer />
        <div class="px-2 text-right">
          {{ item.value }}
        </div>
      </li>
    </ul>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from '../Base'

@Component
export default class Journal extends Base {
  stats = []

  get items (): Array<Record<string, any>> {
    return this.$store.getters['autodialer/view/journal/items']
  }

  created () {
    this.$root.$on('sse-autodialer-worker-stats', this.onSSEAutodialerWorkerStats)
  }

  beforeDestroy () {
    this.$root.$off('sse-autodialer-worker-stats', this.onSSEAutodialerWorkerStats)
  }

  onSSEAutodialerWorkerStats (data: Array<Record<string, any>>) {
    this.stats = data
  }
}
</script>

<style lang="scss" scoped>
.statistic {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.statistic_li {
  display: flex;
  flex-wrap: nowrap;
}

</style>
