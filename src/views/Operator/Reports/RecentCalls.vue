<template>
  <v-container class="pa-0 pt-5" fluid>
    <v-row>
      <v-col class="pt-0 pb-0">
        <div class="d-flex">
          <v-spacer />
          <v-btn-toggle
            v-model="filterDate"
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
                locale="ru"
                scrollable
                range
                no-title
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
      <v-col class="pt-0">
        <v-card
          tile
          flat
        >
          <v-card-text class="">
            <v-row>
              <v-col
                class="py-0"
                md="4"
                lg="4"
                sm="12"
                xs="12"
              >
                <v-combobox
                  v-model="filter.status.selected"
                  :items="filter.status.items"
                  :label="$tc('Фильтр по результату')"
                  item-text="status_result"
                  item-value="status_id"
                  cache-items
                  return-object
                  clearable
                  dense
                  outlined
                  v-on="filter.status.on"
                >
                </v-combobox>
              </v-col>
              <v-col
                class="py-0"
                md="4"
                lg="4"
                sm="12"
                xs="12"
              >
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
                      readonly
                      v-bind="attrs"
                      v-on="on"
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
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="pt-0">
        <v-card
          tile
          flat
        >
          <v-card-text>
            <v-row v-if="processPieLoading">
              <v-col>
                <div
                  class="d-flex align-center justify-center"
                  style="min-height: 320px"
                >
                  <div>
                    {{ $tc('Loading content...') }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row v-else-if="total_calls === 0">
              <v-col>
                <div
                  class="d-flex align-center justify-center"
                  style="min-height: 320px"
                >
                  <div>
                    {{ $tc('No data for the selected period') }}
                  </div>
                </div>
              </v-col>
            </v-row>
            <v-row v-else>
              <v-col
                cols="12"
                md="6"
                lg="6"
              >
                <div class="d-flex flex-column fill-height" style="min-height: 320px">
                  <v-spacer/>
                  <div class="mb-5">
                    <h4 class="mb-2 font-weight-medium">Всего сделано звонков</h4>
                    <div style="font-size: 2rem">{{ total_calls }}</div>
                  </div>
                  <div class="mb-5">
                    <h4 class="mb-2 font-weight-medium">Всего клиентов прозвонено</h4>
                    <div style="font-size: 2rem">{{ total_clients }}</div>
                  </div>
                  <v-spacer/>
                  <div>
                    На диаграмме представлены результаты последних звонков каждому клиенту
                  </div>
                </div>
              </v-col>
              <v-col
                cols="12"
                md="6"
                lg="6"
              >
                <v-card-text class="d-flex" style="min-height: 320px; max-height: 320px">
                  <v-spacer/>
                  <apexchart
                    width="500"
                    type="pie"
                    :options="apexchartOptions"
                    :series="pieSeries"
                  />
                </v-card-text>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row>
      <v-col class="pt-0 d-flex">
        <v-pagination
          v-model="dataTableHistory.page"
          :length="dataTableHistory.pages"
          total-visible="5"
        ></v-pagination>
        <v-spacer/>
        <v-btn-toggle color="primary" tile>
          <v-btn
            color="primary"
            disabled
            outlined
          >
            <v-icon color="primary">mdi-cog</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            disabled
            outlined
          >
            {{ $tc('Export to Excel') }}
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Контакты -->
        <v-data-table
          :headers="dataTableHistory.headers"
          :items="dataTableHistory.items"
          :server-items-length="dataTableHistory.totalCount"
          :page.sync="dataTableHistory.page"
          :items-per-page="dataTableHistory.itemsPerPage"
          :options.sync="dataTableHistory.options"
          :loading="historyProcessLoading"
          :height="1000"
          :no-data-text="$tc('No data for the selected period')"
          item-key="id"
          locale="ru"
          dense
          fixed-header
          hide-default-footer
          @pagination="onHistoryPaginationChange"
        >
          <!-- slots item -->
          <template slot="item.created_at" slot-scope="{ item }">
            {{ $moment.unix(item.created_at).format('DD.MM.YYYY HH:mm') }}
          </template>
          <template slot="item.contact" slot-scope="{ item }">
            <template v-if="item.contact">
              <router-link :to="{ name: 'operator_contacts_view', params: { contact_id: item.contact.id } }">
                {{ item.contact.last_name }} {{ item.contact.first_name }} {{ item.contact.middle_name }}
              </router-link>
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
            {{ item.comment || '-' }}
          </template>
          <template slot="item.call_duration" slot-scope="{ item }">
            {{ secondsToHmsDigital(item.call_duration) }}
          </template>
          <template slot="item.session_duration" slot-scope="{ item }">
            {{ secondsToHmsDigital(item.session_duration) }}
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
    <div style="height: 200px"></div>
  </v-container>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'

import VueApexCharts from 'vue-apexcharts'
import Reports from '@/api/Reports'
import { format } from 'date-fns'
import Users, { UserInterface } from '@/api/Users'
import { secondsToHmsDigital } from '@/utils/datetime'
import ContactHistory from '@/api/ContactHistory'
import audioPlayer from '@/mixins/audioPlayer'
import VInterface from '@/VInterface'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({

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
      pieData: [] as any[],

      usersSelected: null as UserInterface | null,
      users: [] as unknown as UserInterface[],

      filter: {
        status: {
          selected: null,
          items: [],
          on: {
            input: (scope: any) => {
              if (this.assertObjectHasAttribute(scope, 'status_id')) {
                this.$routerQuery.setQuery({ status_id: scope.status_id })
                this.fetchDataPie()
                this.fetchDataHistory()
              } else {
                this.$routerQuery.removeQuery(['status_id'])
                  .finally(() => {
                    this.fetchDataPie()
                    this.fetchDataHistory()
                  })
              }
            }
          }
        }
      },

      // Data table
      dataTableHistory: {
        totalCount: 0,
        page: 1, // Текущая страница
        pages: 0, // Всего страниц
        itemsPerPage: 100, // Количество данных на страницу
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
            sortable: false,
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
            text: 'Запись',
            align: 'end',
            sortable: false,
            value: 'record'
          }
        ],
        options: {}
      },
      loading: true,
      DtOptions: {}
    }
  },

  watch: {
    // Отслеживаю изменения данных в filterDate
    filterDate (value: string | number | undefined) {
      switch (value) {
        case 'today': {
          this.$routerQuery.setQuery({ date: 'today' }).then(this.onFilterDate)
          break
        }
        case 'yesterday': {
          this.$routerQuery.setQuery({ date: 'yesterday' }).then(this.onFilterDate)
          break
        }
        case 'this_week': {
          this.$routerQuery.setQuery({ date: 'this_week' }).then(this.onFilterDate)
          break
        }
        case 'last_week': {
          this.$routerQuery.setQuery({ date: 'last_week' }).then(this.onFilterDate)
          break
        }
        case 'month': {
          this.$routerQuery.setQuery({ date: 'month' }).then(this.onFilterDate)
          break
        }
      }
    },

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

    usersSelected: {
      handler (user: UserInterface | null) {
        if (user) {
          this.$routerQuery.setQuery({
            owner_id: user.id
          }).then(() => {
            this.fetchDataPie()
            this.fetchDataHistory()
          })
        } else {
          this.$routerQuery
            .removeQuery(['owner_id'])
            .then(() => {
              this.fetchDataPie()
              this.fetchDataHistory()
            })
        }
      }
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
        chart: {
          events: {
            legendClick: (chartContext: any, seriesIndex: any, config: any) => {
              const scope: any = this.pieData[seriesIndex]
              if (this.assertObjectHasAttribute(scope, 'status_id')) {
                this.filter.status.selected = this.pieData[seriesIndex]
                this.$routerQuery.setQuery({ status_id: scope.status_id })
                  .finally(() => {
                    this.fetchDataPie()
                    this.fetchDataHistory()
                  })
              } else {
                throw new Error('В объекте scope отсутствует свойство status_id')
              }
            }
          }
        },
        legend: {
          show: true,
          position: 'right',
          markers: {
            onClick: (chart: any, seriesIndex: any, opts: any) => {
              console.log('series- ' + seriesIndex + "'s marker was clicked")
            }
          },
          formatter: function (seriesName: string, opts: any) {
            return [seriesName, ' - ', opts.w.globals.series[opts.seriesIndex]]
          }
        },
        labels: this.pieLabels,
        colors: this.pieColors
      }
    },

    dataTableHistoryHeight () {
      if (this.$screenHeight < 900) {
        return 500
      }
      return this.$screenHeight
    }
  },

  created () {
    if (this.$routerQuery.hasQuery('date')) {
      this.filterDate = this.$routerQuery.getQuery('date')

      if (/^\d+,\d+/s.test(String(this.filterDate))) {
        const dateRangeStr = String(this.filterDate)
        const dates = dateRangeStr.split(',', 2)
        this.dateRange = [
          format(new Date(+dates[0] * 1000), 'yyyy-MM-dd'),
          format(new Date(+dates[1] * 1000), 'yyyy-MM-dd')
        ]
      }
    }

    this.dataTableHistory.page = +this.$routerQuery.getQuery('history_page', 1)
    this.fetchDataPie()
    this.fetchUsers()
  },

  mounted () {
    // this.$watch('filter.status.selected', ({ status_id }) => {
    //   this.$routerQuery.setQuery({
    //     status_id
    //   })
    // })
  },

  methods: {
    fetchUsers () {
      new Users()
        .find({
          count: 1000
        })
        .then((response) => {
          this.users = response.data
          if (this.$routerQuery.hasQuery('owner_id')) {
            const index = this.users.findIndex((user: UserInterface) => user.id === +this.$routerQuery.getQuery('owner_id'))
            if (index > -1) {
              this.usersSelected = this.users[index]
            }
          }
        })
    },

    // Загрузить график
    fetchDataPie () {
      this.processPieLoading = true

      const params: any = {}

      if (this.assertObjectHasAttribute(this.$route.query, 'status_id')) {
        params.status_id = +this.$route.query.status_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'date')) {
        params.date = this.$route.query.date
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'owner_id')) {
        params.owner_id = +this.$route.query.owner_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'contact_created_at')) {
        params.contact_created_at = +this.$route.query.contact_created_at
      }

      new Reports()
        .pie(params)
        .then((report: any) => {
          this.total_calls = report.total_calls
          this.total_clients = report.total_clients

          // Pie chart
          this.pieLabels = report.pie_chart.labels || ['']
          this.pieSeries = report.pie_chart.series || [1]
          this.pieColors = report.pie_chart.colors || []

          this.pieData = report.pie_data || []
          this.filter.status.items = report.pie_data || []

          if (this.$routerQuery.hasQuery('status_id')) {
            const index = this.filter.status.items.findIndex((e: any) => e.status_id === +this.$route.query.status_id)
            if (index > -1) {
              this.filter.status.selected = this.filter.status.items[index]
            }
          }
        }).finally(() => (this.processPieLoading = false))
    },

    // Загрузить историю
    fetchDataHistory () {
      this.historyProcessLoading = true
      const offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage

      const params: any = {
        offset,
        count: this.dataTableHistory.itemsPerPage,
        type: 'last' // Показать всю историю
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'status_id')) {
        params.status_id = +this.$route.query.status_id
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'date')) {
        params.date = this.$route.query.date
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'owner_id')) {
        params.owner_id = this.$route.query.owner_id
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
          this.dataTableHistory.items = response.data.map((e: any) => {
            e.isPlaying = false
            return e
          }) || []
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
          this.fetchDataPie()
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
            this.fetchDataPie()
            this.fetchDataHistory()
          })
        this.$refs.menuContactDateCreated.save(null)
        return
      }

      this.$refs.menuContactDateCreated.save(dateStr)
      this.$routerQuery
        .setQuery({ contact_created_at: new Date(dateStr).getTime() / 1000 })
        .finally(() => {
          this.fetchDataPie()
          this.fetchDataHistory()
        })
    },

    onFilterDate () {
      this.fetchDataPie()
      this.fetchDataHistory()
    },

    onHistoryPaginationChange (pagination: any) {
      console.log(pagination)
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

    secondsToHmsDigital (d: number) {
      return secondsToHmsDigital(d)
    }
  }
})
</script>

<style lang="scss">
table > tbody > tr {
  & > td:nth-child(1) {
    white-space: nowrap;
  }

  & > td:nth-child(2) {
    white-space: nowrap;
  }

  & > td:nth-child(3) {
    white-space: nowrap;
  }

  & > td:nth-child(4) {
    width: 100%;
  }

  & > td:nth-child(5) {
    width: auto;
  }
}
</style>
