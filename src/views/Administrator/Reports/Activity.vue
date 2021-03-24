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

    <!-- Фильтры -->
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
                cols="12"
              >
                <s-users
                  ref="sUsersAutocomplete"
                  v-model="filter.users"
                  :label="$tc('Employees')"
                  :params="{ role_use: 'for_calls' }"
                  multiple
                  outlined
                  dense
                  clearable
                />
              </v-col>
              <v-col
                class="py-0"
                cols="12"
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
              <v-col
                class="py-0"
                cols="12"
              >
                <v-select
                  v-model="filter.actions.selected"
                  :label="$tc('Actions')"
                  :items="filter.actions.items"
                  :disabled="filter.users.length === 0"
                  item-value="type"
                  item-text="title"
                  multiple
                  outlined
                  dense
                  chips
                >
                  <template v-slot:selection="{ item, attrs, select }">
                    <v-chip
                      v-bind="attrs"
                      :input-value="select"
                      class="ma-1"
                      color="primary"
                      label
                      close
                      small
                      @click="select"
                      @click:close="filter.actions.chipRemove(item)"
                    >
                      {{ item.title }}
                    </v-chip>
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- CHART -->
    <v-row>
      <v-col
        class="pt-0"
      >
        <v-card
          tile
          flat
          outlined
        >
          <v-card-title class="grey--text">{{ $tc('Общее время') }}</v-card-title>
          <v-card-text
            v-if="apexRadialBarSeries.length === 0"
          >
            <div
              class="d-flex align-center justify-center"
              style="height: 250px"
            >
              <div>
                {{ $tc('No data') }}
              </div>
            </div>
          </v-card-text>
          <v-card-text
            v-else
            style="min-height: 250px"
          >
            <div class="d-flex justify-space-around">
              <template
                v-for="(item, key) in apexRadialBarSeries"
              >
                <div
                  :key="key"
                >
                  <apexchart
                    type="radialBar"
                    height="240"
                    :options="item.options"
                    :series="item.series"
                  />
                  <div class="text-center" style="font-size: 16px">
                    {{ item.percent.toFixed(2) }}%
                  </div>
                </div>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        class="py-0"
      >
        <v-card
          tile
          flat
          outlined
        >
          <v-card-title class="grey--text">{{ $tc('По сотрудникам') }}</v-card-title>
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
  </v-container>
</template>

<script lang="ts">

