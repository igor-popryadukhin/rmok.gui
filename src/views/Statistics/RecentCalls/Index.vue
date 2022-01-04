<template>
  <v-sheet>
    <recent-calls-tools />

    <v-sheet
      :height="height"
      class="overflow-y-auto pa-3"
      outlined
    >
      <v-row>
        <v-col>
          <v-sheet
            class="d-flex flex-wrap align-start justify-start mb-sm-2 mb-md-2"
          >
            <!-- Статистическая сводка -->
            <app-summary
              class="mr-3 mb-3"
              text="Совершено вызовов"
              color="#4caf50"
              icon="mdi-phone-in-talk-outline"
              :loading="totalCallsFetching && filterOffset === 0"
              :value="totalCalls"
              :width="250"
              :height="130"
            />
            <app-summary
              class="mr-3 mb-3"
              text="Всего клиентов прозвонено"
              color="#3f51b5"
              icon="mdi-account-group-outline"
              :loading="historyFetching"
              :value="historyCount"
              :width="250"
              :height="130"
            />
            <!-- Статистическая сводка -->
          </v-sheet>
          <v-divider v-if="['sm', 'md'].includes($vuetify.breakpoint.name)" />
        </v-col>
        <v-col
          cols="12"
          xl="8"
          lg="8"
          md="12"
          sm="12"
        >
          <app-chart-pie
            :labels="pieLabels"
            :colors="pieColors"
            :series="pieSeries"
            width="90%"
            height="350px"
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <div class="d-flex mb-2">
            <app-btn-sorting
              :label="$tc('Sorting')"
              :items="sortingOptions"
              item-text="name"
            />
            <v-spacer />
            <app-paginator
              :count="historyCount"
              :per-page="50"
            />
          </div>
          <recent-calls-table :height="700" />
        </v-col>
      </v-row>
    </v-sheet>

    <app-navigation-drawer v-model="filterPanelVisible">
      <recent-calls-filters @btn:refresh:click="fetchStatistic" />
    </app-navigation-drawer>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import RecentCallsFilters from '@/views/Statistics/RecentCalls/RecentCallsFilters.vue'
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import RecentCallsTable from '@/views/Statistics/RecentCalls/RecentCallsTable.vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppSummary from '@/components/AppSummary/AppSummary.vue'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'
import RecentCallsTools from '@/views/Statistics/RecentCalls/RecentCallsTools.vue'

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: {
    RecentCallsTools,
    AppPaginator,
    AppBtnSorting,
    AppSummary,
    AppCountUp,
    RecentCallsTable,
    AppBtnToggleDate,
    AppNavigationDrawer,
    RecentCallsFilters,
    AppChartPie: () => import('@/components/AppChartPie/AppChartPie.vue')
  }
})
export default class Index extends AppBase {
  get height (): number {
    return this.screenHeight - 122
  }

  get filterPanelVisible () { return this.$store.getters['statistics/recent_calls/filter/panel_visible'] }
  set filterPanelVisible (value: boolean) { this.$store.commit('statistics/recent_calls/filter/panel_visible', value) }

  // Данные круговой диаграммы
  get pieLabels () { return this.$store.getters['statistics/recent_calls/pie_labels'] }
  get pieColors () { return this.$store.getters['statistics/recent_calls/pie_colors'] }
  get pieSeries () { return this.$store.getters['statistics/recent_calls/pie_series'] }

  // Данные круговой диаграмм
  get historyFetching () { return this.$store.getters['statistics/recent_calls/history_fetching'] }
  // Количество прозвоненных клиентов в соответствии установленными параметрами фильтров
  get historyCount () { return this.$store.getters['statistics/recent_calls/history_count'] }

  get totalCalls () { return this.$store.getters['statistics/recent_calls/total_calls'] }
  get totalCallsFetching () { return this.$store.getters['statistics/recent_calls/total_calls_fetching'] }
  get filterOffset () { return this.$store.getters['statistics/recent_calls/filter/offset'] }

  // Возможные варианты сортировки
  get sortingOptions () {
    return ['created_at', 'contact', 'result', 'comment', 'call_duration', 'session_duration', 'manager'].map((e) => ({
      name: this.$t(`statistics.recent_calls.sorting_options.${e}`),
      order_by: e,
      order_direction: 'asc',
      visible: true
    }))
  }

  mounted () {
    this.fetchStatistic()
  }

  private fetchStatistic () {
    this.$store.dispatch('statistics/recent_calls/fetch_total_calls')
    this.$store.dispatch('statistics/recent_calls/fetch_pie')
    this.$store.dispatch('statistics/recent_calls/fetch_history')
  }
}
</script>

<style lang="scss">
.navigation-drawer {
  margin-left: 30px;
  overflow: inherit;
}
.v-navigation-drawer__pixar {
  position: absolute;
  transform: rotate(90deg);
  left: -30px;
  top: 0;
  height: 10%;
  width: 30px;
  background-color: #f4355b;
  overflow: hidden;
}
</style>
