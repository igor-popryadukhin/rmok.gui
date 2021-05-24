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
          <template v-slot:item="{ item }">
            <v-list-item-title>{{ item.status_result }}</v-list-item-title>
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
          :value="new Date()"
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

    <v-row>
      <v-col class="d-flex">
        <app-pagination
          v-model="dataTableHistory.page"
          :length="dataTableHistory.pages"
          :disabled="dataTableHistory.processLoading || dataTableHistory.selectedWhole"
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
          :options.sync="dataTableHistory.options"
          :loading="historyProcessLoading"
          :item-class="vDataTableItemClass"
          :no-data-text="$tc('No data for the selected period')"
          locale="ru"
          item-key="id"
          dense
          fixed-header
          hide-default-footer
          show-select
          multi-sort
          @pagination="onPaginationChange"
          :sort-by.sync="dataTableHistory.sortBy"
          :sort-desc.sync="dataTableHistory.sortDesc"
        >
          <!-- slots item -->
          <template slot="item.created_at" slot-scope="{ item }">
            {{ $moment.unix(item.created_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
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
              {{ item.creator.first_name }} {{ item.creator.last_name }}
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
import ContactHistory from '@/api/ContactHistory'
import { ContactTagInterface } from '@/api/Schemas/ContactInterface'
import Statistics from '@/api/Statistics'
import { UserInterface } from '@/api/Users'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppDatePickerInput from '@/components/AppDatePickerInput/AppDatePickerInput.vue'
import AppNumberFormat from '@/components/AppNumberFormat/AppNumberFormat.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import audioPlayer from '@/mixins/audioPlayer'
import dateRangeCollection from '@/mixins/dateRangeCollection'
import SContactTags from '@/snippets/SContactTags/SContactTags.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import { secondsToHmsDigital } from '@/utils/datetime'
import VInterface from '@/VInterface'
import { format } from 'date-fns'
import Vue, { VueConstructor } from 'vue'
import VueApexCharts from 'vue-apexcharts'
import { debounce } from 'vuetify/src/util/helpers'
import { GroupInterface } from '@/api/Groups'
import { ProjectInterface } from '@/api/Projects'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({
  components: {
    SContactTags,
    AppNumberFormat,
    AppCountUp,
    AppBtnToggleDate,
    AppDatePickerInput,
    AppPagination,
    SUsers,
    SGroups,
    SProjectsAutocomplete
  },

  mixins: [audioPlayer, dateRangeCollection],

  computed: {
    apexchartOptions (): any {
      return {
        colors: this.pieColors,
        labels: this.pieLabels,
        legend: {
          position: 'right',
          show: true
        }
      }
    },

    dataTableHistoryHeight () {
      if (this.$screenHeight < 900) {
        return 500
      }
      return this.$screenHeight - 150
    },

    paramsSort (): unknown[] & { sort_by: string, sort_desc: boolean }[] {
      const json: string = this.$routerQuery.getQuery<string>('sort', '[]')
      return JSON.parse(json)
    }
  },

  created () {
    this.dataTableHistory.page = +this.$routerQuery.getQuery('history_page', 1)
  },

  data () {
    return {
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
        itemsPerPage: 50,
        options: {},
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 1,
        totalCount: 0,
        sortBy: [],
        sortDesc: []
      },
      dateRange: null as string[] | null,
      filter: {
        contact_created_at: [] as string[] | number[],
        date_period: null as unknown & string | null,
        status: {
          items: [],
          on: {
            input: (scope: any) => {
              if (this.assertObjectHasAttribute(scope, 'status_id')) {
                this.$routerQuery.setQuery({ status_id: scope.status_id })
                this.fetchDataHistory()
              } else {
                this.dataTableHistory.page = 1
                this.$routerQuery.removeQuery(['status_id'])
                  .finally(() => {
                    this.fetchDataHistory()
                  })
              }
            }
          },
          selected: null
        },
        // Дата или диапазон дат
        user: [] as unknown & UserInterface[],
        groups: [] as unknown & GroupInterface[],
        tags: [] as unknown & ContactTagInterface[],
        project_id: null as unknown & ProjectInterface | null
      },
      filterDate: undefined,
      historyProcessLoading: false,
      history_count: 0,
      itemsPerPage: 10,
      loading: true,
      menuContactDateCreated: null as boolean | null,
      menuDateRange: null,
      options: {
        labels: []
      },
      page: 1,
      pageCount: 0,
      pieColors: [] as string[],
      pieLabels: [] as string[],
      pieSeries: [] as number[],
      processPieLoading: false,
      // Процесс загрузки изображений
      // Report
      total_calls: 0,
      total_clients: 0,
      users: [] as UserInterface[],
      usersSelected: null as UserInterface | null,

      fetchDataHistory: debounce(() => {
        this.historyProcessLoading = true
        const offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage

        const params: any = {
          count: this.dataTableHistory.itemsPerPage,
          offset,
          type: 'all' // Показать всю историю
        }

        // Формирую параметры сортировки
        this.dataTableHistory.sortBy.forEach((name: string, index: number) => {
          params[`sort_by[${name}]`] = this.dataTableHistory.sortDesc[index] ? 'desc' : 'asc'
        })

        if (this.assertObjectHasAttribute(this.$route.query, 'date_period')) {
          params.date_period = this.$route.query.date_period
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'creator_id')) {
          params.creator_id = this.$route.query.creator_id
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'status_id')) {
          params.status_id = this.$route.query.status_id
        }

        if (Array.isArray(this.filter.contact_created_at)) {
          if (this.filter.contact_created_at.length === 2) {
            params.contact_created_at = this.filter.contact_created_at.join(',')
          }
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'project_id')) {
          params.project_id = this.$route.query.project_id
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'group_ids')) {
          params.group_ids = this.$route.query.group_ids
        }

        if (this.assertObjectHasAttribute(this.$route.query, 'tag_ids')) {
          params.tag_ids = this.$route.query.tag_ids
        }

        new Statistics()
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
      }, 350)
    }
  },

  methods: {

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
          }).then(() => {
            this.fetchDataHistory()
          })
        } else {
          this.$routerQuery
            .removeQuery(['creator_id'])
            .then(() => {
              this.fetchDataHistory()
            })
        }
      })

      // Фильтрация по датам
      this.$watch('filter.date_period', (newVal: unknown & string) => {
        this.dataTableHistory.page = 1
        this.$routerQuery.setQuery({ date_period: newVal }).then(this.fetchDataHistory)
      })

      // Фильтрация по дате создания контактов
      this.$watch('filter.contact_created_at', (val: number[]) => {
        this.dataTableHistory.page = 1
        this.$routerQuery.setQuery({
          contact_created_at: val.join(',')
        }).then(() => {
          this.fetchDataHistory()
        })
      })

      // Фильтрация по проектам
      this.$watch('filter.project', (newVal: unknown & ProjectInterface) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            project_id: newVal.id
          }).then(this.fetchDataHistory)
        } else {
          this.$routerQuery.removeQuery([
            'project_id'
          ]).then(this.fetchDataHistory)
        }
      })

      // Фильтрация по группам
      this.$watch('filter.groups', (newVal: unknown & GroupInterface[]) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            group_ids: newVal.map((e: GroupInterface) => e.id).join(',')
          }).then(this.fetchDataHistory)
        } else {
          this.$routerQuery.removeQuery([
            'group_ids'
          ]).then(this.fetchDataHistory)
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
    },

    onPaginationChange (data: any) {
      this.dataTableHistory.pageStart = data.pageStart + 1
      this.dataTableHistory.pageStop = data.pageStop
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
        .setQuery({ date_period: dr })
        .then(() => {
          this.fetchDataHistory()
        })
    },

    secondsToHmsDigital (d: number) {
      return secondsToHmsDigital(d)
    },

    vDataTableItemClass (scope: any) {
      return 'v-dt-item'
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

    if (this.$routerQuery.hasQuery('status_id')) {
      this.$routerQuery.getQuery('status_id')
    }

    if (this.$routerQuery.hasQuery('project_id')) {
      promises.push(this.$refs.sProjectsAutocomplete.setDefault(this.$routerQuery.getQuery('project_id')))
    }

    if (this.$routerQuery.hasQuery('group_ids')) {
      promises.push(this.$refs.sGroupsAutocomplete.setDefault(this.$routerQuery.getQuery('group_ids')))
    }

    if (this.$routerQuery.hasQuery('tag_ids')) {
      const tag_ids = this.$routerQuery.getQuery<string>('tag_ids').split(',')
      this.filter.tags = tag_ids.map(value => +value)
    }

    if (this.$routerQuery.hasQuery('contact_created_at')) {
      const dateRange = this.$routerQuery.getQuery<string>('contact_created_at')
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
        this.fetchDataHistory() // Сначала загружаем данные для диаграммы
        this.initializeWatchForFilters() // Потом начинаем следить за изменением фильтров
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
        console.log('sss sort', sort)
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
        console.log(page)
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
