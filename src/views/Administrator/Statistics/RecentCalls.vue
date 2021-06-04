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

      <!-- Фильтр по результату звонка -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <v-combobox
          v-model="filter.status"
          :items="filter_statuses"
          :label="$tc('Фильтр по результату')"
          item-text="name"
          item-value="id"
          item-color="color"
          return-object
          clearable
          dense
          outlined
        >
          <template v-slot:item="{ item }">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.project_name }}</v-list-item-subtitle>
          </template>
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

      <!-- Фильтр по группам -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <s-groups
          ref="sGroupsAutocomplete"
          v-model="filter.groups"
          :label="$tc('Groups')"
          clearable
          dense
          outlined
          multiple
        />
      </v-col>

      <!-- Фильтр по проектам -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <s-projects-autocomplete
          ref="sProjectsAutocomplete"
          v-model="filter.project"
          :label="$tc('Projects')"
          clearable
          dense
          outlined
          multiple
        />
      </v-col>

      <!-- Фильтр по тегам -->
      <v-col
        class="py-0"
        md="4"
        lg="4"
        sm="12"
        xs="12"
      >
        <s-contact-tags
          v-model="filter.tags"
          :label="$tc('Tags')"
          multiple
          clearable
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
        <div class="d-flex flex-column fill-height" style="min-height: 320px">
          <div class="mb-5">
            <h4 class="mb-2 font-weight-regular">Всего сделано звонков</h4>
            <div style="font-size: 2rem">
              <app-count-up
                :delay="1000"
                :end-val="total_calls"
              />
            </div>
          </div>
          <div class="mb-5">
            <h4 class="mb-2 font-weight-regular">Всего клиентов прозвонено</h4>
            <div style="font-size: 2rem">
              <app-count-up
                :delay="1000"
                :end-val="total_clients"
              />
            </div>
          </div>
          <v-spacer/>
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
          v-if="pieSeries.length === 0"
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
            :series="pieSeries"
          />
        </div>
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
                  <app-count-up
                    :end-val="dataTableHistory.pageStart"
                  />
                  <span class="mx-1">—</span>
                  <app-count-up
                    :end-val="dataTableHistory.pageStop"
                  />
                  <span class="mx-1">из</span>
                  <app-number-format
                    :value="dataTableHistory.totalCount"
                  />
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
          :sort-by.sync="dataTableHistory.sortBy"
          :sort-desc.sync="dataTableHistory.sortDesc"
          locale="ru"
          item-key="id"
          show-select
          dense
          fixed-header
          hide-default-footer
          multi-sort
          @pagination="onPaginationChange"
        >

          <!-- slots item -->
          <template slot="item.created_at" slot-scope="{ item }">
            {{ $moment.unix(item.created_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
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
          <template slot="item.creator" slot-scope="{ item }">
            <template v-if="item.creator">
              <template v-if="item.creator.is_deleted">
                <span style="text-decoration: line-through">
                  {{ item.creator.first_name }} {{ item.creator.last_name }}
                </span>
              </template>
              <template v-else>
                {{ item.creator.first_name }} {{ item.creator.last_name }}
              </template>
            </template>
            <template v-else>
              —
            </template>
          </template>
          <template slot="item.record" slot-scope="{ item }">
            <v-btn
              v-if="!item.isPlaying"
              :disabled="item.audio_recording_id === null"
              icon
              small
              @click="onPlayClick(item)"
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
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppDatePickerInput from '@/components/AppDatePickerInput/AppDatePickerInput.vue'
import AppNumberFormat from '@/components/AppNumberFormat/AppNumberFormat.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import dateRangeCollection from '@/mixins/dateRangeCollection'
import SContactTags from '@/snippets/SContactTags/SContactTags.vue'
import SContactTransferDialog from '@/snippets/SContactTransferDialog/SContactTransferDialog.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import Vue, { VueConstructor } from 'vue'
import VueApexCharts from 'vue-apexcharts'
import Statistics from '@/api/Statistics'
import { format } from 'date-fns'
import { UserInterface } from '@/api/Users'
import { secondsToHmsDigital } from '@/utils/datetime'
import ContactHistory from '@/api/ContactHistory'
import audioPlayer from '@/mixins/audioPlayer'
import VInterface from '@/VInterface'
import { debounce } from 'vuetify/src/util/helpers'
import { GroupInterface } from '@/api/Groups'
import { ProjectInterface } from '@/api/Projects'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({
  mixins: [audioPlayer, dateRangeCollection],

  components: {
    AppNumberFormat,
    SContactTags,
    AppBtnToggleDate,
    AppCountUp,
    AppDatePickerInput,
    AppPagination,
    SUsers,
    SGroups,
    SProjectsAutocomplete
  },

  computed: {
    // Статусы используются дл фильтрации результатов
    filter_statuses: {
      get () {
        return this.$store.getters['filter/statuses']
      },

      set (val: any[]) {
        this.$store.commit('filter/statuses', val)
      }
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
        colors: this.pieColors,
        labels: this.pieLabels,
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

    paramsSort (): unknown[] & { sort_by: string, sort_desc: boolean }[] {
      const json: string = this.$routerQuery.getQuery('sort', '[]')
      return JSON.parse(json)
    }
  },

  created () {
    this.dataTableHistory.page = +this.$routerQuery.getQuery('history_page', 1)
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
            sortable: true,
            text: 'Длительность разговора',
            value: 'call_duration',
            width: 'auto'
          },
          {
            align: 'end',
            sortable: true,
            text: 'Общее время сессии',
            value: 'session_duration',
            width: 'auto'
          },
          {
            sortable: true,
            text: 'Менеджер',
            value: 'creator',
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
        itemsPerPage: 50,
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
        totalCount: 0,
        sortBy: [],
        sortDesc: []
      },

      dateRange: null as string[] | null,

      filter: {
        // Дата создания контакта
        contact_created_at: [] as string[] | number[],
        date_period: null as unknown as string,
        tags: [],
        status: null,
        // Дата или диапазон дат
        user: [] as unknown & UserInterface[],
        groups: [] as unknown & GroupInterface[],
        project_id: null as unknown & ProjectInterface | null
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

      // Количество звонков
      total_calls_process_loading: false,
      total_calls: 0,

      total_clients: 0,
      users: [] as unknown as UserInterface[],
      usersSelected: null as UserInterface | null,

      fetchAllData: debounce(() => {
        this.fetchTotalCallCount()
        this.fetchDataHistory()
        this.fetchDataPie()
      }, 350),

      // Получить данные для таблицы
      fetchDataHistory: debounce(() => {
        this.historyProcessLoading = true
        let offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage

        if (offset < 0) {
          offset = 0
        }

        const params: any = Object.assign({
          count: this.dataTableHistory.itemsPerPage,
          offset
        }, this.paramFilters()) // Общие параметры подъехали

        // Формирую параметры сортировки
        this.dataTableHistory.sortBy.forEach((name: string, index: number) => {
          params[`sort_by[${name}]`] = this.dataTableHistory.sortDesc[index] ? 'desc' : 'asc'
        })

        if (this.$routerQuery.hasQuery('project_id')) {
          params.project_id = this.$routerQuery.getQuery('project_id')
        }

        if (this.$routerQuery.hasQuery('group_ids')) {
          params.group_ids = this.$routerQuery.getQuery('group_ids')
        }
        new Statistics()
          .history<any, any>(params)
          .then((response) => {
            this.dataTableHistory.totalCount = response?.meta?.count || 0
            this.dataTableHistory.pages = Math.ceil((response?.meta?.count || 0) / this.dataTableHistory.itemsPerPage)
            this.dataTableHistory.items = response.data.map((e: any) => {
              e.isPlaying = false
              return e
            }) || []
          }).finally(() => (this.historyProcessLoading = false))
      }, 350)
    }
  },

  methods: {

    // Загрузить график
    fetchDataPie () {
      this.processPieLoading = true

      const params: any = Object.assign({
        // Здесь могут быть дополнительные параметры
      }, this.paramFilters())

      new Statistics()
        .pie(params)
        .then((response: any) => {
          // Всего клиентов прозвонено
          this.total_clients = response.total_clients

          // Pie chart
          this.pieLabels = response.pie_chart.labels || ['']
          this.pieSeries = response.pie_chart.series || [1]
          this.pieColors = response.pie_chart.colors || []

          this.pieData = response.pie_data || []

          // Статусы для фильтра
          this.filter_statuses = response.statuses || []
        }).finally(() => (this.processPieLoading = false))
    },

    async fetchTotalCallCount () {
      this.total_calls_process_loading = true
      this.total_calls = await new Statistics().totalCalls(Object.assign({}, this.paramFilters()))
      this.total_calls_process_loading = false
    },

    /**
     * Инициализировать слежение за изменением фильтров
     */
    initializeWatchForFilters () {
      const debounceDelay = 350 // Задержка, избавит от дребезга
      // Фильтрация по пользователям
      this.$watch('filter.user', (newVal: unknown & UserInterface) => {
        this.dataTableHistory.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            creator_id: newVal.id
          }).finally(() => {
            this.fetchAllData()
          })
        } else {
          this.$routerQuery
            .removeQuery(['creator_id'])
            .finally(() => {
              this.fetchAllData()
            })
        }
      })

      // Фильтрация по датам
      this.$watch('filter.date_period', (newVal: unknown & string) => {
        this.dataTableHistory.page = 1
        this.$routerQuery.setQuery({ date_period: newVal }).finally(this.fetchAllData)
      })

      // Фильтрация по дате создания контактов
      this.$watch('filter.contact_created_at', (val: number[]) => {
        this.dataTableHistory.page = 1
        this.$routerQuery.setQuery({
          contact_created_at: val.join(',')
        }).then(() => {
          this.fetchAllData()
        })
      })

      // Фильтрация по проектам
      this.$watch('filter.project', (newVal: unknown & ProjectInterface) => {
        this.dataTableHistory.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            project_id: newVal.id
          }).then(this.fetchAllData)
        } else {
          this.filter.status = null // Очистить фильтр по статусам
          this.$routerQuery.removeQuery([
            'project_id'
          ]).then(this.fetchAllData)
        }
      })

      // Фильтрация по проектам
      this.$watch('filter.status', (val: unknown & { id: number; name: string }) => {
        if (val) {
          this.$routerQuery.setQuery({
            status_id: val.id
          }).then(this.fetchAllData)
        } else {
          this.$routerQuery.removeQuery([
            'status_id'
          ]).then(this.fetchAllData)
        }
      })

      // Фильтрация по группам
      this.$watch('filter.groups', (newVal: unknown & GroupInterface[]) => {
        this.dataTableHistory.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            group_ids: newVal.map((e: GroupInterface) => e.id).join(',')
          }).then(this.fetchAllData)
        } else {
          this.$routerQuery.removeQuery([
            'group_ids'
          ]).then(this.fetchAllData)
        }
      })

      // Фильтрация по тегам
      this.$watch('filter.tags', (newVal: number[]) => {
        this.dataTableHistory.page = 1
        if (newVal) {
          this.$routerQuery.setQuery({
            tag_ids: newVal.join(',')
          }).then(this.fetchAllData)
        } else {
          this.$routerQuery.removeQuery([
            'tag_ids'
          ]).then(this.fetchAllData)
        }
      })

      // АТОМАРНОЕ ОБНОВЛЕНИЕ СОРТИРОВКИ

      /**
       * Функция, реагирующая на изменение свойств sortDesc, sortDesc объекта dataTableContacts
       */
      const dataTableSortUpdate = debounce(() => {
        const sort = []
        for (let i = 0; i < Math.min(this.dataTableHistory.sortBy.length, this.dataTableHistory.sortDesc.length); i++) {
          const sortDesc: string = this.dataTableHistory.sortDesc[i]
          const sortBy: boolean = this.dataTableHistory.sortBy[i]

          sort.push({ sort_by: sortBy, sort_desc: sortDesc })
        }

        if (sort.length > 0) {
          // Преобразовываю в JSON и сохраняю в строку браузера
          this.$routerQuery.setQuery({
            sort: JSON.stringify(sort)
          }).then(() => {
            this.fetchContacts()
          })
        } else {
          this.$routerQuery
            .removeQuery(['sort'])
            .then(() => {
              this.fetchContacts()
            })
        }
      }, debounceDelay)

      // Поля, по которым буду осуществлять сортировку
      this.$watch('dataTableContacts.sortBy', dataTableSortUpdate)
      // Направление сортировки
      this.$watch('dataTableContacts.sortDesc', dataTableSortUpdate)
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

      this.filter.date_period = dr
      this.$routerQuery
        .setQuery({ date_period: dr })
        .then(() => {
          this.fetchAllData()
        })
    },

    /**
     * Передать контакты в другой проект
     */
    async onTransferContactsToAnotherProjectClick () {
      const instance = await this.$dialog.show(SContactTransferDialog, {

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

    /**
     * Общие параметры запроса
     */
    paramFilters () {
      const params: any = {
        type: 'last' // Показать всю историю
      }

      if (this.$routerQuery.hasQuery('status_id')) {
        params.status_id = this.$routerQuery.getQuery('status_id')
      }

      if (this.$routerQuery.hasQuery('date_period')) {
        params.date_period = this.$route.query.date_period
      }

      if (this.$routerQuery.hasQuery('creator_id')) {
        params.creator_id = this.$routerQuery.getQuery('creator_id')
      }

      if (this.$routerQuery.hasQuery('contact_created_at')) {
        params.contact_created_at = this.$routerQuery.getQuery('contact_created_at')
      }

      if (this.$routerQuery.hasQuery('project_id')) {
        params.project_id = this.$routerQuery.getQuery('project_id')
      }

      if (this.$routerQuery.hasQuery('group_ids')) {
        params.group_ids = this.$routerQuery.getQuery('group_ids')
      }

      if (this.$routerQuery.hasQuery('tag_ids')) {
        params.tag_ids = this.$routerQuery.getQuery('tag_ids')
      }

      return params
    },

    vDataTableItemClass (scope: any) {
      return 'v-dt-item'
    },

    onPlayClick (item: unknown & { id: number; creator: unknown & { first_name: string; last_name: string }, contact: unknown & { first_name: string; last_name: string } }) {
      new ContactHistory()
        .getAudioFile(item.id)
        .then((response: any) => {
          this.$root.$emit('on-audio-player-show', {
            src: response.url,
            author: `${item.creator.first_name} ${item.creator.last_name} - ${item.contact.last_name} ${item.contact.first_name}`
          })
        }).catch((e) => {
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        })
    }
  },

  mounted () {
    // поместите любое обещание, для того что бы подождать, прежде чем начнётся загрузка данных для графика
    const promises: Promise<any>[] = []

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

    if (this.$routerQuery.hasQuery('creator_id')) {
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('creator_id')))
    }

    if (this.$routerQuery.hasQuery('project_id')) {
      promises.push(this.$refs.sProjectsAutocomplete.setDefault(this.$routerQuery.getQuery('project_id')))
    }

    if (this.$routerQuery.hasQuery('status_id')) {
      const index = (this.filter_statuses as { id: number }[]).findIndex(value => value.id === +this.$routerQuery.getQuery('status_id'))

      if (index > -1) {
        this.filter.status = this.filter_statuses[index]
      }
    }

    if (this.$routerQuery.hasQuery('group_ids')) {
      promises.push(this.$refs.sGroupsAutocomplete.setDefault(this.$routerQuery.getQuery('group_ids').split(',')))
    }

    if (this.$routerQuery.hasQuery('tag_ids')) {
      const tag_ids = this.$routerQuery.getQuery('tag_ids').split(',')
      this.filter.tags = tag_ids.map(value => +value)
    }

    if (this.$routerQuery.hasQuery('contact_created_at')) {
      const dateRange = this.$routerQuery.getQuery('contact_created_at')
      this.filter.contact_created_at = dateRange
        .split(',', 2)
        .map((e: string) => +e)
        .sort((a: number, b: number) => a - b) // Сортируем на всякий случай.
    }

    // Восстановление параметров сортировки после перезагрузки страницы
    if (this.$routerQuery.hasQuery('sort')) {
      this.paramsSort.forEach((e: unknown & { sort_by: string, sort_desc: boolean }) => {
        this.$data.dataTableHistory.options.sortBy.push(e.sort_by)
        this.$data.dataTableHistory.options.sortDesc.push(e.sort_desc)
      })
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаю данные после инициализации фильтров
    Promise.all(promises)
      .finally(() => {
        this.fetchAllData()

        this.initializeWatchForFilters()
      })
  },

  watch: {

    'dataTableHistory.options': {
      deep: true,
      handler ({ sortBy, sortDesc }) {
        const sort = []
        for (let i = 0; i < Math.min(sortBy.length, sortDesc.length); i++) {
          sort.push({ sort_by: sortBy[i], sort_desc: sortDesc[i] })
        }
        if (sort.length > 0) {
          // Преобразовываю в JSON и сохраняю в строку браузера
          this.$routerQuery.setQuery({
            sort: JSON.stringify(sort)
          }).then(() => {
            this.fetchDataHistory()
          })
        } else {
          this.$routerQuery
            .removeQuery(['sort'])
            .then(() => {
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