import { GroupInterface } from '@/api/Groups'
import Reports from '@/api/Reports'
import { UserInterface } from '@/api/Users'
import SGroups from '@/snippets/SGroups/SGroups.vue'
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

      reportTypes: [] as unknown[] & { type: string, title: string }[],
      report: [] as any[],

      users: [] as UserInterface[],

      filter: {
        date: null as unknown & string | null,
        actions: {
          selected: [],
          items: [] as unknown & { title: string; value: string; }[],
          /**
           * Удалить чип
           */
          chipRemove: (item: unknown & {title: string; type: string;}) => {
            if (Array.isArray(this.filter.actions.selected) && item) {
              const index = this.filter.actions.selected.findIndex((e: string) => e === item.type)
              if (index >= 0) this.filter.actions.selected.splice(index, 1)
            } else {
              this.filter.actions.selected = []
            }
          }
        },
        users: [] as unknown & UserInterface[],
        groups: [] as unknown & GroupInterface[]
      }
    }
  },

  computed: {
    xSeries () {
      return this.report.map((value: any) => {
        return value.first_name + ' ' + value.last_name
      })
    },

    apexSeries () {
      const series: any[] = [] // Сюда буду складывать серии
      this.report.forEach((value: unknown & {activity: any[]; }) => {
        value.activity.forEach((value1: unknown & {type: string; title: string; seconds: number}) => {
          const index = series.findIndex(v => v.name === value1.type)
          if (index > -1) {
            series[index].data.push(value1.seconds)
          } else {
            series.push({
              name: value1.type,
              data: [value1.seconds]
            })
          }
        })
      })
      return series
    },

    apexRadialBarSeries () {
      const reducer = (accumulator: number, currentValue: number) => accumulator + currentValue

      // Для преобразование константы в читаемый вариант
      const dataLabelsFormatter = (val: string) => {
        let name = val
        for (let i = 0; i < this.reportTypes.length; i++) {
          if (val === this.reportTypes[i].type) {
            name = this.reportTypes[i].title
          }
        }
        return name
      }

      let total = 0
      this.apexSeries.forEach((value: unknown & { name: string; data: number[] }) => {
        total = total + value.data.reduce(reducer)
      })

      return this.apexSeries.map((value: unknown & { name: string; data: number[] }) => {
        const percent = (value.data.reduce(reducer) / total) * 100

        return {
          series: [value.data.reduce(reducer)],
          chart: {
            height: 280,
            type: 'radialBar'
          },
          options: {
            colors: ['#28bd76'],
            plotOptions: {
              radialBar: {
                startAngle: 0,
                endAngle: 360 * (Math.round(percent) / 100),
                hollow: {
                  margin: 0,
                  size: '70%',
                  background: '#133D8A'
                },
                track: {
                  show: true,
                  startAngle: 0,
                  endAngle: 360,
                  background: '#dedede',
                  strokeWidth: '97%',
                  opacity: 1,
                  margin: 5,
                  dropShadow: {
                    enabled: false,
                    top: 0,
                    left: 0,
                    blur: 3,
                    opacity: 0.5
                  }
                },
                dataLabels: {
                  name: {
                    show: true,
                    offsetY: -10,
                    color: '#fff',
                    fontSize: '13px',
                    formatter: dataLabelsFormatter
                  },
                  value: {
                    color: '#fff',
                    fontSize: '25px',
                    show: true,
                    formatter: function (val: number) {
                      return secondsToHmsDigital(val)
                    }
                  },
                  total: {
                    show: false,
                    offsetY: 100,
                    label: 'Total',
                    color: '#e52121',
                    fontSize: '16px',
                    fontFamily: undefined
                  }
                }
              }
            },
            fill: {
              type: 'gradient',
              gradient: {
                shade: 'dark',
                type: 'vertical',
                gradientToColors: ['#63ADD0'],
                stops: [0, 100]
              }
            },
            stroke: {
              lineCap: 'round'
            },
            labels: [value.name]
          },
          percent
        }
      })
    },

    apexchartOptions (): any {
      const formatter = (seriesName: string) => {
        let name = seriesName
        for (let i = 0; i < this.reportTypes.length; i++) {
          if (seriesName === this.reportTypes[i].type) {
            name = this.reportTypes[i].title
          }
        }
        return name
      }
      return {
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          offsetX: 40,
          formatter
        },
        tooltip: {
          y: {
            formatter: undefined,
            title: {
              formatter
            }
          }
        },
        chart: {
          type: 'bar',
          height: '250',
          stacked: true,
          stackType: '100%'
        },
        xaxis: {
          show: true,
          categories: [...this.xSeries],
          labels: {
            formatter: function (val: number) {
              return val + '%'
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
            horizontal: true,
            columnWidth: '70%',
            barHeight: '70%'
          },
          area: {
            fillTo: 'origin'
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

    if (this.$routerQuery.hasQuery('actions')) {
      this.filter.actions.selected = this.$routerQuery.getQuery('actions')
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

      if (this.assertObjectHasAttribute(this.$route.query, 'actions')) {
        params.actions = this.$route.query.actions
      }

      new Reports()
        .activity<any, any>(params)
        .then((response) => {
          this.reportTypes = response.meta.types
          this.filter.actions.items = response.meta.types
          this.report = response.data
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

      // Фильтрация по группам
      this.$watch('filter.actions.selected', debounce((newVal: string[]) => {
        if (Array.isArray(newVal)) {
          this.$routerQuery.setQuery({
            actions: newVal
          }).then(this.fetchDiagramData)
        } else {
          this.$routerQuery.removeQuery([
            'actions'
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
