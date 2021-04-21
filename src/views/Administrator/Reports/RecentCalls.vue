<template>
  <v-card
    flat
    tile
  >
    <v-row>
      <v-col>
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

      <!-- Фильтр по результату звонка -->
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

      <!-- Фильтр дата создания контакта -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <app-date-picker-input
          v-model="filter.contact_created_at"
          :label="$tc('Date the contact was created')"
          return-date-type="unix"
          date-range
        />
      </v-col>
    </v-row>

    <!-- Круговая диаграмма -->
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
    <v-row v-else justify="space-between">
      <v-col
        cols="12"
        md="6"
        lg="6"
      >
        <div class="d-flex flex-column fill-height" style="min-height: 320px">
          <div class="mb-5">
            <h4 class="mb-2 font-weight-regular">Всего сделано звонков</h4>
            <div style="font-size: 2rem">{{ total_calls }}</div>
          </div>
          <div class="mb-5">
            <h4 class="mb-2 font-weight-regular">Всего клиентов прозвонено</h4>
            <div style="font-size: 2rem">{{ total_clients }}</div>
          </div>
          <v-spacer/>
          <p>
            На диаграмме представлены результаты последних звонков каждому клиенту
          </p>
        </div>
      </v-col>
      <v-col
        class="d-flex"
        cols="12"
        md="6"
        lg="6"
      >
        <v-spacer/>
        <apexchart
          width="500"
          type="pie"
          :options="apexchartOptions"
          :series="pieSeries"
        />
      </v-col>
    </v-row>

    <!-- Actions -->
    <v-row>
      <v-col class="d-flex">
        <app-pagination
          v-model="dataTableHistory.page"
          :length="dataTableHistory.pages"
          :disabled="dataTableHistory.processLoading"
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
                  {{ dataTableHistory.pageStart }}-{{ dataTableHistory.pageStop }} из {{ dataTableHistory.totalCount }}
                </v-btn>
              </template>
              <v-list
                class="py-0"
                dense
                flat
              >
                <v-list-item
                  link
                  @click="dataTableHistory.page = 1"
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые новые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  @click="dataTableHistory.page = dataTableHistory.pages -1"
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые старые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </app-pagination>
        <v-spacer />

        <v-btn-toggle color="primary">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="dataTableHistory.selected.length === 0"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-export</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                link
                @click="onTransferContactsToAnotherProjectClick"
              >
                <v-list-item-title>{{ $tc('Transfer contacts to another project') }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn
            color="primary"
            outlined
          >
            <v-icon>mdi-cog</v-icon>
          </v-btn>
          <v-btn
            color="primary"
            outlined
          >
            Выгрузить в Excel
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>

    <!-- Таблица -->
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
          :no-data-text="$tc('No data for the selected period')"
          :item-class="vDataTableItemClass"
          locale="ru"
          item-key="id"
          show-select
          dense
          fixed-header
          hide-default-footer
          @pagination="onPaginationChange"
        >

          <!-- slots item -->
          <template slot="item.created_at" slot-scope="{ item }">
            {{ $moment.unix(item.created_at).format('DD.MM.YYYY HH:mm') }}
          </template>
          <template slot="item.contact" slot-scope="{ item }">
            <template v-if="item.contact">
              <router-link :to="{ name: 'administrator_contacts_view', params: { contact_id: item.contact.id } }">
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
            <v-tooltip color="primary" max-width="300" bottom>
              <template v-slot:activator="{ on }">
                <div v-on="on" style="white-space: nowrap;text-overflow: ellipsis;overflow: hidden;width: 200px">
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
  </v-card>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { Contacts } from '@/api/Contacts'
import AppDatePickerInput from '@/components/AppDatePickerInput/AppDatePickerInput.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import SContactExportDialog from '@/snippets/SContactExportDialog/SContactExportDialog.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue, { VueConstructor } from 'vue'
import VueApexCharts from 'vue-apexcharts'
import Reports from '@/api/Reports'
import { format } from 'date-fns'
import { UserInterface } from '@/api/Users'
import { secondsToHmsDigital } from '@/utils/datetime'
import ContactHistory from '@/api/ContactHistory'
import audioPlayer from '@/mixins/audioPlayer'
import VInterface from '@/VInterface'
import { debounce } from 'vuetify/src/util/helpers'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({
  components: {
    AppDatePickerInput,
    AppPagination,
    SUsers
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
        colors: this.pieColors,
        labels: this.pieLabels,
        legend: {
          formatter: function (seriesName: string, opts: any) {
            return [seriesName, ' - ', opts.w.globals.series[opts.seriesIndex]]
          },
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

    dataTableHistoryHeight () {
      if (this.$screenHeight < 900) {
        return 500
      }
      return this.$screenHeight - 400
    }
  },

  data () {
    return {
      DtOptions: {},
      contactDateCreated: null,

      // Data table
      dataTableHistory: {
        headers: [
          {
            align: 'start',
            divider: true,
            sortable: true,
            text: 'Дата и время',
            value: 'created_at',
            width: 'auto'
          },
          {
            sortable: true,
            text: 'Клиент',
            value: 'contact',
            width: 'auto'
          },
          {
            sortable: true,
            text: 'Результат',
            value: 'status',
            width: 'auto'
          },
          {
            align: 'start',
            sortable: true,
            text: 'Комментарий',
            value: 'comment',
            width: '100%'
          },
          {
            align: 'end',
            sortable: false,
            text: 'Длительность разговора',
            value: 'call_duration',
            width: 'auto'
          },
          {
            align: 'end',
            sortable: false,
            text: 'Общее время сессии',
            value: 'session_duration',
            width: 'auto'
          },
          {
            sortable: false,
            text: 'Менеджер',
            value: 'owner',
            width: 'auto'
          },
          {
            align: 'end',
            sortable: false,
            text: 'Запись',
            value: 'record',
            width: 'auto'
          }
        ],
        items: [],
        // Всего страниц
        itemsPerPage: 100,
        options: {},
        page: 1,
        pageStart: 0,
        pageStop: 0,
        // Текущая страница
        pages: 0,

        // Выделить все контакты
        selected: [],
        // Количество данных на страниц
        selectedAll: false,
        totalCount: 0
      },

      dateRange: null as string[] | null,

      filter: {
        // Дата создания контакта
        contact_created_at: [] as string[] | number[],
        date: null as unknown & string | null,

        status: {
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
          },
          selected: null
        },
        // Дата или диапазон дат
        user: [] as unknown & UserInterface[]
      },

      filterDate: undefined,
      historyProcessLoading: false,
      history_count: 0,
      itemsPerPage: 10,
      loading: true,
      menuDateRange: null,
      options: {
        labels: []
      },
      page: 1,
      pageCount: 0,
      pieColors: [] as string[],
      pieData: [] as any[],
      pieLabels: [] as string[],
      pieSeries: [] as number[],
      processPieLoading: false,

      // Процесс загрузки изображений
      // Report
      total_calls: 0,

      total_clients: 0,
      users: [] as unknown as UserInterface[],
      usersSelected: null as UserInterface | null
    }
  },

  methods: {

    // Загрузить историю
    fetchDataHistory () {
      this.historyProcessLoading = true
      let offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage

      if (offset < 0) {
        offset = 0
      }

      const params: any = {
        count: this.dataTableHistory.itemsPerPage,
        offset,
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

      if (Array.isArray(this.filter.contact_created_at)) {
        if (this.filter.contact_created_at.length === 2) {
          params.contact_created_at = this.filter.contact_created_at.join(',')
        }
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
          }).finally(() => {
            this.fetchDataPie()
            this.fetchDataHistory()
          })
        } else {
          this.$routerQuery
            .removeQuery(['owner_id'])
            .finally(() => {
              this.fetchDataPie()
              this.fetchDataHistory()
            })
        }
      }, debounceDelay))

      // Фильтрация по датам
      this.$watch('filter.date', debounce((newVal: unknown & string) => {
        const onFetch = () => {
          this.fetchDataPie()
          this.fetchDataHistory()
        }
        switch (newVal) {
          case 'today': {
            this.$routerQuery.setQuery({ date: 'today' }).finally(onFetch)
            break
          }
          case 'yesterday': {
            this.$routerQuery.setQuery({ date: 'yesterday' }).finally(onFetch)
            break
          }
          case 'this_week': {
            this.$routerQuery.setQuery({ date: 'this_week' }).finally(onFetch)
            break
          }
          case 'last_week': {
            this.$routerQuery.setQuery({ date: 'last_week' }).finally(onFetch)
            break
          }
          case 'month': {
            this.$routerQuery.setQuery({ date: 'month' }).finally(onFetch)
            break
          }
        }
      }, debounceDelay))

      // Фильтрация по дате создания контактов
      this.$watch('filter.contact_created_at', (val: number[]) => {
        this.$routerQuery.setQuery({
          contact_created_at: val.join(',')
        }).then(() => {
          this.fetchDataPie()
          this.fetchDataHistory()
        })
      })
    },

    onFilterDate () {
      this.fetchDataPie()
      this.fetchDataHistory()
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
     * Передать контакты в другой проект
     */
    async onTransferContactsToAnotherProjectClick () {
      const instance = await this.$dialog.show(SContactExportDialog, {

        onCancel: () => {
          instance.close()
        },

        // scope - набор опций для передачи контактов
        onTransfer: (scope: any) => {
          const data: any = {
            target_contacts: this.dataTableHistory.selected,
            target_project: scope.target_project.id,
            target_users: scope.target_users.map((e: UserInterface) => e.id)
          }

          // В dataTableHistory.selected данные истории
          this.dataTableHistory.selected.forEach((value: any, index: number) => {
            // Мы обязаны проверит наличие контакта в истории
            if (this.assertObjectHasAttribute(value.contact, 'id')) {
              data.target_contacts.push(value.contact.id)
            }
          })

          if (this.assertObjectHasAttribute(scope, 'new_date')) {
            data.new_date = scope.new_date
          }

          new Contacts()
            .transfer(data)
            .then(() => {
              this.$toast.success(this.$tc('Transfer success'))
            }).catch((error) => {
              if (error instanceof APIError) {
                error.errors.forEach((value) => {
                  this.$toast.error(this.$tc(value.message))
                })
                this.$toast.error(this.$tc(error.error_message))
              }
            }).finally(() => {
              instance.close()
            })
        },

        persistent: true,

        subtitle: this.$tc('No contacts selected | {n} contact selected | {n} contact selected | {n} contacts selected', this.dataTableHistory.selected.length),

        waitForResult: false,

        width: '700px'
      })
    },

    secondsToHmsDigital (d: number) {
      return secondsToHmsDigital(d)
    },

    vDataTableItemClass (scope: any) {
      return 'v-dt-item'
    }
  },

  mixins: [audioPlayer],

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
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery<number>('owner_id')))
    }

    if (this.$routerQuery.hasQuery('contact_created_at')) {
      const dateRange = this.$routerQuery.getQuery<string>('contact_created_at')
      this.filter.contact_created_at = dateRange
        .split(',', 2)
        .map((e: string) => +e)
        .sort((a: number, b: number) => a - b) // Сортируем на всякий случай.
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаю данные после инициализации фильтров
    Promise.all(promises)
      .finally(() => {
        this.fetchDataPie()
        this.fetchDataHistory()

        this.initializeWatchForFilters()
      })
  },

  watch: {

    'dataTableHistory.options': {
      deep: true,
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
      }
    },

    'dataTableHistory.page': {
      handler (page: number) {
        this.$routerQuery.setQuery({ history_page: page })
      }
    }
  }
})
</script>

<style lang="scss">
  .v-dt-item {
    & > td {
      white-space: nowrap;
    }
  }
</style>
