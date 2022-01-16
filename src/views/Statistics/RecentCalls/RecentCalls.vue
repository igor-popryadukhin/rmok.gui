<template>
  <v-sheet>
    <recent-calls-tools />

    <v-sheet
      class="pa-3"
      outlined
    >
      <v-row class="mb-5">
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
              :loading="totalCallsFetching"
              :value="totalCalls"
              :width="250"
              :height="130"
            />
            <app-summary
              class="mr-3 mb-3"
              text="Всего клиентов прозвонено"
              color="#3f51b5"
              icon="mdi-account-group-outline"
              :loading="historyFetching && filterOffset === 0"
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

      <v-divider class="mb-2" />

      <div class="d-flex mb-2">
        <app-btn-sorting
          v-model="appBtnSorting"
          :label="$tc('Sorting')"
          :items="sortingOptions"
          item-text="name"
          @change="fetchStatisticHistory()"
        />
        <v-spacer />
        <app-paginator
          v-model="filterOffset"
          :count="historyCount"
          :per-page="50"
          @click:btn:left="fetchStatisticHistory"
          @click:btn:right="fetchStatisticHistory"
        />
      </div>

      <v-divider class="mb-2" />

      <div
        v-if="isFetchStatistic && items.length === 0"
        class="d-flex align-center justify-center"
        :style="{height: `${height}px`}"
      >
        <app-loading />
      </div>
      <div
        v-else-if="items.length === 0"
        class="d-flex align-center justify-center"
        :style="{height: `${height}px`}"
      >
        <span class="grey--text">{{ $tc('No data') }}</span>
      </div>
      <v-simple-table
        v-else
        :height="height"
        class="simple-table"
        style="width: 100%"
        fixed-header
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th class="text-left">
                {{ $tc('Date time') }}
              </th>
              <th
                class="text-left"
              >
                {{ $tc('Client') }}
              </th>
              <th class="text-left">
                {{ $tc('Result') }}
              </th>
              <th
                class="text-left"
              >
                {{ $tc('Comment') }}
              </th>
              <th class="text-left">
                {{ $tc('Duration') }}
              </th>
              <th class="text-left">
                {{ $tc('Manager') }}
              </th>
              <th class="text-left" />
            </tr>
          </thead>
          <tbody>
            <template v-for="(item, key) in items">
              <tr
                :key="key"
              >
                <td class="column-datetime text-no-wrap">
                  <template v-if="item.created_at">
                    {{ $dayjs(item.created_at).format('DD.MM.YYYY HH:mm') }}
                  </template>
                  <template v-else>
                    —
                  </template>
                </td>

                <!-- Имя контакта -->
                <td class="column-client text-no-wrap">
                  <router-link :to="{ name: 'contacts_view', params: {id: item.contact.id}}">
                    {{ item.contact.full_name }}
                  </router-link>
                </td>
                <!-- Имя контакта -->

                <!-- Статус/Результат -->
                <td class="column-status-result text-no-wrap">
                  <template v-if="item.status">
                    <v-chip
                      :color="item.status.color"
                      x-small
                      label
                      outlined
                      @click.stop="$emit('click:item:status', item.status.id)"
                    >
                      {{ item.status.name }}
                    </v-chip>
                  </template>
                  <template v-else>
                    —
                  </template>
                </td>
                <!-- Статус/Результат -->

                <!-- Комментарий -->
                <td class="column-comment text-no-wrap">
                  {{ $string.truncate(item.comment, 20) }}
                </td>
                <!-- Комментарий -->

                <!--  -->
                <td class="column-duration text-no-wrap">
                  {{ item.call_duration || '--:--:--' }}
                </td>
                <!--  -->

                <!-- Менеджер -->
                <td class="column-manager text-no-wrap">
                  <template v-if="item.owner">
                    {{ item.owner.full_name }}
                  </template>
                  <template v-else>
                    —
                  </template>
                </td>
                <!-- Менеджер -->

                <!--  -->
                <td class="column-action text-no-wrap">
                  <v-btn
                    icon
                    x-small
                  >
                    <v-icon>mdi-play</v-icon>
                  </v-btn>
                </td>
              <!--  -->
              </tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </v-sheet>

    <app-navigation-drawer v-model="filterPanelVisible">
      <recent-calls-filters
        @click:btn:refresh="fetchStatistic"
        @filter:change="onFilterChange"
      />
    </app-navigation-drawer>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'
