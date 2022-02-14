<template>
  <div class="d-flex flex-nowrap align-center justify-space-between mb-2">
    <div class="d-flex flex-nowrap align-center">
      <app-btn-toggle-date
        v-model="filterPeriod"
        :items="dateRangeCollection"
        class="mr-5"
      >
        <template #item-append>
          <v-menu
            :close-on-content-click="false"
            transition="scale-transition"
            min-width="auto"
            offset-y
            left
          >
            <template #activator="{ on, attrs }">
              <v-btn
                small
                value="sex"
                v-bind="attrs"
                v-on="on"
              >
                {{ customPeriodDisplay || $tc('Customizable') }}
              </v-btn>
            </template>
            <v-date-picker
              v-model="customPeriod"
              :first-day-of-week="1"
              locale="ru"
              flat
              range
              no-title
              show-current
            />
          </v-menu>
        </template>
      </app-btn-toggle-date>
    </div>
    <div class="d-flex flex-nowrap align-center" />
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

@Component({
  components: { AppBtnToggleDate }
})
export default class RecentCallsTools extends AppBase {
  isoFormat = 'YYYY-MM-DDTHH:mm:ss'
  customPeriod = null

  get filterPeriod () {
    const dtA = this.$dayjs().set('h', 0).set('m', 0).set('s', 0).set('millisecond', 0)
    const dtB = this.$dayjs().set('h', 23).set('m', 59).set('s', 59).set('millisecond', 0)

    return this.$store.getters['statistics/recent_calls/filter/period'] || `${dtA.format(this.isoFormat)}|${dtB.format(this.isoFormat)}`
  }

  set filterPeriod (val: string) {
    if (/\d{4}-\d{2}-\d{2}\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/s.test(val)) {
      this.customPeriod = []
      this.$store.commit('statistics/recent_calls/filter/period', val)
    }
  }

  get customPeriodDisplay () {
    if (Array.isArray(this.customPeriod) && this.customPeriod.length === 2) {
      const dtA = this.$dayjs(this.customPeriod[0], 'YYYY-MM-DD')
      const dtB = this.$dayjs(this.customPeriod[1], 'YYYY-MM-DD')
      return [dtA.format('DD.MM.YYYY'), dtB.format('DD.MM.YYYY')].join(' - ')
    }
    return ''
  }

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

  @Watch('filterPeriod')
  filterPeriodWatchHandler () {
    this.$store.commit('statistics/recent_calls/filter/offset', 0)
    this.fetchStatistic()
  }

  @Watch('customPeriod')
  customPeriodWatchHandler (val: string[]) {
    this.$store.commit('statistics/recent_calls/filter/offset', 0)
    if (val.length === 2) {
      const d1 = this.$dayjs(val[0], 'YYYY-MM-DD')
      const d2 = this.$dayjs(val[1], 'YYYY-MM-DD')
      if (d1.diff(d2, 'day') >= 0) {
        this.$store.commit('statistics/recent_calls/filter/period', `${val[1]}T00:00:00|${val[0]}T23:59:59`)
      } else {
        this.$store.commit('statistics/recent_calls/filter/period', `${val[0]}T00:00:00|${val[1]}T23:59:59`)
      }
    }
  }

  public mounted () {
    if (this.filterPeriod && this.dateRangeCollection.findIndex((e) => e.value === this.filterPeriod) === -1) {
      const dates = this.filterPeriod.split('|')
      this.customPeriod = [
        this.$dayjs(dates[0]).format('YYYY-MM-DD'),
        this.$dayjs(dates[1]).format('YYYY-MM-DD')
      ]
    }
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
    this.$store.dispatch('statistics/recent_calls/cancel_fetch_all')
  }
}
</script>

<style scoped>

</style>
