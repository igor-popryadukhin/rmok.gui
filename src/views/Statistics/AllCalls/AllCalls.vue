<template>
  <div class="all-calls-page">
    <all-calls-tools />
    <app-divider />
    <div class="all-calls-page__box">
      <app-block-resize
        :width.sync="settingsFilterWidth"
        :max-width="450"
        class="all-calls-page__filter"
      >
        <all-calls-filters
          @click:btn:refresh="fetchStatistic"
          @filter:change="onFilterChange"
        />
      </app-block-resize>
      <div class="all-calls-page__statistic">
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
        <v-data-table
          item-key="id"
          selectable-key="id"
          height="calc(100vh - 130px)"
          :item-class="() => 'contacts-item'"
          :headers="contactsHeaders"
          :items="historyItems"
          :server-items-length="historyCount"
          :items-per-page="100"
          :loading="historyFetching"
          calculate-widths
          fixed-header
          hide-default-footer
          show-select
          dense
        >
          <template #progress>
            {{ '' }}
          </template>
          <template #no-data>
            <div
              class="d-flex align-center justify-center grey--text"
              style="height: calc(100vh - 550px)"
            >
              {{ $tc('Missing data') }}
            </div>
          </template>
          <template #loading>
            <div
              class="d-flex align-center justify-center grey--text"
              style="height: calc(100vh - 160px)"
            >
              <app-loading />
            </div>
          </template>
          <template #[`item.full_name`]="{ item }">
            <router-link :to="{ name: 'contacts_view', params: { id: item.id } }">
              {{ item.full_name }}
            </router-link>
          </template>
          <template #[`item.status`]="{ item }">
            <template v-if="typeof item.status === 'object'">
              <v-chip
                :color="item.status.color"
                label
                x-small
                outlined
              >
                {{ item.status.name }}
              </v-chip>
            </template>
            <template v-else>
              —
            </template>
          </template>
        </v-data-table>
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
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'
import AppSummary from '@/components/AppSummary/AppSummary.vue'
import debounce from '@/utils/debounce'
import AllCallsFilters from '@/views/Statistics/AllCalls/AllCallsFilters.vue'
import AllCallsTools from '@/views/Statistics/AllCalls/AllCallsTools.vue'

import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<AllCalls>({
  components: {
    AllCallsFilters,
    AllCallsTools,
    AppBlockResize,
    AppLoading,
    AppPaginator,
    AppBtnSorting,
    AppSummary,
    AppCountUp,
    AppBtnToggleDate
  }
})
export default class AllCalls extends AppBase {
  isFetchStatistic = false

  get height (): number {
    return 700
  }

  get settingsFilterWidth (): number { return this.$store.getters['statistics/all_calls/settings/filter_width'] }
  set settingsFilterWidth (val: number) { this.$store.commit('statistics/all_calls/settings/filter_width', val) }

  get historyFetching () {
    return this.$store.getters['statistics/all_calls/history_fetching']
  }

  // Количество прозвоненных клиентов в соответствии установленными параметрами фильтров
  get historyCount () {
    return this.$store.getters['statistics/all_calls/history_count']
  }

  get contactsHeaders () {
    return [
      {
        text: 'Date time',
        align: 'start',
        sortable: false,
        value: 'created_at'
      },
      // {
      //   text: 'Customer',
      //   align: 'center',
      //   sortable: false,
      //   value: 'contact'
      // },
      // {
      //   text: 'Result',
      //   align: 'center',
      //   sortable: false,
      //   value: 'status'
      // },
      // {
      //   text: 'Comment',
      //   align: 'center',
      //   sortable: false,
      //   value: 'comment'
      // },
      // {
      //   text: 'Duration',
      //   align: 'start',
      //   sortable: false,
      //   value: 'call_duration'
      // },
      // {
      //   text: 'Manager',
      //   align: 'start',
      //   sortable: false,
      //   value: 'manager'
      // }
    ]
  }

  get historyItems () {
    type K = string
    type T = number|string|object
    return (this.$store.getters['statistics/all_calls/history'] as Array<Record<K, T>>)
    .map((e) => {
      return {
        created_at: this.$dayjs(e.created_at).format('DD.MM.YYYY')
      }
    })
  }

  get totalCalls () {
    return this.$store.getters['statistics/all_calls/total_calls']
  }

  get totalCallsFetching (): boolean {
    return this.$store.getters['statistics/all_calls/total_calls_fetching']
  }

  get filterOffset () {
    return this.$store.getters['statistics/all_calls/filter/offset']
  }

  set filterOffset (val: number) {
    this.$store.commit('statistics/all_calls/filter/offset', val)
  }

  get orderBy () {
    return this.$store.getters['statistics/all_calls/filter/order_by']
  }

  set orderBy (val: string) {
    this.$store.commit('statistics/all_calls/filter/order_by', val)
  }

  get orderDirection () {
    return this.$store.getters['statistics/all_calls/filter/order_direction']
  }

  set orderDirection (val: string) {
    this.$store.commit('statistics/all_calls/filter/order_direction', val)
  }

  get appBtnSorting () {
    return {
      order_by: this.orderBy,
      order_direction: this.orderDirection
    }
  }

  set appBtnSorting ({
    order_by,
    order_direction
  }) {
    this.orderBy = order_by
    this.orderDirection = order_direction
  }

  // Возможные варианты сортировки
  get sortingOptions () {
    return ['created_at', 'contact', 'result', 'comment', 'call_duration', 'session_duration', 'manager'].map((e) => ({
      name: this.$t(`statistics.all_calls.sorting_options.${e}`),
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
    Promise.all(
      [
        this.$store.dispatch('statistics/all_calls/fetch')
      ]
    ).finally(() => (this.isFetchStatistic = false))
  }

  private fetchStatisticHistory () {
    this.$store.dispatch('statistics/all_calls/fetch')
  }

  private onFilterChange () {
    this.$store.commit('statistics/all_calls/filter/offset', 0)
    this.fetchStatistic()
  }

  /**
   *
   * @param id Идентификатор истории
   * @private
   */
  private playAudioRecord (item) {
    this.$root.$emit('audio-player-show', {
      src: `${process.env.VUE_APP_API}/contacts/history/audio/${item.audio_record_id}`,
      author: `${item.owner.name} / ${item.contact.name}`
    })
  }
}
</script>

<style lang="scss">

.all-calls-page {
  height: calc(100vh - 130px);
}

.all-calls-page__box {
  display: flex;
  flex-wrap: nowrap;
  height: inherit;
  margin: 5px 0 5px 0;
}

.all-calls-page__filter {
  height: inherit;
  overflow-y: auto;
}


.all-calls-page__statistic {
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
