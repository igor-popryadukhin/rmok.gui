<template>
  <v-sheet min-width="850">
    <div class="d-flex align-center my-1">
      <div>
        <app-btn-toggle-date
          v-model="filterPlannedFor"
          :items="dateRangeCollection"
        >
          <template #btn="{ item }">
            {{ $tc(item.title) }}
            <template v-if="item.badge">
              <v-badge
                v-show="item.badge.visible"
                v-bind="item.badge"
                inline
              />
            </template>
          </template>

          <template #item-append>
            <v-menu
              ref="datePeriodMenu"
              v-model="datePeriodMenu"
              :close-on-content-click="false"
              :return-value="filterPlannedForPeriod"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  text
                  tile
                  v-on="on"
                >
                  {{ btnTitleCustomize }}
                </v-btn>
              </template>
              <v-date-picker
                v-model="filterPlannedForPeriod"
                :locale="$vuetify.lang.current"
                :first-day-of-week="1"
                :allowed-dates="filterPlannedForPeriodAllowedDates"
                no-title
              >
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="datePeriodMenu = false"
                >
                  {{ $tc('Cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.datePeriodMenu.save(filterPlannedForPeriod)"
                >
                  {{ $tc('Ok') }}
                </v-btn>
              </v-date-picker>
            </v-menu>
          </template>
        </app-btn-toggle-date>
      </div>

      <v-divider
        class="mx-2"
        vertical
      />
      <app-status-autocomplete
        v-model="filterStatusId"
        style="max-width: 300px;"
      />
    </div>
    <app-divider />

    <small
      class="d-block grey--text"
      style="font-size: small"
    >
      {{ tasksInfo }}
    </small>

    <v-row>
      <v-col>
        <keep-alive
          :max="5"
          exclude="/tasks"
        >
          <list-view
            :key="$route.fullPath"
            :params="paramsQuery"
            @update:task-closed="calculateTaskCount"
          />
        </keep-alive>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppStatusAutocomplete from '@/components/AppStatusAutocomplete/AppStatusAutocomplete.vue'
import Tasks from '@/api/Tasks'
import ListView from './ListView.vue'
import Vue from 'vue'
import { makeUnixUTCTimestampRangeString } from '@/utils/datetime'
import { mapGetters } from 'vuex'
import { DateRangeCollection } from '@/views/Tasks/interfaces'
import SSEMessage from '@/interfaces/SSEMessage'
import { debounce } from 'vuetify/src/util/helpers'

interface Data {
  [key: string]: any;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

interface Props {
  [key: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  components: {
    AppStatusAutocomplete,
    AppBtnToggleDate,
    ListView
  },

  data () {
    return {
      datePeriodMenu: false,
      tasksCounts: [] as any[]
    }
  },

  computed: {
    ...mapGetters({
      settingsDateTimeFormat: 'settings/date_time_format',
      tasksPendingCount: 'tasks/pending_count'
    }),

    // Период выборки данных
    filterPlannedFor: {
      get () {
        return this.$route.query?.planned_for || makeUnixUTCTimestampRangeString() // makeUnixUTCTimestampRangeString Задачи на сегодня
      },

      set (value: string) {
        if (value) {
          this.$routerQuery.setQuery({
            planned_for: value
          })
        } else {
          this.$routerQuery.removeQuery(['planned_for'])
        }
      }
    },

    // Настраиваемый период выборки данных (связан с параметром planned_for адресной строки браузера)
    filterPlannedForPeriod: {
      get () {
        const value = String(this.$route.query?.planned_for)

        if (/^(\d+),(\d+)$/s.test(value)) {
          // tslint:disable-next-line
          return this.$dayjs(Number(value.substring(0, value.indexOf(','))) * 1000).format('YYYY-MM-DD')
        }

        return null
      },

      set (value: string) {
        if (value) {
          const from = this.$dayjs(value + ' 00:00:00', 'YYYY-MM-DD hh:mm:ss').unix()
          const to = this.$dayjs(value + ' 23:59:59', 'YYYY-MM-DD hh:mm:ss').unix()
          this.$routerQuery.setQuery({
            // 2020-08-08 00:00:00 to unix
            planned_for: `${from},${to}`
          })
        } else {
          this.$routerQuery.removeQuery(['planned_for'])
        }
      }
    },

    filterStatusId: {
      get () {
        return +this.$route.query?.status_id || 0
      },

      set (value: number) {
        if (value) {
          this.$routerQuery.setQuery({
            status_id: value
          })
        } else {
          this.$routerQuery.removeQuery(['status_id'])
        }
      }
    },

    paramsQuery () {
      const params: Record<string, string | number> = {}
      if (typeof this.filterPlannedFor === 'string') {
        if (this.filterPlannedFor === 'all') {
          params.state = 'all'
        }

        params.planned_for = this.filterPlannedFor
      }

      if (this.filterStatusId) {
        params.status_id = String(this.filterStatusId)
      }

      return params
    },

    tasksInfo () {
      const value: string = (this.filterPlannedFor as string) || ''
      let date = ''

      if (/^(\d+),(\d+)$/s.test(value)) {
        // tslint:disable-next-line
        date = this.$dayjs(+value.substring(0, value.indexOf(',')) * 1000).format(this.settingsDateTimeFormat.short_date)
        return this.$t('all_tasks_per_number', { date }).toString()
      }

      return ''
    },

    btnTitleCustomize () {
      if (this.dateRangeCollection.findIndex((e: DateRangeCollection) => e.value === this.filterPlannedFor) > -1) {
        return this.$tc('Customizable')
      }

      return this.filterPlannedForPeriod
    },

    dateRangeCollection (): DateRangeCollection[] {
      return [
        {
          id: 'for_tomorrow',
          title: 'For tomorrow',
          value: makeUnixUTCTimestampRangeString('add', 1, 'day'),
          badge: this.badgeFactory('for_tomorrow')
        },
        {
          id: 'for_today',
          title: 'For today',
          value: makeUnixUTCTimestampRangeString(),
          badge: this.badgeFactory('for_today')
        },
        {
          id: 'yesterdays',
          title: 'Yesterday\'s',
          value: makeUnixUTCTimestampRangeString('subtract', 1, 'day'),
          badge: this.badgeFactory('yesterdays')
        },
        {
          id: 'the_day_before_yesterday',
          title: 'The day before yesterday',
          value: makeUnixUTCTimestampRangeString('subtract', 2, 'day'),
          badge: this.badgeFactory('the_day_before_yesterday')
        },
        {
          id: 'all',
          title: 'All',
          value: 'all',
          badge: {
            visible: this.tasksPendingCount > 0,
            color: 'red',
            dot: true
          }
        }
      ]
    }
  },

  created () {
    this.calculateTaskCount = debounce(this.calculateTaskCount, 1000)
  },

  mounted () {
    setTimeout(() => (this.calculateTaskCount()), 2000)

    this.onSSEResultCountOpenTasks = debounce(this.onSSEResultCountOpenTasks, 1000)
    this.$root.$on('sse-result-count-open-tasks', this.onSSEResultCountOpenTasks)

    this.initializeWatchForFilters()
  },

  beforeDestroy () {
    this.$root.$off('sse-result-count-open-tasks', this.onSSEResultCountOpenTasks)
  },

  methods: {

    onSSEResultCountOpenTasks (message: SSEMessage) {
      this.$data.tasksCounts = message.payload
    },

    initializeWatchForFilters () {
      this.$watch('filterStatusId', () => {
        this.calculateTaskCount()
      })
    },

    /**
     * Отправляет на сервер параметры для подсчёта количества открытых задач.
     * Сервер отвечает статусом 202.
     * SSE концентратор вернёт событие "result-count-open-tasks" и полезную нагрузку,
     * в котрой будет содержаться информация о количестве задач.
     *
     * Длинна может быть любая.
     */
    calculateTaskCount () {
      new Tasks()
        .calculateCount(this.dateRangeCollection
          .filter((e: DateRangeCollection) => e.id && e.value)
          .map((e: DateRangeCollection) => {
            const params: any = {
              planned_for: e.value
            }

            if (this.filterStatusId) {
              params.status_id = this.filterStatusId
            }

            return {
              id: e.id,
              params
            }
          })
        )
    },

    filterPlannedForPeriodAllowedDates (val: string) {
      return true // TODO: Разрешить все даты
    },

    badgeFactory (id: string) {
      const foundIndex = this.$data.tasksCounts.findIndex((e) => e.id === id)
      if (foundIndex > -1) {
        const found = this.$data.tasksCounts[foundIndex]
        return {
          content: found.count > 99 ? '99+' : found.count,
          visible: found.count > 0,
          color: 'red'
        }
      }

      return null
    }
  }
})
</script>

<style lang="scss" scoped>
.task-toolbar {
  flex: none !important;
  box-shadow: none !important;

  &-extension {
    display: flex;
    flex-flow: column;
  }

  &-extension small {
    font-size: 12px;
    color: #848484;
  }
}
</style>