import RecentCallsFilters from '@/views/Statistics/RecentCalls/RecentCallsFilters.vue'
import AppNavigationDrawer from '@/components/AppNavigationDrawer/AppNavigationDrawer.vue'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppSummary from '@/components/AppSummary/AppSummary.vue'
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'
import RecentCallsTools from '@/views/Statistics/RecentCalls/RecentCallsTools.vue'

// eslint-disable-next-line no-use-before-define
@Component<RecentCalls>({
  components: {
    AppLoading,
    RecentCallsTools,
    AppPaginator,
    AppBtnSorting,
    AppSummary,
    AppCountUp,
    AppBtnToggleDate,
    AppNavigationDrawer,
    RecentCallsFilters,
    AppChartPie: () => import('@/components/AppChartPie/AppChartPie.vue')
  }
})
export default class RecentCalls extends AppBase {
  isFetchStatistic = false

  get height (): number {
    return 600
  }

  get items (): Array<Record<string, unknown>> { return this.$store.getters['statistics/recent_calls/history'] }

  get filterPanelVisible () { return this.$store.getters['statistics/recent_calls/filter/panel_visible'] }
  set filterPanelVisible (value: boolean) { this.$store.commit('statistics/recent_calls/filter/panel_visible', value) }

  // Данные круговой диаграммы
  get pieLabels () { return JSON.parse(JSON.stringify(this.$store.getters['statistics/recent_calls/pie_labels'])) }
  get pieColors () { return JSON.parse(JSON.stringify(this.$store.getters['statistics/recent_calls/pie_colors'])) }
  get pieSeries () { return JSON.parse(JSON.stringify(this.$store.getters['statistics/recent_calls/pie_series'])) }

  // Данные круговой диаграмм
  get historyFetching () { return this.$store.getters['statistics/recent_calls/history_fetching'] }
  // Количество прозвоненных клиентов в соответствии установленными параметрами фильтров
  get historyCount () { return this.$store.getters['statistics/recent_calls/history_count'] }

  get totalCalls () { return this.$store.getters['statistics/recent_calls/total_calls'] }
  get totalCallsFetching (): boolean { return this.$store.getters['statistics/recent_calls/total_calls_fetching'] }

  get filterOffset () { return this.$store.getters['statistics/recent_calls/filter/offset'] }
  set filterOffset (val: number) { this.$store.commit('statistics/recent_calls/filter/offset', val) }

  get orderBy () { return this.$store.getters['statistics/recent_calls/filter/order_by'] }
  set orderBy (val: string) { this.$store.commit('statistics/recent_calls/filter/order_by', val) }

  get orderDirection () { return this.$store.getters['statistics/recent_calls/filter/order_direction'] }
  set orderDirection (val: string) { this.$store.commit('statistics/recent_calls/filter/order_direction', val) }

  get appBtnSorting () {
    return {
      order_by: this.orderBy,
      order_direction: this.orderDirection
    }
  }

  set appBtnSorting ({ order_by, order_direction }) {
    this.orderBy = order_by
    this.orderDirection = order_direction
  }

  // Возможные варианты сортировки
  get sortingOptions () {
    return ['created_at', 'contact', 'result', 'comment', 'call_duration', 'session_duration', 'manager'].map((e) => ({
      name: this.$t(`statistics.recent_calls.sorting_options.${e}`),
      order_by: e,
      order_direction: 'asc',
      visible: true
    }))
  }

  public created () {
    this.fetchStatisticHistory = debounce(this.fetchStatisticHistory, 350)
  }

  public mounted () {
    this.fetchStatistic()
  }

  private async fetchStatistic () {
    this.isFetchStatistic = true
    await this.$store.dispatch('statistics/recent_calls/fetch_total_calls')
    await this.$store.dispatch('statistics/recent_calls/fetch_pie')
    await this.$store.dispatch('statistics/recent_calls/fetch_history')
    this.isFetchStatistic = false
  }

  private fetchStatisticHistory () {
    this.$store.dispatch('statistics/recent_calls/fetch_history')
  }

  private onFilterChange () {
    this.$store.commit('statistics/recent_calls/filter/offset', 0)
    this.fetchStatistic()
  }
}
</script>

<style lang="scss">

.simple-table {}
.simple-table thead th {}
.simple-table tr {}
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
