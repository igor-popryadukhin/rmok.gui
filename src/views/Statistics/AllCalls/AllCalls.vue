<template>
  <div class="all-calls-page">
    <all-calls-tools class="all-calls-page__tools" />
    <app-divider :loading="itemsFetching" />
    <div class="all-calls-page__box">
      <div class="all-calls-page__filter">
        <all-calls-filters
          @click:btn:refresh="fetchStatistic"
          @filter:change="onFilterChange"
        />
      </div>
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
            :count="itemsCount"
            :per-page="50"
            @click:btn:left="fetchStatisticHistory"
            @click:btn:right="fetchStatisticHistory"
          />
        </div>
        <v-divider />
        <v-data-table
          id="v-datatable"
          item-key="id"
          selectable-key="id"
          :item-class="() => 'v-data-table-item'"
          :headers="contactsHeaders"
          :items="items"
          :server-items-length="itemsCount"
          :items-per-page="50"
          :loading="itemsFetching"
          height="calc(100vh - 170px)"
          calculate-widths
          fixed-header
          hide-default-footer
          dense
        >
          <template #progress>
            {{ '' }}
          </template>
          <template #no-data>
            <div
              class="d-flex align-center justify-center"
              style="height: calc(100vh - 202px);"
            >
              {{ $tc('No data for the selected period') }}
            </div>
          </template>
          <template #loading>
            <div
              class="d-flex align-center justify-center grey--text"
              style="height: calc(100vh - 202px);"
            >
              <app-loading />
            </div>
          </template>
          <template #[`item.contact`]="{ item }">
            <router-link :to="{ name: 'contacts_view', params: { id: item.contact.id } }">
              {{ item.contact.name }}
            </router-link>
          </template>
          <template #[`item.comment`]="{ item }">
            <app-tooltip>
              <template #activator="{ on }">
                <span v-on="on">
                  {{ item.comment.short }}
                </span>
              </template>
              <span>
                {{ item.comment.long }}
              </span>
            </app-tooltip>
          </template>
          <template #[`item.status`]="{ item }">
            <template v-if="item.status">
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
          <template #[`item.manager`]="{ item }">
            <template v-if="typeof item.manager === 'object'">
              {{ item.manager.name }}
            </template>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              icon
              x-small
              @click="playAudioRecord(item)"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </div>
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
import debounce from '@/utils/debounce'
import AllCallsFilters from './AllCallsFilters.vue'
import AllCallsTools from './AllCallsTools.vue'

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
    AppCountUp,
    AppBtnToggleDate
  }
})
export default class AllCalls extends AppBase {
  isFetchStatistic = false

  get settingsFilterWidth (): number { return this.$store.getters['statistics/all_calls/settings/filter_width'] }
  set settingsFilterWidth (val: number) { this.$store.commit('statistics/all_calls/settings/filter_width', val) }

  get itemsFetching () {
    return this.$store.getters['statistics/all_calls/items_fetching']
  }

  /**
   * Количество прозвоненных клиентов в соответствии установленными параметрами фильтров
   */
  get itemsCount (): number {
    return this.$store.getters['statistics/all_calls/items_count'] || 0
  }

  /**
   * Заголовок таблицы
   */
  get contactsHeaders () {
    return [
      {
        text: 'Date time',
        align: '',
        sortable: false,
        value: 'created_at'
      },
      {
        text: 'Customer',
        align: '',
        sortable: false,
        value: 'contact'
      },
      {
        text: 'Result',
        align: '',
        sortable: false,
        value: 'status'
      },
      {
        text: 'Comment',
        align: '',
        sortable: false,
        value: 'comment'
      },
      {
        text: 'Duration',
        align: '',
        sortable: false,
        value: 'call_duration'
      },
      {
        text: 'Manager',
        align: '',
        sortable: false,
        value: 'manager'
      },
      {
        text: '',
        align: '',
        sortable: false,
        value: 'actions'
      }
    ]
  }

  get items () {
    type K = 'created_at'
      |'manager'
      |'contact'
      |'status'
      |'comment'
      |'call_duration'
      |'audio_record_id'
    type T = number|string|object
    return (this.$store.getters['statistics/all_calls/items'] as Array<Record<K, T>>)
    .map((e) => {
      return {
        created_at: this.$dayjs(e.created_at).format('DD.MM.YYYY HH:mm'),
        contact: e.contact,
        status: e.status,
        comment: e.comment,
        manager: e.manager,
        call_duration: e.call_duration,
        audio_record_id: e.audio_record_id
      }
    })
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
    return [
      'created_at',
      'contact',
      'result',
      'comment',
      'call_duration',
      'session_duration',
      'manager'
    ].map((e) => ({
      name: this.$t(`sorting_options.${e}`),
      order_by: e,
      order_direction: 'asc'
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

  /**
   * Срабатывает при изменении параметров фильтров
   * @private
   */
  private onFilterChange () {
    this.$store.commit('statistics/all_calls/filter/offset', 0)
    this.fetchStatistic()
  }

  /**
   *
   * @private
   * @param item
   */
  private playAudioRecord (item: any) {
    this.$root.$emit('audio-player-show', {
      src: `${process.env.VUE_APP_API}/contacts/history/audio/${item.audio_record_id}`,
      author: `${item.manager.name} / ${item.contact.name}`
    })
  }
}
</script>

<style lang="scss">

#v-datatable {
  table {
    thead {
      tr {
        th:not(:first-child) {
          padding-left: 5px !important;
          padding-right: 5px !important;
        }
      }
    }
  }
}

.v-data-table-item {
  td {
    height: 25px !important;
  }

  td:not(:first-child) {
    padding-left: 5px !important;
    padding-right: 5px !important;
    height: 25px !important;
  }

  td:nth-child(1) {
    text-align: left;
    width: 1px;
    white-space: nowrap;
    font-size: 12px !important;
  }

  td:nth-child(2) {
    text-align: left;
    white-space: nowrap;
    width: 100%;
    font-size: 12px !important;
  }

  td:nth-child(3) {
    text-align: left;
    white-space: nowrap;
    font-size: 12px !important;
  }

  td:nth-child(4) {
    text-align: left;
    white-space: nowrap;
    font-size: 12px !important;
  }

  td:nth-child(5) {
    text-align: left;
    white-space: nowrap;
    font-size: 12px !important;
  }

  td:nth-child(6) {
    text-align: left;
    white-space: nowrap;
    font-size: 12px !important;
  }

  td:nth-child(7) {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }
}

.all-calls-page {
  height: calc(100vh - 74px);
  overflow-y: auto;
}

.all-calls-page__tools {}

.all-calls-page__box {
  display: flex;
  height: calc(100vh - 113px);
  margin: 0;
}

.all-calls-page__filter {
  height: calc(100vh - 113px);
  width: 255px;
  padding-right: 5px;
  overflow-y: auto;
}


.all-calls-page__statistic {
  flex-grow: 1;
  height: inherit;
  overflow: auto;
  padding: 10px;
}
</style>

<i18n>
{
  "ru": {
    "sorting_options": {
      "created_at": "По дате совершения звонка",
      "contact": "По клиенту",
      "result": "По результату",
      "comment": "По комментарию",
      "call_duration": "По длительности звонка",
      "session_duration": "По длительности сессии",
      "manager": "По менеджеру"
    }
  }
}
</i18n>
