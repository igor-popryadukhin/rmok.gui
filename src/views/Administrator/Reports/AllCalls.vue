<template>
  <v-container class="pa-0 pt-5" fluid>
    <v-row>
      <v-col class="pt-0 pb-0">
        <div class="d-flex">
          <v-spacer/>
          <v-btn-toggle
            v-model="filter.date"
            group
            dense
          >
            <v-btn value="today">
              {{ $tc('Today') }}
            </v-btn>

            <v-btn value="yesterday">
              {{ $tc('Yesterday') }}
            </v-btn>

            <v-btn value="this_week">
              {{ $tc('This week') }}
            </v-btn>

            <v-btn value="last_week">
              {{ $tc('Last week') }}
            </v-btn>

            <v-btn value="month">
              {{
                $tc('January | February | March | April | May | June | July | August | September | October | December', new Date().getMonth())
              }}
            </v-btn>

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
                  :class="/^\d+,\d+/s.test($routerQuery.getQuery('date')) ? 'v-btn--active' : ''"
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
          </v-btn-toggle>
        </div>
      </v-col>
    </v-row>

    <!-- Date range -->
    <v-row>
      <v-col>
        <v-card
          outlined
          tile
          flat
        >
          <v-card-text class="d-flex flex-wrap justify-start">
            <s-users
              ref="sUsersAutocomplete"
              v-model="filter.user"
              :label="$tc('Users')"
              :params="{ role_use: 'for_calls' }"
              class="mr-xs-3 mr-sm-3 mr-md-3 mr-lg-3"
              outlined
              dense
              clearable
            />
            <v-combobox
              v-model="filter.status.selected"
              :items="filter.status.items"
              :label="$tc('Фильтр по результату')"
              item-text="status_result"
              item-value="status_id"
              class="mr-xs-3 mr-md-3 mr-lg-3"
              cache-items
              return-object
              clearable
              dense
              outlined
              v-on="filter.status.on"
            >
            </v-combobox>
            <v-menu
              ref="menuContactDateCreated"
              v-model="menuContactDateCreated"
              :close-on-content-click="false"
              :return-value.sync="contactDateCreated"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="contactDateCreated"
                  :label="$tc('Date the contact was created')"
                  prepend-inner-icon="mdi-calendar"
                  v-bind="attrs"
                  v-on="on"
                  readonly
                  outlined
                  dense
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="contactDateCreated"
                scrollable
                no-title
                locale="ru"
              >
                <v-spacer></v-spacer>
                <v-btn
                  text
                  color="red"
                  @click="onSaveContactDateCreatedClick(null)"
                >
                  {{ $tc('Clear') }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="menuContactDateCreated = false"
                >
                  {{ $tc('Cancel') }}
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="onSaveContactDateCreatedClick(contactDateCreated)"
                >
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="d-flex">
        <v-pagination
          v-model="dataTableHistory.page"
          :length="dataTableHistory.pages"
          total-visible="5"
          class="mr-5"
        ></v-pagination>
        <div class="align-self-center">
          {{ dataTableHistory.pageStart }}-{{ dataTableHistory.pageStop }} из {{ dataTableHistory.totalCount }}
        </div>
        <v-spacer/>
        <v-btn-toggle background-color="green">
          <v-btn
            outlined
            tile
            color="white"
          >
            <v-icon color="white">mdi-cog</v-icon>
          </v-btn>
          <v-btn
            outlined
            color="white"
          >
            Выгрузить в Excel
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- История -->
        <v-data-table
          :headers="dataTableHistory.headers"
          :items="dataTableHistory.items"
          :server-items-length="dataTableHistory.totalCount"
          :page.sync="dataTableHistory.page"
          :items-per-page="dataTableHistory.itemsPerPage"
          item-key="id"
          :options.sync="dataTableHistory.options"
          :loading="historyProcessLoading"
          locale="ru"
          :no-data-text="$tc('No data for the selected period')"
          :height="dataTableHistoryHeight"
          @pagination="onPaginationChange"
          dense
          fixed-header
          hide-default-footer
        >
          <!-- slots item -->
          <template slot="item.created_at" slot-scope="{ item }">
            {{ $moment.unix(item.created_at).format('DD.MM.YYYY HH:mm')  }}
          </template>
          <template slot="item.contact" slot-scope="{ item }">
            <template v-if="item.contact">
              {{ item.contact.first_name }} {{ item.contact.last_name }}
            </template>
            <template v-else>
              —
            </template>
          </template>
          <template slot="item.status" slot-scope="{ item }">
            <span class="label" :style="{'background-color': item.status_color}">
              {{ item.status_result }}
            </span>
          </template>
          <template slot="item.comment" slot-scope="{ item }">
            <v-tooltip color="primary" max-width="300" bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  {{ item.comment || '-' }}
                </div>
              </template>
              <span>{{ item.comment || '-' }}</span>
            </v-tooltip>
          </template>
          <template slot="item.call_duration" slot-scope="{ item }">
            {{ secondsToHmsDigital(item.call_duration) }}
          </template>
          <template slot="item.session_duration" slot-scope="{ item }">
            {{ secondsToHmsDigital(item.session_duration) }}
          </template>
          <template slot="item.owner" slot-scope="{ item }">
            {{ item.owner.first_name }} {{ item.owner.last_name }}
          </template>
          <template slot="item.record" slot-scope="{ item }">
            <v-btn
              v-if="!item.isPlaying"
              :disabled="item.audio_recording_id === null"
              icon
              small
              @click="onHistoryItemRecordPlay(item)"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
            <v-progress-circular
              v-else
              :value="item.playingProgress || 0"
              width="2"
              size="28"
              color="blue-grey"
            >
              <v-btn
                :value="item"
                color="red"
                icon
                small
                @click="() => { stopSound(); dataTableHistory.items.forEach((e => (e.isPlaying = false))) }"
              >
                <v-icon>mdi-stop</v-icon>
              </v-btn>
            </v-progress-circular>
          </template>
          <!-- slots item -->

          <template slot="loading">
            <div class="d-flex align-center justify-center">
              <span>
                {{ $tc('Loading content...') }}
              </span>
            </div>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import ContactHistory from '@/api/ContactHistory'
import Reports from '@/api/Reports'
import { UserInterface } from '@/api/Users'
import audioPlayer from '@/mixins/audioPlayer'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import { secondsToHmsDigital } from '@/utils/datetime'
import VInterface from '@/VInterface'
import { format } from 'date-fns'
import Vue, { VueConstructor } from 'vue'

import VueApexCharts from 'vue-apexcharts'
import { debounce } from 'vuetify/src/util/helpers'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({
  components: { SUsers },
  mixins: [audioPlayer],

  data () {
    return {
      filterDate: undefined,
      menuDateRange: null,
      dateRange: null as string[] | null,
      menuContactDateCreated: null as boolean | null,
      contactDateCreated: null,

      page: 1,
      pageCount: 0,
      itemsPerPage: 10,

      options: {
        labels: []
      },

      processPieLoading: false, // Процесс загрузки изображений

      // Report
      total_calls: 0,
      total_clients: 0,
      history_count: 0,
      historyProcessLoading: false,
      pieLabels: [] as string[],
      pieSeries: [] as number[],
      pieColors: [] as string[],

      usersSelected: null as UserInterface | null,
      users: [] as UserInterface[],

      filter: {
        date: null as unknown & string | null, // Дата или диапазон дат
        user: [] as unknown & UserInterface[],
        status: {
          selected: null,
          items: [],
          on: {
            input: (scope: any) => {
              if (this.assertObjectHasAttribute(scope, 'status_id')) {
                this.$routerQuery.setQuery({ status_id: scope.status_id })
                this.fetchDataHistory()
              } else {
                this.$routerQuery.removeQuery(['status_id'])
                  .finally(() => {
                    this.fetchDataHistory()
                  })
              }
            }
          }
        }
      },

      // Data table
      dataTableHistory: {
        page: 1,
        pages: 1,
        totalCount: 0,
        itemsPerPage: 100,
        pageStart: 0,
        pageStop: 0,
        items: [],
        headers: [
          {
            text: 'Дата и время',
            align: 'start',
            sortable: true,
            value: 'created_at'
          },
          {
            text: 'Клиент',
            sortable: true,
            value: 'contact'
          },
          {
            text: 'Результат',
            sortable: true,
            value: 'status'
          },
          {
            text: 'Комментарий',
            align: 'start',
            sortable: true,
            value: 'comment'
          },
          {
            text: 'Длительность разговора',
            align: 'end',
            sortable: false,
            value: 'call_duration'
          },
          {
            text: 'Общее время сессии',
            align: 'end',
            sortable: false,
            value: 'session_duration'
          },
          {
            text: 'Менеджер',
            sortable: false,
            value: 'owner'
          },
          {
            text: 'Запись',
            align: 'end',
            sortable: false,
            value: 'record'
          }
        ],
        options: {}
      },
      loading: true
    }
  },

  watch: {

    'dataTableHistory.options': {
      handler ({ sortBy, sortDesc }) {
        if (Array.isArray(sortBy)) {
          if (sortBy.length > 0) {
            this.$routerQuery.setQuery({
              history_sort_by: sortBy.join(','),
              history_sort_direction: sortDesc[0] ? 'asc' : 'desc'
            }).then(() => (this.fetchDataHistory()))
          } else {
            // Если сортировка не нужна, удаляем параметры и з адресной строки браузера
            this.$routerQuery
              .removeQuery(['history_sort_by', 'history_sort_direction'])
              .then(() => (this.fetchDataHistory()))
          }
        }
      },
      deep: true
    },

    'dataTableHistory.page': {
      handler (page: number) {
        this.$routerQuery.setQuery({ history_page: page })
      }
    }
  },

  computed: {
    apexchartOptions (): any {
      return {
        legend: {
          show: true,
          position: 'right'
        },
        labels: this.pieLabels,
        colors: this.pieColors
      }
    },

    dataTableHistoryHeight () {
      if (this.$screenHeight < 900) {
        return 500
      }
      return this.$screenHeight - 400
    }
  },

  created () {
    this.dataTableHistory.page = +this.$routerQuery.getQuery('history_page', 1)
  },

  mounted () {
    // поместите любое обещание, для того что бы подождать, прежде чем начнётся загрузка данных для графика
    const promises: Promise<any>[] = []

    if (this.$routerQuery.hasQuery('date')) {
      this.filter.date = this.$routerQuery.getQuery('date')

      if (/^\d+,\d+/s.test(String(this.filterDate))) {
        const dateRangeStr = String(this.filterDate)
        const dates = dateRangeStr.split(',', 2)
        this.dateRange = [
          format(new Date(+dates[0] * 1000), 'yyyy-MM-dd'),
          format(new Date(+dates[1] * 1000), 'yyyy-MM-dd')
        ]
      }
    }

    if (this.$routerQuery.hasQuery('owner_id')) {
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('owner_id')))
    }

    if (this.$routerQuery.hasQuery('status_id')) {
      this.$routerQuery.getQuery('status_id')
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаю данные после инициализации фильтров
    Promise.all(promises)
      .finally(() => {
        this.fetchDataHistory() // Сначала загружаем данные для диаграммы
        this.initializeWatchForFilters() // Потом начинаем следить за изменением фильтров
      })
  },

  methods: {

    // Загрузить историю
    fetchDataHistory () {
      this.historyProcessLoading = true
      const offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage

      const params: any = {
        offset,
        count: this.dataTableHistory.itemsPerPage,
        type: 'all' // Показать всю историю
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'date')) {
        params.date = this.$route.query.date
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'owner_id')) {
        params.owner_id = this.$route.query.owner_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'status_id')) {
        params.status_id = this.$route.query.status_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'contact_created_at')) {
        params.contact_created_at = this.$route.query.contact_created_at
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'history_sort_by')) {
        params.history_sort_by = this.$route.query.history_sort_by
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'history_sort_direction')) {
        params.history_sort_direction = this.$route.query.history_sort_direction
      }

      new Reports()
        .history<any, any>(params)
        .then((response) => {
          this.dataTableHistory.totalCount = response.meta.count || 0
          this.dataTableHistory.pages = Math.ceil(response.meta.count / this.dataTableHistory.itemsPerPage)
          this.dataTableHistory.items = response.data?.map((e: any) => {
            e.isPlaying = false
            return e
          }) || []

          this.filter.status.items = response.meta.statuses

          // Устанавливаю ранее сохранённый фильтр
          if (this.$routerQuery.hasQuery('status_id')) {
            const index = this.filter.status.items.findIndex((e: any) => e.status_id === +this.$route.query.status_id)
            if (index > -1) {
              this.filter.status.selected = this.filter.status.items[index]
            }
          }
        }).finally(() => (this.historyProcessLoading = false))
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

      this.$routerQuery
        .setQuery({ date: dr })
        .then(() => {
          this.fetchDataHistory()
        })
    },

    /**
     * Происходит когда выбрали дату создания контакта и нажали кнопку сохранить
     * @param dateStr
     */
    onSaveContactDateCreatedClick (dateStr: string | null) {
      if (!dateStr) {
        this.$routerQuery
          .removeQuery(['contact_created_at'])
          .finally(() => {
            this.fetchDataHistory()
          })
        this.$refs.menuContactDateCreated.save(null)
        return
      }

      this.$refs.menuContactDateCreated.save(dateStr)
      this.$routerQuery
        .setQuery({ contact_created_at: new Date(dateStr).getTime() / 1000 })
        .finally(() => {
          this.fetchDataHistory()
        })
    },

    onHistoryItemRecordPlay (item: any) {
      this.stopSound()
      this.dataTableHistory.items.forEach((e: any) => (e.isPlaying = false))
      item.isPlaying = true
      item.playingProgress = 0

      if (item.audioUrl) {
        this.playSound(item.audioUrl, false, {
          onEnded: () => {
            this.dataTableHistory.items.forEach((e: any) => (e.isPlaying = false))
          },
          onProgressUpdate: (progress: number) => {
            item.playingProgress = progress
            this.$forceUpdate()
          }
        })
      } else {
        new ContactHistory()
          .getAudioFile(item.id)
          .then((response: any) => {
            item.audioUrl = response.url
            this.playSound(response.url, false, {
              onEnded: () => {
                this.dataTableHistory.items.forEach((e: any) => (e.isPlaying = false))
              },
              onProgressUpdate: (progress: number) => {
                item.playingProgress = progress
                this.$forceUpdate()
              }
            })
          }).catch((e) => {
            this.$toast.error(e.statusText || e.error_message || e || 'undefined')
            item.isPlaying = false
          })
      }
    },

    onPaginationChange (data: any) {
      this.dataTableHistory.pageStart = data.pageStart + 1
      this.dataTableHistory.pageStop = data.pageStop
    },

    secondsToHmsDigital (d: number) {
      return secondsToHmsDigital(d)
    },

    /**
     * Инициализировать слежение за изменением фильтров
     */
    initializeWatchForFilters () {
      const debounceDelay = 500 // Задержка выполнения загрузки данных (избавит от дребезга)

      // Фильтрация по пользователям
      this.$watch('filter.user', debounce((newVal: unknown & UserInterface) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            owner_id: newVal.id
          }).then(() => {
            this.fetchDataHistory()
          })
        } else {
          this.$routerQuery
            .removeQuery(['owner_id'])
            .then(() => {
              this.fetchDataHistory()
            })
        }
      }, debounceDelay))

      // Фильтрация по датам
      this.$watch('filter.date', debounce((newVal: unknown & string) => {
        switch (newVal) {
          case 'today': {
            this.$routerQuery.setQuery({ date: 'today' }).then(this.fetchDataHistory)
            break
          }
          case 'yesterday': {
            this.$routerQuery.setQuery({ date: 'yesterday' }).then(this.fetchDataHistory)
            break
          }
          case 'this_week': {
            this.$routerQuery.setQuery({ date: 'this_week' }).then(this.fetchDataHistory)
            break
          }
          case 'last_week': {
            this.$routerQuery.setQuery({ date: 'last_week' }).then(this.fetchDataHistory)
            break
          }
          case 'month': {
            this.$routerQuery.setQuery({ date: 'month' }).then(this.fetchDataHistory)
            break
          }
        }
      }, debounceDelay))
    }
  }
})
</script>

<style lang="scss">
  table > tbody > tr > td:nth-child(4) {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 200px;
  }

  table > tbody > tr > td:nth-child(5) {
    width: auto;
  }
</style>
