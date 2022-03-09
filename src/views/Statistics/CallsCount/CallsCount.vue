<template>
  <div class="recent-calls-page">
    <calls-count-tools class="mb-1" />
    <app-divider />
    <div class="recent-calls-page__box">
      <app-block-resize
        :width.sync="settingsFilterWidth"
        :max-width="450"
        class="recent-calls-page__filter"
      >
        <calls-count-filters
          @click:btn:refresh="fetchStatistic"
          @filter:change="onFilterChange"
        />
      </app-block-resize>
      <div class="recent-calls-page__statistic">
        <div :style="{ height: apexchartHeight }">
          <apexchart
            type="bar"
            :options="apexchartOptions"
            :series="apexchartSeries"
          />
        </div>
      </div>
    </div>
    <app-divider />
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppBlockResize from '@/components/AppBlockResize/AppBlockResize.vue'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppCountUp from '@/components/AppCountup/AppCountUp.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue'
import AppSummary from '@/components/AppSummary/AppSummary.vue'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import Component from 'vue-class-component'
import CallsCountFilters from './CallsCountFilters.vue'
import CallsCountTools from './CallsCountTools.vue'

Vue.use(VueApexCharts)
Vue.component('Apexchart', VueApexCharts)

// eslint-disable-next-line no-use-before-define
@Component<CallsCount>({
  components: {
    AppBlockResize,
    AppLoading,
    AppBtnSorting,
    AppSummary,
    AppCountUp,
    AppBtnToggleDate,
    AppNavigationDrawer,
    CallsCountTools,
    CallsCountFilters
  }
})
export default class CallsCount extends AppBase {
  isFetchStatistic = false

  get settingsFilterWidth (): number {
    return this.$store.getters['statistics/calls_count/settings/filter_width']
  }

  set settingsFilterWidth (val: number) {
    this.$store.commit('statistics/calls_count/settings/filter_width', val)
  }

  get items () {
    return (this.$store.getters['statistics/calls_count/items'] || [])
  }

  // Данные круговой диаграммы
  get apexchartSeries () {
    return [
      {
        data: this.items
          .map((e: any) => {
            return {
              x: e.name,
              y: e.total
            }
          })
      }
    ]
  }

  get apexchartHeight () {
    if (this.items.length < 10) {
      return '100%'
    } else {
      return `${this.items.length * 30}px`
    }
  }

  get apexchartOptions () {
    return {
      chart: {
        redrawOnParentResize: true,
        redrawOnWindowResize: true,
        parentHeightOffset: 0,
        type: 'bar',
        height: this.apexchartHeight,
        toolbar: {
          show: false
        }
      },

      legend: {
        position: 'left',
        show: true
      },

      noData: {
        align: 'center',
        offsetX: 0,
        offsetY: 0,
        style: {
          color: undefined,
          fontFamily: undefined,
          fontSize: '16px'
        },
        text: this.$tc('No data'),
        verticalAlign: 'middle'
      },

      plotOptions: {
        bar: {
          columnWidth: '70%',
          barHeight: '70%',
          dataLabels: {
            hideOverflowingLabels: false,
            maxItems: 100,
            orientation: 'horizontal',
            position: 'bottom'
          },
          horizontal: true
        }
      },
      // Точка останова - это максимальная ширина экрана, при которой исходный объект конфигурации будет
      // переопределен объектом конфигурации
      responsive: [
        {
          breakpoint: undefined,
          options: {}
        }
      ]
    }
  }

  public mounted () {
    this.fetchStatistic()
  }

  private async fetchStatistic () {
    this.isFetchStatistic = true
    this.$store.dispatch('statistics/calls_count/fetch')
      .finally(() => {
        this.isFetchStatistic = false
      })
  }

  private onFilterChange () {
    this.fetchStatistic()
  }
}
</script>

<style lang="scss">

.recent-calls-page {
  height: calc(100vh - 130px);
}

.recent-calls-page__box {
  display: flex;
  flex-wrap: nowrap;
  height: inherit;
  margin: 5px 0 5px 0;
}

.recent-calls-page__filter {
  height: inherit;
  overflow-y: auto;
}


.recent-calls-page__statistic {
  flex-grow: 1;
  height: inherit;
  overflow: auto;
  padding: 10px;
}

.simple-table {
}

.simple-table thead th {
}

.simple-table tr {
}

.simple-table tr td {
  height: 25px !important;
  font-size: 12px !important;
}

.column-datetime {
  width: 10px;
}

.column-client {
  width: auto;
}

.column-status-result {
  width: 10px;
}

.column-comment {
  width: 10px;
}

.column-duration {
  width: 10px;
}

.column-manager {
  width: 10px;
}

.column-action {
  width: 10px;
}
</style>
