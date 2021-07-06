<template>
  <v-card
    flat
    tile
  >
    <!-- Даты -->
    <v-row>
      <v-col>
        <div class="d-flex justify-end">
          <app-btn-toggle-date
            v-model="filter.date_period"
            :items="dateRangeCollection"
          >
            <template v-slot:item-append>
              <v-menu
                ref="menuDateRange"
                v-model="menuDateRange"
                :close-on-content-click="false"
                :return-value.sync="dateRange"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    v-on="on"
                  >
                    {{ $tc('Range') }}
                  </v-btn>
                </template>
                <v-date-picker
                  v-model="dateRange"
                  :first-day-of-week="1"
                  scrollable
                  range
                  no-title
                  locale="ru"
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menuDateRange = false"
                  >
                    {{ $tc('Cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="onSaveDateRangeClick(dateRange)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </template>
          </app-btn-toggle-date>
        </div>
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
        <s-users
          ref="sUsersAutocomplete"
          v-model="filter.user"
          :label="$tc('Users')"
          :params="{ role_use: 'for_calls' }"
          outlined
          dense
          clearable
        />
      </v-col>
      <!-- Фильтр по действиям -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <v-autocomplete
          v-model="filter.actions"
          :items="log_actions"
          item-value="type"
          item-text="title"
          outlined
          dense
          clearable
          :label="$tc('Действия')"
        ></v-autocomplete>
      </v-col>
      <!-- Фильтр дата создания лога -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-date-picker-input
          v-model="filter.log_created_at"
          :label="$tc('Дата записи лога')"
          return-date-type="unix"
          date-range
        />
      </v-col>
      <!-- Фильтр дата создания лога -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <v-select
          v-model="filter.http_method.selected"
          :items="filter.http_method.options"
          :label="$tc('Метод HTTP запроса')"
          clearable
          outlined
          dense
        >
          <template v-slot:selection="{ item }">
            {{ $tc(item) }}
          </template>
          <template v-slot:item="{ item }">
            {{ $tc(item) }}
          </template>
        </v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex">
      <v-spacer/>
        <!-- Paginator -->
        <app-pagination
          v-model="page"
          :length="dataTableLogs.pages"
        >
          <template v-slot:display>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  tile
                  text
                  small
                >
                  {{ dataTableLogs.pageStart }}-{{ dataTableLogs.pageStop }} из {{ dataTableLogs.totalCount }}
                </v-btn>
              </template>
              <v-list
                class="py-0"
                dense
                flat
              >
                <v-list-item
                  link
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые новые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые старые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </app-pagination>
        <!-- Paginator -->
      </v-col>
    </v-row>
    <!-- Split Screen -->

      <v-row no-gutters>
        <v-col cols="7">
          <v-list dense style="max-height: calc(100vh - 100px)" class="overflow-y-auto">
            <v-list-item-group
              v-model="dataTableLogs.firstItemsSelected"
              color="primary"
              mandatory
            >
            <template v-for="item in dataTableLogs.items">
              <v-list-item
                :key="`v-list-item-` + item.id"
                :value="item.id"
                link
                @click="fetchLogById(item.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.action }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.user">
                    {{ item.user.last_name }} {{ item.user.first_name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>
                  {{ $moment(item.start_action_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title>
                  {{ item.user_agent }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title class="text-right">
                    {{ item.ip }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider :key="`v-divider-` + item.id"/>
            </template>
            </v-list-item-group>
          </v-list>
        </v-col>
        <v-col cols="5">
          <!-- Detail view -->
          <v-list style="max-height: calc(100vh - 100px)" class="overflow-y-auto">
            <template v-if="log">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Действие:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right">
                    {{ log.action }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Время:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right">
                    {{ $moment(log.start_action_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Пользователь:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right" v-if="log.user">
                    {{ log.user.last_name }} {{ log.user.first_name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('IP адрес:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right">
                    {{ log.ip }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Браузер пользователя:') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-wrap">
                    {{ log.user_agent }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Метод HTTP запроса:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right">
                    <v-chip
                      color="red"
                      :class="setColorMethod(log.http_method)"
                      text-color="white"
                    >
                      {{ log.http_method }}
                    </v-chip>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('URL:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right">
                      {{ log.url }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              <template v-if="log.query_string">
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Строка запроса (query string):') }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-wrap">
                    {{ log.query_string }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
              </template>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Контроллер:') }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-subtitle class="text-right text-wrap">
                    {{ log.controller }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <template v-if="!Array.isArray(log.request)">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $tc('Запрос:') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-wrap">
                      <pre>{{ log.request }}</pre>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider/>
              </template>
              <template v-if="!Array.isArray(log.context)">
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ $tc('Ответ:') }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-subtitle class="text-wrap">
                      <pre>{{ log.context }}</pre>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-divider/>
              </template>
            </template>
          </v-list>
        </v-col>
      </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import VInterface from '@/VInterface'
import dateRangeCollection from '@/mixins/dateRangeCollection'
import { UserInterface } from '@/api/Users'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Logs, { LogInterface } from '@/api/Logs'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import VDTPaginationEvent from '@/interface/VDTPaginationEvent'
import AppDatePickerInput from '@/components/AppDatePickerInput/AppDatePickerInput.vue'
import { format } from 'date-fns'

export default (Vue as VueConstructor<VInterface>).extend({
  components: {
    SUsers,
    AppBtnToggleDate,
    AppPagination,
    AppDatePickerInput
  },

  mixins: [dateRangeCollection],

  data () {
    return {
      dateRange: null as string[] | null,
      dataTableLogs: {
        items: [] as LogInterface[],
        itemsPerPage: 30,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        totalCount: 0,
        firstItemsSelected: null
      },
      log: [] as LogInterface[],
      filter: {
        user: [] as unknown & UserInterface[],
        actions: [] as unknown[] & { title: string, type: string }[],
        log_created_at: [] as string[] | number[],
        http_method: {
          options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          selected: null as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | null
        }
      },
      log_actions: [] as unknown[] & { title: string, type: string }[],
      menuDateRange: null,
      selectedItem: 0
    }
  },

  methods: {
    /** Получем логи **/
    fetchLogs () {
      this.dataTableLogs.processLoading = true
      let offset = (this.dataTableLogs.itemsPerPage * this.page) - this.dataTableLogs.itemsPerPage

      if (offset < 0) {
        offset = 0
      }

      const params: any = Object.assign({
        count: this.dataTableLogs.itemsPerPage,
        offset
      }, this.paramFilters())

      new Logs()
        .find<{ count: number }, LogInterface[]>(params)
        .then((response) => {
          this.dataTableLogs.totalCount = response?.meta?.count || 0
          this.dataTableLogs.pages = Math.ceil(response?.meta?.count / this.dataTableLogs.itemsPerPage)
          this.dataTableLogs.items = response.data
        }).finally(() => {
          this.dataTableLogs.processLoading = false
        })
    },

    /** Получем действия логов **/
    fetchActionsLogs () {
      new Logs()
        .getActionsLog<any, any>()
        .then((response) => {
          this.log_actions = response.data
        })
    },

    /** Установка цветов в зависимости от http метода **/
    setColorMethod (method: string) {
      switch (method) {
        case 'GET':
          return 'green'
        case 'POST':
          return 'blue'
        case 'DELETE':
          return 'red'
        case 'PATCH':
        case 'PUT':
          return 'orange'
        default:
          return 'grey'
      }
    },

    onPaginationChange () {
      this.dataTableLogs.pageStart = this.page
      this.dataTableLogs.pageStop = this.dataTableLogs.pages
    },

    /** Детальный Log **/
    fetchLogById (log_id: number) {
      new Logs()
        .getById(log_id)
        .then((response: LogInterface) => {
          this.log = response
        })
    },

    /**
     * Инициализировать слежение за изменением фильтров
     */
    initializeWatchForFilters () {
      // Фильтрация по создателю лога
      this.$watch('filter.user', (newVal: unknown & UserInterface) => {
        this.dataTableLogs.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            creator_id: newVal.id
          }).finally(() => {
            this.fetchLogs()
          })
        } else {
          this.$routerQuery
            .removeQuery(['creator_id'])
            .finally(() => {
              this.fetchLogs()
            })
        }
      })

      // Фильтрация по действиям
      this.$watch('filter.actions', (newVal: string[]) => {
        this.dataTableLogs.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            action: newVal
          }).finally(() => {
            this.fetchLogs()
          })
        } else {
          this.$routerQuery
            .removeQuery(['action'])
            .finally(() => {
              this.fetchLogs()
            })
        }
      })

      // Фильтр HTTP метод
      this.$watch('filter.http_method.selected', (newVal: string) => {
        this.dataTableLogs.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            http_method: newVal
          }).then(this.fetchLogs)
        } else {
          this.$routerQuery.removeQuery([
            'http_method'
          ]).then(this.fetchLogs)
        }
      })

      // Фильтрация по дате создания лога
      this.$watch('filter.log_created_at', (val: number[]) => {
        this.dataTableLogs.page = 1
        this.$routerQuery.setQuery({
          log_created_at: val.join(',')
        }).then(() => {
          this.fetchLogs()
        })
      })

      // Фильтрация по датам
      this.$watch('filter.date_period', (newVal: unknown & string) => {
        this.dataTableLogs.page = 1
        this.$routerQuery.setQuery({ date_period: newVal }).finally(this.fetchLogs)
      })
    },

    /**
     * Происходит когда выбрали временной диапазон и нажали кнопку сохранить
     * @param dateRange
     */
    onSaveDateRangeClick (dateRange: string[]) {
      this.$refs.menuDateRange.save(dateRange)
      const date1 = new Date(dateRange[0])
      const date2 = new Date(dateRange[1])

      let dr = ''
      if (date1.getTime() < date2.getTime()) {
        dr = `${date1.getTime() / 1000},${date2.getTime() / 1000}`
      } else {
        dr = `${date2.getTime() / 1000},${date1.getTime() / 1000}`
      }

      this.filter.date_period = dr
      this.$routerQuery
        .setQuery({ date_period: dr })
        .then(() => {
          this.fetchLogs()
        })
    },

    /**
     * Общие параметры запроса
     */
    paramFilters () {
      const params: any = {}

      if (this.$routerQuery.hasQuery('creator_id')) {
        params.creator_id = this.$routerQuery.getQuery('creator_id')
      }

      if (this.$routerQuery.hasQuery('action')) {
        params.action = this.$routerQuery.getQuery('action')
      }

      if (this.$routerQuery.hasQuery('http_method')) {
        params.http_method = this.$routerQuery.getQuery('http_method')
      }

      if (this.$routerQuery.hasQuery('log_created_at')) {
        params.log_created_at = this.$routerQuery.getQuery('log_created_at')
      }

      if (this.$routerQuery.hasQuery('date_period')) {
        params.date_period = this.$route.query.date_period
      }

      return params
    }
  },

  mounted () {
    const promises: Promise<any>[] = []

    if (this.$routerQuery.hasQuery('creator_id')) {
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('creator_id')))
    }

    if (this.$routerQuery.hasQuery('action')) {
      this.filter.actions = this.$routerQuery.getQuery('action')
    }

    if (this.$routerQuery.hasQuery('http_method')) {
      this.filter.http_method.selected = this.$routerQuery.getQuery('http_method')
    }

    if (this.$routerQuery.hasQuery('log_created_at')) {
      const dateRange = this.$routerQuery.getQuery('log_created_at')
      this.filter.log_created_at = dateRange
        .split(',', 2)
        .map((e: string) => +e)
        .sort((a: number, b: number) => a - b) // Сортируем на всякий случай.
    }

    if (this.$routerQuery.hasQuery('date_period')) {
      this.filter.date_period = this.$routerQuery.getQuery('date_period')

      if (/^\d+,\d+/s.test(String(this.filterDate))) {
        const dateRangeStr = String(this.filterDate)
        const dates = dateRangeStr.split(',', 2)
        this.dateRange = [
          format(new Date(+dates[0] * 1000), 'yyyy-MM-dd'),
          format(new Date(+dates[1] * 1000), 'yyyy-MM-dd')
        ]
      }
    }

    Promise.all(promises)
      .finally(() => {
        this.fetchLogs()
        this.fetchActionsLogs()
        this.initializeWatchForFilters()
      })
  },

  watch: {
    page: {
      handler () {
        this.fetchLogs()
        this.onPaginationChange()
      }
    },
    'dataTableLogs.firstItemsSelected': {
      handler () {
        this.fetchLogById(this.dataTableLogs.firstItemsSelected)
      }
    },
    'dataTableLogs.pages': {
      handler () {
        this.dataTableLogs.pageStop = this.dataTableLogs.pages
      }
    }
  },

  computed: {
    page: {
      get () {
        return +this.$route.query?.page || 1
      },
      set (value? :number) {
        this.$routerQuery.setQuery({ page: value })
      }
    }
  }
})
</script>

<style scoped>
.v-chip {
  flex: none;
}
pre {
  background-color: #25282d;
  color: wheat;
}
</style>
