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
      <v-col
        class="pt-0"
      >
        <v-card
          tile
          flat
          outlined
        >
          <v-card-text>
            <v-row>
              <v-col
                class="py-0"
                md="6"
                lg="6"
                sm="12"
                xs="12"
              >
                <s-users
                  ref="sUsersAutocomplete"
                  v-model="filter.users"
                  :label="$tc('Users')"
                  :params="{ role_use: 'for_calls' }"
                  multiple
                  outlined
                  dense
                  clearable
                />
              </v-col>

              <v-col
                class="py-0"
                md="6"
                lg="6"
                sm="12"
                xs="12"
              >
                <s-groups
                  ref="sGroupsAutocomplete"
                  v-model="filter.groups"
                  :label="$tc('Groups')"
                  dense
                  outlined
                  multiple
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- CHART -->
    <v-row>
      <v-col
        class="py-0"
      >
        <v-card
          tile
          flat
          outlined
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
              >
                <v-card-text class="overflow-auto">
                  <apexchart
                    :height="chartHeight"
                    type="bar"
                    :options="apexchartOptions"
                    :series="apexSeries"
                  />
                </v-card-text>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">

import { GroupInterface } from '@/api/Groups'
import { UserInterface } from '@/api/Users'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import VInterface from '@/VInterface'
import { format } from 'date-fns'
import Vue, { VueConstructor } from 'vue'

import VueApexCharts from 'vue-apexcharts'
import { debounce } from 'vuetify/src/util/helpers'

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

export default (Vue as VueConstructor<VInterface>).extend({
  components: { SGroups, SUsers },

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
      total_calls: 1, // todo: временно
      total_clients: 0,
      history_count: 0,
      historyProcessLoading: false,
      pieLabels: [] as string[],
      apexSeries: [
        {
          name: 'Заполнение карточки',
          data: [1, 21, 2]
        }, {
          name: 'Слушает гудки',
          data: [1, 22, 0]
        }, {
          name: 'В разговоре',
          data: [1, 4, 0]
        }, {
          name: 'В режиме ожидания',
          data: [1, 0, 43]
        }
      ],

      users: [] as UserInterface[],

      filter: {
        date: null as unknown & string | null,
        users: [] as unknown & UserInterface[],
        groups: [] as unknown & GroupInterface[]
      }
    }
  },

  computed: {
    apexchartOptions (): any {
      return {
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40
        },
        chart: {
          type: 'bar',
          height: 350,
          stacked: true,
          stackType: '100%'
        },
        xaxis: {
          categories: ['Игорь', 'Вася', 'Женя'],
          labels: {
            formatter: function (val) {
              return val + 'K'
            }
          }
        },
        noData: {
          text: this.$tc('No data'),
          align: 'center',
          verticalAlign: 'middle',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontSize: '16px',
            fontFamily: undefined
          }
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        }
      }
    },

    chartHeight () {
      if (this.$screenHeight < 900) {
        return 500
      }
      return this.$screenHeight - 370
    }
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

    if (this.$routerQuery.hasQuery('target_users')) {
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('target_users')))
    }

    if (this.$routerQuery.hasQuery('target_groups')) {
      promises.push(this.$refs.sGroupsAutocomplete.setDefault(this.$routerQuery.getQuery('target_groups')))
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаю данные после инициализации фильтров
    Promise.all(promises)
      .finally(() => {
        this.fetchDiagramData() // Сначала загружаем данные для диаграммы
        this.initializeWatchForFilters() // Потом начинаем следить за изменением фильтров
      })
  },

  methods: {

    // Загрузить данные для построения диаграммы
    fetchDiagramData () {
      this.historyProcessLoading = true

      const params: any = {
        type: 'all' // Показать всю историю
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'date')) {
        params.date = this.$route.query.date
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'target_users')) {
        params.target_users = this.$route.query.target_users
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'target_groups')) {
        params.target_groups = this.$route.query.target_groups
      }

      // new Reports()
      //   .activity<any, any>(params)
      //   .then((response) => {
      //     const responseArray: any = response.data
      //
      //     // this.apexSeries = []
      //     // this.apexSeries.push({
      //     //   name: 'Marine Sprite',
      //     //   data: [44, 55, 41, 37, 22, 43, 21]
      //     // })
      //   }).finally(() => (this.historyProcessLoading = false))
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

      this.$routerQuery.setQuery({ date: dr }).finally(() => (this.fetchDiagramData()))
    },

    /**
     * Инициализировать слежение за изменением фильтров
     */
    initializeWatchForFilters () {
      const debounceDelay = 500 // Задержка выполнения загрузки данных (избавит от дребезга)

      // Фильтрация по пользователям
      this.$watch('filter.users', debounce((newVal: unknown & UserInterface[]) => {
        if (Array.isArray(newVal)) {
          this.$routerQuery.setQuery({
            target_users: newVal.map((e: UserInterface) => e.id)
          }).then(() => {
            this.fetchDiagramData()
          })
        } else {
          this.$routerQuery
            .removeQuery(['target_users'])
            .then(() => {
              this.fetchDiagramData()
            })
        }
      }, debounceDelay))

      // Фильтрация по группам
      this.$watch('filter.groups', debounce((newVal: unknown & GroupInterface[]) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            target_groups: newVal.map((e: GroupInterface) => e.id)
          }).then(this.fetchDiagramData)
        } else {
          this.$routerQuery.removeQuery([
            'target_groups'
          ]).then(this.fetchDiagramData)
        }
      }, debounceDelay))

      // Фильтрация по датам
      this.$watch('filter.date', debounce((newVal: unknown & string) => {
        switch (newVal) {
          case 'today': {
            this.$routerQuery.setQuery({ date: 'today' }).then(this.fetchDiagramData)
            break
          }
          case 'yesterday': {
            this.$routerQuery.setQuery({ date: 'yesterday' }).then(this.fetchDiagramData)
            break
          }
          case 'this_week': {
            this.$routerQuery.setQuery({ date: 'this_week' }).then(this.fetchDiagramData)
            break
          }
          case 'last_week': {
            this.$routerQuery.setQuery({ date: 'last_week' }).then(this.fetchDiagramData)
            break
          }
          case 'month': {
            this.$routerQuery.setQuery({ date: 'month' }).then(this.fetchDiagramData)
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
