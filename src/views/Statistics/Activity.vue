<template>
  <v-sheet
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
            :disabled="processFetchActivity"
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
          <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])">
            <app-project-autocomplete
              v-model="filterProjectId"
              :label="$tc('Project')"
              :disabled="processLoading"
              outlined
              dense
            />
          </template>
          <template v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])">
            <v-select
              v-model="actions.selected"
              :label="$tc('Actions')"
              :items="actions.items"
              :disabled="isDisabledFilterActions"
              item-value="name"
              item-text="title"
              cache-items
              clearable
              multiple
              outlined
              dense
              chips
            >
              <template #selection="{ item, attrs, select }">
                <v-chip
                  v-bind="attrs"
                  :input-value="select"
                  class="ma-1"
                  color="primary"
                  label
                  close
                  small
                  @click="select"
                  @click:close="actions.chipRemove(item)"
                >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-select>
          </template>
        </div>
      </v-col>
    </v-row>

    <!-- Diagram Zone -->
    <v-row>
      <v-col
        class="py-0 mb-10"
      >
        <v-card
          tile
          flat
          outlined
        >
          <v-card-text>
            <apexchart
              height="1000"
              type="bar"
              :options="apexchartOptions"
              :series="apexSeries"
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import { secondsToHms } from '@/utils/datetime'
import Vue from 'vue'
import VueApexCharts from 'vue-apexcharts'
import { mapActions, mapGetters } from 'vuex'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import { debounce } from 'vuetify/src/util/helpers'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

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
    AppProjectAutocomplete: () => import('@/components/AppProjectAutocomplete/AppProjectAutocomplete.vue'),
    AppUserGroupAutocomplete: () => import('@/components/AppUserGroupAutocomplete/AppUserGroupAutocomplete.vue'),
    AppBtnToggleDate,
    AppUserAutocomplete: () => import('@/components/AppUserAutocomplete/AppUserAutocomplete.vue')
  },

  data () {
    return {
      customPeriodMenu: false,
      processFetchActivity: false,
      actions: {
        /**
         * Удалить чип
         */
        chipRemove: (item: unknown & {title: string; name: string;}) => {
          if (Array.isArray(this.actions.selected) && item) {
            const index = this.actions.selected.findIndex((e: string) => e === item.name)
            if (index >= 0) this.actions.selected.splice(index, 1)
          } else {
            this.actions.selected = []
          }
        },

        items: [] as unknown & { title: string; value: string; }[],

        selected: []
      }
    }
  },

  computed: {
    ...mapGetters({
      statisticActivity: 'statistic_activity/activity'
    }),

    filterOwnerId: {
      get () {
        return +this.$store.getters['statistic_activity/filter/owner_id']
      },

      set (value: number) {
        this.$store.commit('statistic_activity/filter/owner_id', value)
      }
    },

    filterUserGroupId: {
      get () {
        return +this.$store.getters['statistic_activity/filter/user_group_id']
      },

      set (value: number) {
        this.$store.commit('statistic_activity/filter/user_group_id', value)
      }
    },

    filterPeriod: {
      get () {
        if (!Array.isArray(this.$store.getters['statistic_activity/filter/period'])) {
          return this.$store.getters['statistic_activity/filter/period']
        }
        return true
      },

      set (value: string) {
        this.$store.commit('statistic_activity/filter/period', value)
      }
    },

    filterCustomPeriod: {
      get () {
        if (Array.isArray(this.$store.getters['statistic_activity/filter/period'])) {
          return this.$store.getters['statistic_activity/filter/period']
        }

        return ''
      },

      set (value: string[]) {
        this.$store.commit('statistic_activity/filter/period', value)
      }
    },

    filterProjectId: {
      get () {
        return +this.$store.getters['statistic_activity/filter/project_id']
      },

      set (value: number) {
        this.$store.commit('statistic_activity/filter/project_id', value)
      }
    },

    processLoading () {
      return this.processFetchActivity
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

      if (Number(this.filterProjectId) > 0) {
        params.project_id = this.filterProjectId
      }

      return params
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
    },

    /**
     * Для администратора, руководителя КЦ и руководителя группы вернёт true
     */
    isTableColumnManagerVisible () {
      return this.$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])
    },

    isDisabledFilterActions () {
      return !(this.filterOwnerId.length > 0 || this.filterUserGroupId.length > 0)
    },

    /**
     * Горизонтальные бары
     */
    apexchartOptions (): any {
      const formatter = (seriesName: string) => {
        return seriesName
      }

      return {
        chart: {
          height: '100%',
          stackType: '100%',
          stacked: true,
          type: 'bar'
        },
        dataLabels: {
          dropShadow: {
            enabled: false
          },
          enabled: true,
          formatter: function (val: any, opt: any) {
            return secondsToHms(opt.w.globals.series[opt.seriesIndex][opt.dataPointIndex], {
              h: ['ч.', 'ч.', 'ч.'],
              m: ['м.', 'м.', 'м.'],
              s: ['c.', 'c.', 'c.']
            })
          },
          offsetX: 0,
          style: {
            colors: ['#fff']
          },
          textAnchor: 'start'
        },
        legend: {
          formatter,
          horizontalAlign: 'center',
          offsetX: 40,
          position: 'top'
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
          area: {
            fillTo: 'origin'
          },
          bar: {
            horizontal: true
          }
        },
        tooltip: {
          fixed: {
            enabled: false,
            offsetX: 0,
            offsetY: 0,
            position: 'topRight'
          },
          items: {
            display: 'flex'
          },
          marker: {
            show: true
          },
          onDatasetHover: {
            highlightDataSeries: false
          },
          theme: 'dark',
          x: {
            show: false
          },
          y: {
            formatter: function () {
              return ''
            },
            title: {
              formatter: (val: any, opt: any) => {
                return secondsToHms(opt.w.globals.series[opt.seriesIndex][opt.dataPointIndex], {
                  // todo: Localise
                  h: ['час', 'часа', 'часов'],
                  m: ['минута', 'минуты', 'минут'],
                  s: ['секунда', 'секунды', 'секунд']
                })
              }
            }
          }
        },
        xaxis: {
          categories: [...this.xSeries],
          labels: {
            show: false
          }
        },
        yaxis: {
          categories: [...this.xSeries],
          labels: {
            show: true
          },
          type: 'category'
        }
      }
    },

    xSeries () {
      return this.statisticActivity.map((value: any) => {
        return value.first_name + ' ' + value.last_name
      })
    },

    apexSeries () {
      const series: any[] = [] // Сюда буду складывать серии
      this.statisticActivity.forEach((value: unknown & {activity: any[]; }) => {
        value.activity.forEach((value1: unknown & {name: string; title: string; seconds: number}) => {
          const index = series.findIndex(v => v.name === value1.name)
          if (index > -1) {
            series[index].data.push(value1.seconds)
          } else {
            series.push({
              data: [value1.seconds],
              name: value1.name
            })
          }
        })
      })
      return series
    }
  },

  created () {
    this.fetchHistory = debounce(this.fetchHistory, 1000)
  },

  mounted () {
    // Период по умолчанию сегодня (с 00:00:00 по 23:59:59)
    if (!this.filterPeriod) {
      this.filterPeriod = 'today'
    }

    // Если данные ещё не загружены, загружаем.
    if (this.statisticActivity.length === 0) {
      this.fetchActivity()
    }

    // Отслеживаю состояние параметров фильтров.
    this.$watch('paramsFilters', () => {
      if (Number(this.offset) > 0) {
        this.offset = 0
      } else {
        this.fetchActivity()
      }
    })
  },

  methods: {
    ...mapActions({
      // Загрузит историю.
      statisticActivityFetch: 'statistic_activity/fetch'
    }),

    /**
     * Загрузит исторические данные
     */
    async fetchActivity () {
      this.processFetchActivity = true
      try {
        await this.statisticActivityFetch(Object.assign(
          {},
          this.paramsFilters // Параметры основных фильтров
        ))
      } finally {
        this.processFetchActivity = false
      }
    },

    onAppPaginationChange () {
      this.fetchActivity()
    },

    onBtnRefreshClick () {
      this.fetchActivity()
    }
  }
})
</script>

<style lang="scss">
.margin-right > *:not(:nth-child(0)) {
  margin-right: 10px;
}
</style>
