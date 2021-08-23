<template>
  <v-card
    flat
    tile
  >
    <!-- Даты -->
    <v-row>
      <v-col>
        <div class="d-flex justify-end" />
        <app-btn-toggle-date
          v-model="filterPeriod"
          :items="dateRangeCollection"
        />
      </v-col>
    </v-row>

    <!-- Основные фильтры -->
    <v-row>
      <!-- Фильтр по пользователям -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-user-autocomplete
          v-model="filterOwnerId"
          :label="$tc('Users')"
          :disabled="filterUserGroupId > 0"
        />
      </v-col>
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-status-autocomplete
          v-model="filterStatusIds"
          multiple
          :label="$tc('Filter by result')"
        />
      </v-col>
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-menu-date-picker
          v-model="filterContactCreatedAt"
          :first-day-of-week="1"
          :label="$tc('Date the contact was created')"
          locale="ru"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-user-group-autocomplete
          v-model="filterUserGroupId"
          :label="$tc('Group')"
          outlined
          dense
        />
      </v-col>
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-project-autocomplete
          v-model="filterProjectId"
          :label="$tc('Project')"
          outlined
          dense
        />
      </v-col>
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-contact-tag-autocomplete
          v-model="filterContactTagIds"
          :label="$tc('Tags')"
          multiple
          outlined
          dense
        />
      </v-col>
    </v-row>

    <!-- Круговая диаграмма -->
    <v-row>
      <v-col
        cols="12"
        md="4"
        lg="4"
      >
        <div
          class="d-flex flex-column fill-height"
          style="min-height: 320px"
        >
          <div class="mb-5">
            <h4 class="mb-2 font-weight-regular">
              Всего сделано звонков
            </h4>
            <div style="font-size: 2rem">
              <app-count-up
                :delay="1000"
                :end-val="statisticRecentCallTotalCalls"
              />
            </div>
          </div>
          <div class="mb-5">
            <h4 class="mb-2 font-weight-regular">
              Всего клиентов прозвонено
            </h4>
            <div style="font-size: 2rem">
              <app-count-up
                :delay="1000"
                :end-val="statisticRecentCallClientCalls"
              />
            </div>
          </div>
          <v-spacer />
          <p>
            На диаграмме представлены результаты последних звонков каждому клиенту
          </p>
        </div>
      </v-col>
      <v-col
        class="d-flex align-center justify-center"
        cols="12"
        md="8"
        lg="8"
      >
        <div
          v-if="processFetchPie"
          class="d-flex align-center justify-center"
        >
          <app-loading />
        </div>
        <div
          v-else-if="statisticPieSeries.length === 0"
          class="d-flex align-center justify-center"
        >
          <div>{{ $tc('No data for the selected period') }}</div>
        </div>
        <div
          v-else
        >
          <apexchart
            width="800"
            type="pie"
            :options="apexchartOptions"
            :series="statisticPieSeries"
          />
        </div>
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row>
      <v-col class="d-flex">
        <v-spacer />
        <app-pagination
          v-model="offset"
          :count="statisticHistoryCount"
          :per-page="50"
          class="mr-5"
          @change="onAppPaginationChange"
        />
        <v-btn-toggle color="primary">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                small
                v-on="on"
              >
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                link
              >
                <v-list-item-title>{{ $tc('Transfer contacts to another project') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            color="primary"
            outlined
            small
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            outlined
            small
          >
            Выгрузить в Excel
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <v-row>
      <v-col style="min-height: 600px">
        <app-divider />
        <template v-if="processFetchHistory">
          <div
            class="d-flex justify-center"
          >
            <div class="pa-16 grey--text">
              <app-loading />
            </div>
          </div>
        </template>
        <template v-else>
          <v-simple-table
            :height="600"
            class="simple-table"
            fixed-header
            dense
          >
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">
                    Name
                  </th>
                  <th class="text-left">
                    {{ $tc('Client') }}
                  </th>
                  <th class="text-left">
                    {{ $tc('Result') }}
                  </th>
                  <th class="text-left">
                    {{ $tc('Comment') }}
                  </th>
                  <th class="text-left">
                    {{ $tc('Manager') }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in statisticHistory"
                  :key="item.name"
                >
                  <td>{{ $dayjs(item.created_at * 1000).format('YYYY.MM-DD HH:mm') }}</td>
                  <td>
                    <router-link :to="{ name: 'contacts_view', params: { contact_id: item.contact.id } }">
                      {{ item.contact.first_name }} {{ item.contact.last_name }} {{ item.contact.middle_name }}
                    </router-link>
                  </td>
                  <td>
                    <v-chip
                      :color="item.status.color"
                      label
                      outlined
                      x-small
                    >
                      {{ item.status.name }}
                    </v-chip>
                  </td>
                  <td>{{ item.comment }}</td>
                  <td>{{ item.owner.first_name }} {{ item.owner.last_name }} {{ item.owner.middle_name }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </template>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import dateRangeCollection from '@/mixins/dateRangeCollection'
import Vue, { VueConstructor } from 'vue'
import VueApexCharts from 'vue-apexcharts'
import audioPlayer from '@/mixins/audioPlayer'
import VInterface from '@/VInterface'
import AppUserAutocomplete from '@/components/AppUserAutocomplete/AppUserAutocomplete.vue'
import { mapActions, mapGetters } from 'vuex'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import { debounce } from 'vuetify/src/util/helpers'
import { makeUnixUTCTimestampRangeString } from '@/utils/datetime'
import AppStatusAutocomplete from '@/components/AppStatusAutocomplete/AppStatusAutocomplete.vue'
import AppUserGroupAutocomplete from '@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'
import AppProjectAutocomplete from '@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'
import AppContactTagAutocomplete from '@/components/AppContactTagAutocomplete/AppContactTagAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'

Vue.use(VueApexCharts)
Vue.component('Apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({

  components: {
    AppPagination,
    AppLoading,
    AppMenuDatePicker,
    AppContactTagAutocomplete,
    AppProjectAutocomplete,
    AppUserGroupAutocomplete,
    AppStatusAutocomplete,
    AppBtnToggleDate,
    AppUserAutocomplete,
    AppCountUp
  },
  mixins: [audioPlayer, dateRangeCollection],

  data () {
    return {
      processFetchPie: false,
      processFetchHistory: false
    }
  },

  computed: {
    ...mapGetters({
      statisticRecentCallClientCalls: 'statistic_recent_call/client_calls',
      statisticRecentCallTotalCalls: 'statistic_recent_call/total_calls',
      statisticPieColors: 'statistic_recent_call/pie/colors',
      statisticPieLabels: 'statistic_recent_call/pie/labels',
      statisticPieSeries: 'statistic_recent_call/pie/series',
      statisticPieProcessLoading: 'statistic_recent_call/pie/process_loading',
      statisticHistoryCount: 'statistic_recent_call/client_calls',
      statisticHistory: 'statistic_recent_call/history'
    }),

    filterOwnerId: {
      get () {
        return +this.$store.getters['statistic_recent_call/filter/owner_id']
      },

      set (value: number) {
        this.$store.commit('statistic_recent_call/filter/owner_id', value)
      }
    },

    filterUserGroupId: {
      get () {
        return +this.$store.getters['statistic_recent_call/filter/user_group_id']
      },

      set (value: number) {
        this.$store.commit('statistic_recent_call/filter/user_group_id', value)
      }
    },

    filterStatusIds: {
      get () {
        return this.$store.getters['statistic_recent_call/filter/status_ids']
      },

      set (value: number[]) {
        this.$store.commit('statistic_recent_call/filter/status_ids', value)
      }
    },

    filterPeriod: {
      get () {
        return this.$store.getters['statistic_recent_call/filter/period']
      },

      set (value: string) {
        this.$store.commit('statistic_recent_call/filter/period', value)
      }
    },

    filterProjectId: {
      get () {
        return +this.$store.getters['statistic_recent_call/filter/project_id']
      },

      set (value: number) {
        this.$store.commit('statistic_recent_call/filter/project_id', value)
      }
    },

    filterContactTagIds: {
      get () {
        return this.$store.getters['statistic_recent_call/filter/contact_tag_ids']
      },

      set (value: number[]) {
        this.$store.commit('statistic_recent_call/filter/contact_tag_ids', value)
      }
    },

    filterContactCreatedAt: {
      get () {
        return this.$store.getters['statistic_recent_call/filter/contact_created_at']
      },

      set (value: number[]) {
        this.$store.commit('statistic_recent_call/filter/contact_created_at', value)
      }
    },

    offset: {
      get () {
        return this.$store.getters['statistic_recent_call/history_offset']
      },

      set (value: number) {
        this.$store.commit('statistic_recent_call/history_offset', value)
      }
    },

    paramsFilters () {
      const params: Record<string, any> = {}

      if (this.filterPeriod) {
        params.period = this.filterPeriod
      }

      if (Number(this.filterOwnerId) > 0) {
        params.owner_id = this.filterOwnerId
      }

      if (Number(this.filterUserGroupId) > 0) {
        params.user_group_id = this.filterUserGroupId
      }

      if (Array(this.filterStatusIds).length > 0) {
        params.status_ids = this.filterStatusIds
      }

      if (Number(this.filterProjectId) > 0) {
        params.project_id = this.filterProjectId
      }

      if (Array(this.filterContactTagIds).length > 0) {
        params.tag_ids = this.filterContactTagIds
      }

      if (/^\d\d\d\d-\d\d-\d\d/s.test(String(this.filterContactCreatedAt))) {
        params.contact_created_at = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD').utc().unix()
      }

      return params
    },

    apexchartOptions (): any {
      return {
        chart: {
          animations: {
            enabled: false // Off animations
          },
          events: {
            // Происходит при клике по легенде диаграммы
            legendClick: (chartContext: any, seriesIndex: any) => {
              const scope: unknown & { status_id: number } = this.pieData[seriesIndex]
              if (this.assertObjectHasAttribute(scope, 'status_id')) {
                const index = this.filter_statuses.findIndex((e: unknown & { id: number }) => e.id === +scope.status_id)
                if (index > -1) {
                  this.filter.status = this.filter_statuses[index]
                }
              } else {
                throw new Error('В объекте scope отсутствует свойство status_id')
              }
            }
          }
        },
        colors: this.statisticPieColors,
        labels: this.statisticPieLabels,
        legend: {
          // formatter: function (seriesName: string, opts: any) {
          //   return [opts.w.globals.series[opts.seriesIndex], ' - ', seriesName]
          // },
          markers: {
            onClick: (chart: any, seriesIndex: any, opts: any) => {
              console.log('series- ' + seriesIndex + "'s marker was clicked")
            }
          },
          position: 'right',
          show: true
        }
      }
    },

    dateRangeCollection () {
      return [
        {
          title: this.$tc('Today'),
          value: `${this.$dayjs().unix()},${this.$dayjs().unix()}`
        },
        {
          title: this.$tc('Yesterday'),
          value: `${this.$dayjs().subtract(1, 'day').unix()},${this.$dayjs().subtract(1, 'day').unix()}`
        },
        {
          title: this.$tc('This week'),
          value: `${this.$dayjs().subtract(1, 'week').unix()},${this.$dayjs().unix()}`
        },
        {
          title: this.$tc('Last week'),
          value: `${this.$dayjs().subtract(2, 'week').unix()},${this.$dayjs().subtract(1, 'week').unix()}`
        }
      ]
    }
  },

  created () {
    // Функция противодействия
    this.fetchTotalCalls = debounce(this.fetchTotalCalls, 450)
    this.fetchPie = debounce(this.fetchPie, 450)
    this.fetchHistory = debounce(this.fetchHistory, 450)
  },

  mounted () {
    if (!this.filterPeriod) {
      this.filterPeriod = makeUnixUTCTimestampRangeString()
    }

    if (this.statisticPieSeries.length === 0) {
      this.fetchTotalCalls()
      this.fetchPie()
      this.fetchHistory()
    }

    this.$watch('paramsFilters', () => {
      this.fetchTotalCalls()
      this.fetchPie()
      this.fetchHistory()
    })
  },

  methods: {
    ...mapActions({
      // Загрузит общее количество звонков
      statisticRecentCallFetchTotalCalls: 'statistic_recent_call/fetchTotalCalls',
      // Загрузит данные круговой диаграммы.
      statisticPieFetch: 'statistic_recent_call/pie/fetch',
      // Загрузит историю.
      statisticHistoryFetch: 'statistic_recent_call/fetch'
    }),

    /**
     * Загрузит общее количество звонков
     */
    async fetchTotalCalls () {
      await this.statisticRecentCallFetchTotalCalls(this.paramsFilters)
    },

    /**
     * Загрузит данные круговой диаграммы
     */
    async fetchPie () {
      this.processFetchPie = true
      await this.statisticPieFetch(this.paramsFilters)
      this.processFetchPie = false
    },

    /**
     * Загрузит исторические данные
     */
    async fetchHistory () {
      // TODO: Объединить с параметрами пагинации
      this.processFetchHistory = true
      await this.statisticHistoryFetch(Object.assign(this.paramsFilters, { offset: this.offset }))
      this.processFetchHistory = false
    },

    onAppPaginationChange () {
      this.fetchHistory()
    }
  }
})
</script>

<style lang="scss">
  .simple-table th {
    &:first-child {
      width: 150px;
    }
    &:nth-child(2) {
      width: 350px;
      white-space: nowrap;
    }
  }

</style>
