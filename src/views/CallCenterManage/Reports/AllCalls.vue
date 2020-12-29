<template>
  <v-container class="pa-0 pt-5" fluid>
    <v-row>
      <v-col class="pt-0 pb-0">
        <div class="d-flex">
          <v-router-combo-box
            pattern-route-name="call_center_manager_reports"
            style="max-width: 400px"
          >
            <template v-slot:item="scope">
              <v-list-item
                v-on="scope.on"
                :to="scope.item"
              >
                {{ $tc('route.' + scope.item.name) }}
              </v-list-item>
            </template>
            <template v-slot:selection="scope">
              {{ $tc('route.' + scope.item.name) }}
            </template>
          </v-router-combo-box>
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
                $tc('January | February | March | April | May | June | July | August | September | October | December', new Date().getMonth() - 1)
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
        <v-card outlined>
          <v-card-text class="d-flex justify-lg-space-between">
            <v-combobox
              v-model="usersSelected"
              :items="users"
              item-value="id"
                  :label="$tc('Users')"
              :disabled="(users || []).length === 0"
              clearable
              return-object
                  dense
                  outlined
              style="max-width: 350px"
              >
              <template v-slot:item="scope">
                <v-list-item v-on="scope.on">
                    <v-list-item-title>
                      {{ scope.item.first_name }} {{ scope.item.last_name }}
                    </v-list-item-title>
                  </v-list-item>
              </template>
              <template v-slot:selection="{ item }">
                {{ item.first_name }} {{ item.last_name }}
              </template>
            </v-combobox>
            <v-spacer />
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
                  style="max-width: 350px"
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
      <v-col>
        <v-card outlined>
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
      <v-col class="d-flex">
        <v-pagination
          v-model="dataTableHistory.page"
          :length="dataTableHistory.pages"
          total-visible="5"
        ></v-pagination>
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
        <!-- Контакты -->
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
          @pagination="onHistoryPaginationChange"
          dense
          fixed-header
          hide-default-footer
                    >
          <!-- slots item -->
          <template slot="item.created_at" slot-scope="{ item }">
            {{ new Date(item.created_at * 1000).toLocaleString() }}
          </template>
          <template slot="item.contact" slot-scope="{ item }">
            {{ item.contact.first_name }} {{ item.contact.last_name }}
          </template>
          <template slot="item.status" slot-scope="{ item }">
            <span class="label" :style="{'background-color': item.status_color}">
              {{ item.status }}
            </span>
          </template>
          <template slot="item.comment" slot-scope="{ item }">
            {{ item.comment || '-' }}
                </template>
          <template slot="item.duration" slot-scope="">
            00:00:00
          </template>
          <template slot="item.owner" slot-scope="{ item }">
            {{ item.owner.first_name }} {{ item.owner.last_name }}
          </template>
          <template slot="item.record" slot-scope="{ item }">
            <v-btn
              icon
              small
              :value="item"
            >
              <v-icon>mdi-play</v-icon>
            </v-btn>
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
import Vue from 'vue'

import VueApexCharts from 'vue-apexcharts'
import VRouterComboBox from '@/components/VRouterCombobox/VRouterComboBox.vue'
import Reports from '@/api/Reports'
import { format } from 'date-fns'
import Users, { UserInterface } from '@/api/Users'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default Vue.extend({

  components: {
    VRouterComboBox
  },

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
            text: 'Длительность',
            align: 'end',
            sortable: false,
            value: 'duration'
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
      loading: true,
      DtOptions: {}
    }
  },

  watch: {
    // Отслеживаю изменения данных в filterDate
    filterDate (value: string | number | undefined) {
      switch (value) {
        case 'today': {
          this.$routerQuery.setQuery({ date: 'today' })
          this.onFilterDate()
          break
        }
        case 'yesterday': {
          this.$routerQuery.setQuery({ date: 'yesterday' })
          this.onFilterDate()
          break
        }
        case 'this_week': {
          this.$routerQuery.setQuery({ date: 'this_week' })
          this.onFilterDate()
          break
        }
        case 'last_week': {
          this.$routerQuery.setQuery({ date: 'last_week' })
          this.onFilterDate()
          break
        }
        case 'month': {
          this.$routerQuery.setQuery({ date: 'month' })
          this.onFilterDate()
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
        legend: {
          show: true,
          position: 'right'
        },
        labels: this.pieLabels,
        colors: this.pieColors
      }
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

  methods: {
    fetchUsers () {
      new Users()
        .find({
          roles: 'r_operator',
          count: 1000
        })
        .then((response) => {
          this.users = response.items || []
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
      new Reports()
        .pie(this.$route.query)
        .then((report: any) => {
          this.total_calls = report.total_calls
          this.total_clients = report.total_clients

          // Pie chart
          this.pieLabels = report.pie_chart.labels || ['']
          this.pieSeries = report.pie_chart.series || [1]
          this.pieColors = report.pie_chart.colors || []
        }).finally(() => (this.processPieLoading = false))
    },

    // Загрузить историю
    fetchDataHistory () {
      this.historyProcessLoading = true
      const offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage
      new Reports()
        .history(Object.assign({ offset, count: this.dataTableHistory.itemsPerPage }, this.$route.query))
        .then((response: any) => {
          this.dataTableHistory.totalCount = response.count || 0
          this.dataTableHistory.pages = Math.ceil(response.count / this.dataTableHistory.itemsPerPage)
          this.dataTableHistory.items = response.items || []
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
    }
  }
})
</script>

<style scoped>

</style>
