<template>
  <div class="recent-calls-page">
    <recent-calls-tools class="mb-1" />
    <app-divider />
    <div class="recent-calls-page__box">
      <app-block-resize
        :width.sync="settingsFilterWidth"
        :max-width="450"
        class="recent-calls-page__filter"
      >
        <recent-calls-filters
          @click:btn:refresh="fetchStatistic"
          @filter:change="onFilterChange"
        />
      </app-block-resize>
      <div class="recent-calls-page__statistic">
        <div class="d-flex justify-center mb-5">
          <div class="text-center mr-8">
            <h4
              class="text-mono text-normal no-wrap"
              style="font-size: 20px"
            >
              <app-count-up :end-val="totalCalls" />
            </h4>
            <p
              class="grey--text"
              style="font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace !important;"
            >
              Совершено вызовов
            </p>
          </div>
          <div class="text-center">
            <h4
              class="text-mono text-normal no-wrap"
              style="font-size: 20px"
            >
              <app-count-up :end-val="historyCount" />
            </h4>
            <p
              class="grey--text"
              style="font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace !important;"
            >
              Прозвонено клиентов
            </p>
          </div>
        </div>

        <div class="mb-2">
          <app-chart-pie
            :labels="pieLabels"
            :colors="pieColors"
            :series="pieSeries"
            width="100%"
            height="350px"
          />
        </div>

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
          <v-btn
            class="mr-2"
            tile
            text
            outlined
            small
            @click="$toast.info('Ведутся технические работы, выгрузка в файл временно не доступна!')"
          >
            Выгрузить в файл
          </v-btn>
          <app-paginator
            v-model="filterOffset"
            :count="historyCount"
            :per-page="50"
            @click:btn:left="fetchStatisticHistory"
            @click:btn:right="fetchStatisticHistory"
          />
        </div>

        <app-divider :loading="historyFetching && historyItems.length > 0" />

        <div
          v-if="isFetchStatistic && historyItems.length === 0"
          class="d-flex align-center justify-center"
          :style="{height: `${height}px`}"
        >
          <app-loading />
        </div>
        <div
          v-else-if="historyItems.length === 0"
          class="d-flex align-center justify-center"
          :style="{height: `${height}px`}"
        >
          <span class="grey--text">{{ $tc('No data') }}</span>
        </div>
        <v-simple-table
          v-else
          :height="height"
          class="simple-table"
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
              <template v-for="(item, key) in historyItems">
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
                      {{ item.contact.name }}
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
                    {{ $string.truncate(item.comment || '', 20) }}
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
                      {{ item.owner.name }}
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
                      @click="playAudioRecord(item)"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase';
import AppBlockResize from '@/components/AppBlockResize/AppBlockResize.vue';
import AppBtnSorting from '@/components/AppBtnSorting/AppBtnSorting.vue';
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue';
import AppCountUp from '@/components/AppCountup/AppCountUp.vue';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import AppPaginator from '@/components/AppPagination/AppPaginator.vue';
import debounce from '@/utils/debounce';
import RecentCallsFilters from '@/views/Statistics/RecentCalls/RecentCallsFilters.vue';
import RecentCallsTools from '@/views/Statistics/RecentCalls/RecentCallsTools.vue';
import Component from 'vue-class-component';

// eslint-disable-next-line no-use-before-define
@Component<RecentCalls>({
  components: {
    AppBlockResize,
    AppLoading,
    RecentCallsTools,
    AppPaginator,
    AppBtnSorting,
    AppCountUp,
    AppBtnToggleDate,
    RecentCallsFilters,
    AppChartPie: () => import('@/components/AppChartPie/AppChartPie.vue')
  }
})
export default class RecentCalls extends AppBase {
  isFetchStatistic = false

  get height (): number {
    return 600;
  }

  get settingsFilterWidth (): number { return this.$store.getters['statistics/recent_calls/settings/filter_width']; }
  set settingsFilterWidth (val: number) { this.$store.commit('statistics/recent_calls/settings/filter_width', val); }

  // Данные круговой диаграммы
  get pieLabels () {
    return JSON.parse(JSON.stringify(this.$store.getters['statistics/recent_calls/pie_labels']));
  }

  get pieColors () {
    return JSON.parse(JSON.stringify(this.$store.getters['statistics/recent_calls/pie_colors']));
  }

  get pieSeries () {
    return JSON.parse(JSON.stringify(this.$store.getters['statistics/recent_calls/pie_series']));
  }

  // Данные круговой диаграмм
  get historyFetching () {
    return this.$store.getters['statistics/recent_calls/history_fetching'];
  }

  // Количество прозвоненных клиентов в соответствии установленными параметрами фильтров
  get historyCount () {
    return this.$store.getters['statistics/recent_calls/history_count'];
  }

  get historyItems (): Array<Record<string, unknown>> {
    return this.$store.getters['statistics/recent_calls/history'];
  }

  get totalCalls () {
    return this.$store.getters['statistics/recent_calls/total_calls'];
  }

  get totalCallsFetching (): boolean {
    return this.$store.getters['statistics/recent_calls/total_calls_fetching'];
  }

  get filterOffset () {
    return this.$store.getters['statistics/recent_calls/filter/offset'];
  }

  set filterOffset (val: number) {
    this.$store.commit('statistics/recent_calls/filter/offset', val);
  }

  get orderBy () {
    return this.$store.getters['statistics/recent_calls/filter/order_by'];
  }

  set orderBy (val: string) {
    this.$store.commit('statistics/recent_calls/filter/order_by', val);
  }

  get orderDirection () {
    return this.$store.getters['statistics/recent_calls/filter/order_direction'];
  }

  set orderDirection (val: string) {
    this.$store.commit('statistics/recent_calls/filter/order_direction', val);
  }

  get appBtnSorting () {
    return {
      order_by: this.orderBy,
      order_direction: this.orderDirection
    };
  }

  set appBtnSorting ({
    order_by,
    order_direction
  }) {
    this.orderBy = order_by;
    this.orderDirection = order_direction;
  }

  // Возможные варианты сортировки
  get sortingOptions () {
    return ['created_at', 'contact', 'result', 'comment', 'call_duration', 'manager'].map((e) => ({
      name: this.$t(`statistics.recent_calls.sorting_options.${e}`),
      order_by: e,
      order_direction: 'asc',
      visible: true
    }));
  }

  public created () {
    this.fetchStatisticHistory = debounce(this.fetchStatisticHistory, 350);
  }

  public mounted () {
    this.fetchStatistic();
  }

  private async fetchStatistic () {
    this.isFetchStatistic = true;
    Promise.all(
      [
        this.$store.dispatch('statistics/recent_calls/fetch_total_calls'),
        this.$store.dispatch('statistics/recent_calls/fetch_pie'),
        this.$store.dispatch('statistics/recent_calls/fetch_history')
      ]
    ).finally(() => {
      this.isFetchStatistic = false;
    });
  }

  private fetchStatisticHistory () {
    this.$store.dispatch('statistics/recent_calls/fetch_history');
  }

  private onFilterChange () {
    this.$store.commit('statistics/recent_calls/filter/offset', 0);
    this.fetchStatistic();
  }

  /**
   *
   * @param id Идентификатор истории
   * @private
   */
  private playAudioRecord (item) {
    this.$root.$emit('audio-player-show', {
      src: `${process.env.VUE_APP_API_ENDPOINT}/contacts/history/audio/${item.audio_record_id}`,
      author: `${item.owner.name} / ${item.contact.name}`
    });
  }
}
</script>

<style lang="scss">

.recent-calls-page {
  height: calc(100vh - 155px);
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
