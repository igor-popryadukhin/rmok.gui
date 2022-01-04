<template>
  <app-tools>
    <app-tools-left>
      <v-btn
        v-if="!refreshLoading"
        text
        tile
        small
        @click="onBtnRefreshClick"
      >
        {{ $tc('Refresh') }}
      </v-btn>
      <v-btn
        v-else
        color="red"
        text
        tile
        small
        @click="onBtnLoadCancel"
      >
        {{ $tc('Cancel') }}
      </v-btn>
    </app-tools-left>
    <app-tools-right>
      <app-btn-toggle-date
        v-model="filterPeriod"
        :items="dateRangeCollection"
      />
      <v-divider
        class="mx-1"
        vertical
      />
      <v-btn
        small
        text
        tile
        @click="filterPanelVisible = !filterPanelVisible"
      >
        <v-icon>mdi-filter-outline</v-icon>
        {{ $tc('Filter') }}
      </v-btn>
    </app-tools-right>
  </app-tools>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
@Component({
  components: { AppBtnToggleDate }
})
export default class RecentCallsTools extends AppBase {
  isoFormat = 'YYYY-MM-DDTHH:mm:ss'

  get filterPanelVisible () { return this.$store.getters['statistics/recent_calls/filter/panel_visible'] }
  set filterPanelVisible (value: boolean) { this.$store.commit('statistics/recent_calls/filter/panel_visible', value) }

  get filterPeriod () {
    const dtA = this.$dayjs().set('h', 0).set('m', 0).set('s', 0).set('millisecond', 0)
    const dtB = this.$dayjs().set('h', 23).set('m', 59).set('s', 59).set('millisecond', 0)

    return this.$store.getters['statistics/recent_calls/filter/period'] || `${dtA.format(this.isoFormat)}|${dtB.format(this.isoFormat)}`
  }

  set filterPeriod (val: string) { this.$store.commit('statistics/recent_calls/filter/period', val) }

  // Возможные варианты диапазонов
  get dateRangeCollection () {
    const dtA = this.$dayjs().set('h', 0).set('m', 0).set('s', 0).set('millisecond', 0)
    const dtB = this.$dayjs().set('h', 23).set('m', 59).set('s', 59).set('millisecond', 0)

    return [
      {
        title: this.$tc('Today'),
        tooltip: `За ${dtA.format('DD.MM.YYYY')}`,
        value: `${dtA.format(this.isoFormat)}|${dtB.format(this.isoFormat)}`
      },
      {
        title: this.$tc('Yesterday'),
        tooltip: `За ${dtA.subtract(1, 'day').format('DD.MM.YYYY')}`,
        value: `${dtA.subtract(1, 'day').format(this.isoFormat)}|${dtB.subtract(1, 'day').format(this.isoFormat)}`
      },
      {
        title: this.$tc('This week'),
        tooltip: `c ${dtA.startOf('week').format('DD.MM.YYYY')} по ${dtB.endOf('week').format('DD.MM.YYYY')}`,
        value: `${dtA.startOf('week').format(this.isoFormat)}|${dtB.endOf('week').format(this.isoFormat)}`
      },
      {
        title: this.$tc('Last week'),
        tooltip: `c ${dtA.subtract(1, 'week').startOf('week').format('DD.MM.YYYY')} по ${dtB.subtract(1, 'week').endOf('week').format('DD.MM.YYYY')}`,
        value: `${dtA.startOf('week').subtract(1, 'week').format(this.isoFormat)}|${dtB.endOf('week').subtract(1, 'week').format(this.isoFormat)}`
      },
      {
        title: this.$t('per_month', { name: this.$dayjs().format('MMMM') }).toString(),
        tooltip: `c ${dtA.startOf('month').format('DD.MM.YYYY')} по ${dtB.endOf('month').format('DD.MM.YYYY')}`,
        value: `${dtA.startOf('month').format(this.isoFormat)}|${dtB.endOf('month').format(this.isoFormat)}`
      }
    ]
  }

  get refreshLoading () {
    return this.$store.getters['statistics/recent_calls/pie_fetching']
  }

  private fetchStatistic () {
    this.$store.dispatch('statistics/recent_calls/fetch_total_calls')
    this.$store.dispatch('statistics/recent_calls/fetch_pie')
    this.$store.dispatch('statistics/recent_calls/fetch_history')
  }

  private onBtnRefreshClick () {
    this.fetchStatistic()
  }

  private onBtnLoadCancel () {
    this.$store.dispatch('statistics/recent_calls/cancel_fetching_all')
  }
}
</script>

<style scoped>

</style>
