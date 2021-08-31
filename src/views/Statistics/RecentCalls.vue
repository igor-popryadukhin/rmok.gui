<template>
  <v-card
    flat
    tile
  >
    <!-- Даты -->
    <v-row>
      <v-col>
        <div class="d-flex">
          <app-btn-toggle-date
            v-model="filterPeriod"
            :items="dateRangeCollection"
          >
            <template #item-append>
              <v-divider
                class="mx-2"
                vertical
              />
              <v-menu
                ref="customPeriodMenu"
                v-model="customPeriodMenu"
                :close-on-content-click="false"
                :return-value="filterCustomPeriod"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template #activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    :class="Array.isArray(filterCustomPeriod) ? 'v-btn--active' : ''"
                    text
                    tile
                    v-on="on"
                  >
                    {{ filterCustomPeriodTitle }}
                  </v-btn>
                </template>
                <v-date-picker
                  v-model="filterCustomPeriod"
                  :locale="$vuetify.lang.current"
                  :first-day-of-week="1"
                  no-title
                  range
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="customPeriodMenu = false"
                  >
                    {{ $tc('Cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.customPeriodMenu.save(filterCustomPeriod)"
                  >
                    {{ $tc('Ok') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
          </app-btn-toggle-date>
          <v-spacer />
          <v-btn
            :disabled="processFetchPie || processFetchHistory"
            text
            tile
            @click="onBtnRefreshClick"
          >
            {{ $tc('Refresh') }}
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Основные фильтры -->
    <v-row>
      <!-- Фильтр по пользователям -->
      <v-col class="py-0">
        <div class="d-flex justify-start flex-wrap margin-right">
          <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])">
            <app-user-autocomplete
              v-model="filterOwnerId"
              :label="$tc('Users')"
              :disabled="processLoading"
            />
          </template>
          <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC'])">
            <app-user-group-autocomplete
              v-model="filterUserGroupId"
              :label="$tc('Group')"
              :disabled="processLoading"
              outlined
              dense
            />
          </template>
          <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC'])">
            <app-project-autocomplete
              v-model="filterProjectId"
              :label="$tc('Project')"
              :disabled="processLoading"
              outlined
              dense
            />
          </template>
          <app-status-autocomplete
            v-model="filterStatusIds"
            multiple
            :disabled="processLoading"
            :params="appStatusAutocompleteParams"
            :label="$tc('Filter by result')"
          />
          <app-menu-date-picker
            v-model="filterContactCreatedAt"
            :first-day-of-week="1"
            :label="$tc('Date the contact was created')"
            :disabled="processLoading"
            locale="ru"
            range
          />
          <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC'])">
            <app-contact-tag-autocomplete
              v-model="filterContactTagIds"
              :label="$tc('Tags')"
              :disabled="processLoading"
              multiple
              outlined
              dense
            />
          </template>
        </div>
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
          style="min-height: 473px"
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
          :disabled="processLoading"
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
    <!-- Actions -->

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
                  <th
                    class="text-left"
                    style="width: 10px!important; white-space: nowrap!important;"
                  >
                    {{ $tc('Date/Time') }}
                  </th>
                  <th
                    class="text-left"
                    style="width: auto;"
                  >
                    {{ $tc('Client') }}
                  </th>
                  <th
                    class="text-left"
                    style="width: 100px;"
                  >
                    {{ $tc('Result') }}
                  </th>
                  <th
                    class="text-left"
                  >
                    {{ $tc('Comment') }}
                  </th>
                  <th
                    class="text-left"
                    style="width: 100px;"
                  >
                    {{ $tc('Call duration') }}
                  </th>
                  <th
                    class="text-left"
                    style="width: 100px;"
                  >
                    {{ $tc('Session duration') }}
                  </th>
                  <th class="text-left">
                    {{ $tc('Manager') }}
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="item in statisticHistory"
                  :key="item.name"
                >
                  <td style="white-space: nowrap">
                    {{ $dayjs(item.created_at * 1000).format('YYYY.MM.DD HH:mm') }}
                  </td>
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
                  <td style="width: 150px">
                    <template v-if="item.comment">
                      <v-tooltip
                        max-width="400"
                        open-delay="500"
                        bottom
                      >
                        <template #activator="{ on, attrs }">
                          <div
                            v-bind="attrs"
                            class="box-text"
                            style="width: 150px"
                            v-on="on"
                          >
                            {{ item.comment }}
                          </div>
                        </template>
                        <span>{{ item.comment }}</span>
                      </v-tooltip>
                    </template>
                  </td>
                  <td>{{ item.call_duration || '--:--:--' }}</td>
                  <td>{{ item.session_duration || '--:--:--' }}</td>
                  <td>
                    <template v-if="item.owner">
                      {{ item.owner.first_name }} {{ item.owner.last_name }} {{ item.owner.middle_name }}
                    </template>
                  </td>
                  <td>
                    <v-btn
                      :loading="processFetchAudioFile.includes(item.id)"
                      :disabled="!processFetchAudioFile.includes(item.id) && processFetchAudioFile.length > 0"
                      icon
                      small
                      @click="onBtnAudioRecordPlayClick(item)"
                    >
                      <v-icon>mdi-play</v-icon>
                    </v-btn>
                  </td>
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
import Vue, { VueConstructor } from 'vue'
import VueApexCharts from 'vue-apexcharts'
import VInterface from '@/VInterface'
import { mapActions, mapGetters } from 'vuex'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import { debounce } from 'vuetify/src/util/helpers'
import AppStatusAutocomplete from '@/components/AppStatusAutocomplete/AppStatusAutocomplete.vue'
import AppContactTagAutocomplete from '@/components/AppContactTagAutocomplete/AppContactTagAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import ContactHistory from '@/api/ContactHistory'

Vue.use(VueApexCharts)
Vue.component('Apexchart', VueApexCharts)

interface Data {
  [keys: string]: any;
}

interface Methods {
  [keys: string]: any;
}

interface Computed {
  filterProjectId: number;
  [keys: string]: any;
}

interface Props {
  [keys: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({

  components: {
    AppPagination,
    AppLoading,
    AppMenuDatePicker,
    AppContactTagAutocomplete,
    AppProjectAutocomplete: () => import('@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'),
    AppUserGroupAutocomplete: () => import('@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'),
    AppStatusAutocomplete,
    AppBtnToggleDate,
    AppUserAutocomplete: () => import('@/components/AppUserAutocomplete/AppUserAutocomplete.vue'),
    AppCountUp
  },

  data () {
    return {
      customPeriodMenu: false,
      processFetchAudioFile: [],
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
        if (!Array.isArray(this.$store.getters['statistic_recent_call/filter/period'])) {
          return this.$store.getters['statistic_recent_call/filter/period']
        }
        return true
      },

      set (value: string) {
        this.$store.commit('statistic_recent_call/filter/period', value)
      }
    },

    filterCustomPeriod: {
      get () {
        if (Array.isArray(this.$store.getters['statistic_recent_call/filter/period'])) {
          return this.$store.getters['statistic_recent_call/filter/period']
        }

        return ''
      },

      set (value: string[]) {
        this.$store.commit('statistic_recent_call/filter/period', value)
      }
    },

    filterProjectId: {
      get () {
        return +this.$store.getters['statistic_recent_call/filter/project_id']
      },

      set (value: number) {
        this.filterStatusIds = []
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

    processLoading () {
      return this.processFetchPie || this.processFetchHistory
    },

    paramsFilters () {
      const params: Record<string, any> = {}

      if (this.filterPeriod) {
        const daysJsStart = this.$dayjs().set('h', 0).set('m', 0).set('s', 0)
        const daysJsEnd = this.$dayjs().set('h', 23).set('m', 59).set('s', 59)

        switch (this.filterPeriod) {
          case 'today': {
            // За сегодня
            params.period = `${daysJsStart.unix()},${daysJsEnd.unix()}`
            break
          }
          case 'yesterday': {
            // За вчера
            params.period = `${daysJsStart.subtract(1, 'day').unix()},${daysJsEnd.subtract(1, 'day').unix()}`
            break
          }
          case 'this_week': {
            // С неделю
            params.period = `${daysJsStart.startOf('week').unix()},${daysJsEnd.endOf('week').unix()}`
            break
          }
          case 'last_week': {
            // За прошлую неделю
            params.period = `${daysJsStart.subtract(1, 'week').startOf('week').unix()},${daysJsEnd.subtract(1, 'week').endOf('week').unix()}`
            break
          }
          case 'month': {
            // За месяц
            params.period = `${daysJsStart.startOf('month').unix()},${daysJsEnd.endOf('month').unix()}`
            break
          }
          default: {
            // Если фильтр настраиваемый.
            if (Array.isArray(this.filterCustomPeriod)) {
              if (this.filterCustomPeriod.length === 2) {
                params.period = `${this.$dayjs(this.filterCustomPeriod[0], 'YYYY-MM-DD').set('h', 0).set('m', 0).set('s', 0).unix()},${this.$dayjs(this.filterCustomPeriod[1], 'YYYY-MM-DD').set('h', 23).set('m', 59).set('s', 59).unix()}`
              }
            }
          }
        }
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

      // Дата и время создания контакта
      if (Array.isArray(this.filterContactCreatedAt)) {
        let contactCreatedAtStart = this.$dayjs(this.filterContactCreatedAt[0], 'YYYY-MM-DD')
        let contactCreatedAtEnd = this.$dayjs(this.filterContactCreatedAt[1], 'YYYY-MM-DD')

        contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
        contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

        params.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
      } else if (this.filterContactCreatedAt) {
        let contactCreatedAtStart = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')
        let contactCreatedAtEnd = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')

        contactCreatedAtStart = contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
        contactCreatedAtEnd = contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

        params.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
      } else if (this.filterContactCreatedAt) {
        const contactCreatedAtStart = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')
        const contactCreatedAtEnd = this.$dayjs(this.filterContactCreatedAt, 'YYYY-MM-DD')

        contactCreatedAtStart.set('hour', 0).set('minute', 0).set('second', 0)
        contactCreatedAtEnd.set('hour', 23).set('minute', 59).set('second', 59)

        params.contact_created_at = `${contactCreatedAtStart.unix()},${contactCreatedAtEnd.unix()}`
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
              console.log('series- ' + seriesIndex + '\'s marker was clicked')
            }
          },
          position: 'right',
          show: true
        }
      }
    },

    dateRangeCollection () {
      const daysJsStart = this.$dayjs().set('h', 0).set('m', 0).set('s', 0)
      const daysJsEnd = this.$dayjs().set('h', 23).set('m', 59).set('s', 59)
      return [
        {
          title: this.$tc('Today'),
          tooltip: `За ${daysJsStart.format('DD.MM.YYYY')}`,
          value: 'today'
        },
        {
          title: this.$tc('Yesterday'),
          tooltip: `За ${daysJsStart.subtract(1, 'day').format('DD.MM.YYYY')}`,
          value: 'yesterday'
        },
        {
          title: this.$tc('This week'),
          tooltip: `c ${daysJsStart.startOf('week').format('DD.MM.YYYY')} по ${daysJsEnd.endOf('week').format('DD.MM.YYYY')}`,
          value: 'this_week'
        },
        {
          title: this.$tc('Last week'),
          tooltip: `c ${daysJsStart.subtract(1, 'week').startOf('week').format('DD.MM.YYYY')} по ${daysJsEnd.subtract(1, 'week').endOf('week').format('DD.MM.YYYY')}`,
          value: 'last_week'
        },
        {
          title: this.$t('per_month', { name: this.$dayjs().format('MMMM') }).toString(),
          tooltip: `c ${daysJsStart.startOf('month').format('DD.MM.YYYY')} по ${daysJsEnd.endOf('month').format('DD.MM.YYYY')}`,
          value: 'month'
        }
      ]
    },

    filterCustomPeriodTitle () {
      if (Array.isArray(this.filterCustomPeriod)) {
        if (this.filterCustomPeriod.length === 2) {
          return `${this.$dayjs(this.filterCustomPeriod[0], 'YYYY-MM-DD').format('DD.MM.YYYY')} — ${this.$dayjs(this.filterCustomPeriod[1], 'YYYY-MM-DD').format('DD.MM.YYYY')}`
        }
      }
      return this.$tc('Customizable')
    },

    /**
     * Параметры загрузки результатов (статусов)
     */
    appStatusAutocompleteParams () {
      const params: Record<string, number | unknown> = {}

      if (this.$isGranted(['ROLE_ADMIN', 'ROLE_RCC']) && Number(this.filterProjectId) > 0) {
        params.project_id = this.filterProjectId
      }

      return params
    }
  },

  created () {
    // Функция противодействия
    this.fetchTotalCalls = debounce(this.fetchTotalCalls, 1000)
    this.fetchPie = debounce(this.fetchPie, 1000)
    this.fetchHistory = debounce(this.fetchHistory, 1000)
  },

  mounted () {
    if (!this.filterPeriod) {
      this.filterPeriod = 'today'
    }

    if (this.statisticPieSeries.length === 0) {
      this.fetchTotalCalls()
      this.fetchPie()
      this.fetchHistory()
    }

    this.$watch('paramsFilters', () => {
      this.fetchTotalCalls()
      this.fetchPie()

      if (Number(this.offset) > 0) {
        this.offset = 0 // Это позволит сбросить смещение и загрузит историю, фактически будет вызвана функция this.fetchHistory()
      } else {
        this.fetchHistory()
      }
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
      try {
        await this.statisticPieFetch(this.paramsFilters)
      } finally {
        this.processFetchPie = false
      }
    },

    /**
     * Загрузит исторические данные
     */
    async fetchHistory () {
      // TODO: Объединить с параметрами пагинации
      this.processFetchHistory = true
      try {
        await this.statisticHistoryFetch(Object.assign({}, this.paramsFilters, { offset: this.offset }))
      } finally {
        this.processFetchHistory = false
      }
    },

    onAppPaginationChange () {
      this.fetchHistory()
    },

    onBtnRefreshClick () {
      this.fetchTotalCalls()
      this.fetchPie()
      this.fetchHistory()
    },

    onBtnAudioRecordPlayClick (item: any) {
      this.processFetchAudioFile.push(item.id)
      new ContactHistory()
        .getAudioFile(item.id)
        .then((url: string) => {
          this.$root.$emit('on-audio-player-show', {
            src: url,
            author: `${item.owner.first_name} ${item.owner.last_name} ${item.owner.middle_name}`
          })
        }).finally(() => {
          this.processFetchAudioFile = []
        })
    }
  }
})
</script>

<style lang="scss">
.margin-right > *:not(:nth-child(0)) {
  margin-right: 10px;
}

.simple-table th:first-child {
  border-right: 3px solid #3b71d5;
  background: #e8edff!important;
  color: #669;
}
.simple-table td:first-child {
  border-right: 3px solid #3b71d5;
  background: #e8edff;
  color: #669;
}

</style>
