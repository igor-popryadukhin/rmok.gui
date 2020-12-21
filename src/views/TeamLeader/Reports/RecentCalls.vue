<template>
  <v-container class="pa-0 pt-5" fluid>
    <v-row>
      <v-col class="pt-0 pb-0">
        <div class="d-flex">
          <v-router-combo-box
            parent-route-name="team_leader_reports"
          >
            <template v-slot:item="scope">
              <v-list-item
                v-on="scope.on"
                :to="scope.item"
              >
                {{ scope.item.name }}
              </v-list-item>
            </template>
          </v-router-combo-box>
          <v-spacer/>
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
                  @click="menu = false"
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
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-row>
              <v-col
                cols="6"
              >
                <v-autocomplete
                  :label="$tc('Users')"
                  dense
                  outlined
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="6"
              >
                <v-autocomplete
                  :label="$tc('Tags')"
                  dense
                  outlined
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card outlined>
          <v-card-text>
            <v-row v-if="processLoading">
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
          v-model="page"
          :length="15"
          :total-visible="7"
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
            @click="loadData"
          >
            Выгрузить в Excel
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- Сортировка -->
        <div>
          <v-btn-toggle
            dense
          >
            <v-btn>
              {{ $tc('Date time') }}
            </v-btn>

            <v-btn>
              {{ $tc('Client') }}
            </v-btn>

            <v-btn>
              {{ $tc('Result') }}
            </v-btn>

            <v-btn>
              {{ $tc('Comment') }}
            </v-btn>

            <v-btn>
              {{ $tc('Call duration') }}
            </v-btn>

            <v-btn>
              {{ $tc('Manager') }}
            </v-btn>
          </v-btn-toggle>
        </div>
        <small class="grey--text">Варианты сортировки</small>

        <!-- Контакты -->
        <v-list two-line>
          <v-list-item-group
            active-class="pink--text"
            multiple
          >
            <template v-for="(item, index) in history_items">
              <v-list-item :key="item.title">
                <v-list-item-content>
                  <v-list-item-title>{{ item.contact.first_name }} {{ item.contact.last_name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ new Date(item.created_at * 1000).toLocaleString() }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-content>
                  <div class="d-flex">
                    <span class="label" :style="{'background-color': item.status_color}">
                      {{ item.status }}
                    </span>
                  </div>
                </v-list-item-content>

                <v-spacer />

                <!-- Manager -->
                <v-list-item-group>
                  <v-list-item-title>
                    {{ $tc('Manager') }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ item.owner.first_name }} {{ item.owner.last_name }}
                  </v-list-item-subtitle>
                </v-list-item-group>
              </v-list-item>

              <v-divider
                v-if="index < history_items.length - 1"
                :key="index"
              ></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
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
      page: null,
      options: {
        labels: []
      },

      processLoading: false, // Процесс загрузки изображений

      // Report
      total_calls: 0,
      total_clients: 0,
      history_count: 0,
      history_items: [],
      pieLabels: [] as string[],
      pieSeries: [] as number[],
      pieColors: [] as string[]
    }
  },

  watch: {
    // Отслеживаю изменения данных в filterDate
    filterDate (value: string | number | undefined) {
      console.log(value)
      switch (value) {
        case 'today': {
          this.$routerQuery.setQuery({ date: 'today' })
          this.onFilterDate('today')
          break
        }
        case 'yesterday': {
          this.$routerQuery.setQuery({ date: 'yesterday' })
          this.onFilterDate('yesterday')
          break
        }
        case 'this_week': {
          this.$routerQuery.setQuery({ date: 'this_week' })
          this.onFilterDate('this_week')
          break
        }
        case 'last_week': {
          this.$routerQuery.setQuery({ date: 'last_week' })
          this.onFilterDate('last_week')
          break
        }
        case 'month': {
          this.$routerQuery.setQuery({ date: 'month' })
          this.onFilterDate('month')
          break
        }
      }
    }
  },

  computed: {
    apexchartOptions (): any {
      return {
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
  },

  methods: {
    loadData (params = {}) {
      this.processLoading = true
      new Reports()
        .get(params)
        .then((report: any) => {
          this.total_calls = report.total_calls
          this.total_clients = report.total_clients
          this.history_count = report.history_count
          this.history_items = report.history_items || []

          // Pie chart
          this.pieLabels = report.pie_chart.labels || ['']
          this.pieSeries = report.pie_chart.series || [1]
          this.pieColors = report.pie_chart.colors || []
        }).finally(() => (this.processLoading = false))
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

      this.$routerQuery.setQuery({ date: dr })
        .then(() => {
          this.loadData({
            date: dr
          })
        })
    },

    onFilterDate (date: string) {
      this.loadData({
        date
      })
    }
  }
})
</script>

<style scoped>

</style>
