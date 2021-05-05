<template>
  <v-card
    flat
    tile
  >
    <v-row>
      <v-col class="d-flex">
        <v-spacer/>
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
      </v-col>
    </v-row>

    <!-- Date range -->
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

      <v-col
        class="py-0"
        cols="12"
      >
        <s-contact-tags
          v-model="filter.tags"
          :label="$tc('Tags')"
          clearable
          outlined
          dense
          multiple
        />
      </v-col>
    </v-row>

    <!-- CHART -->
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
  </v-card>
</template>

<script lang="ts">

import { Contacts } from '@/api/Contacts'
import { GroupInterface } from '@/api/Groups'
import Statistics from '@/api/Statistics'
import { ContactTagInterface } from '@/api/Schemas/ContactInterface'
import { UserInterface } from '@/api/Users'
import AppBtnToggleDate from '@/components/AppBtnToggleDate/AppBtnToggleDate.vue'
import dateRangeCollection from '@/mixins/dateRangeCollection'
import SContactTags from '@/snippets/SContactTags/SContactTags.vue'
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
  components: { AppBtnToggleDate, SContactTags, SGroups, SUsers },

  mixins: [dateRangeCollection],

  computed: {
    apexchartOptions (): any {
      return {
        chart: {

          // Повторно визуализируйте диаграмму при изменении размера элемента или размера родительского элемента.
          // Полезно в условиях, когда размер контейнера диаграммы изменяется после перезагрузки страницы.
          redrawOnParentResize: true,

          // Выполните повторную визуализацию диаграммы при изменении размера окна, в котором отображается диаграмма.
          // Полезно при рендеринге диаграммы в окнах iframe.
          redrawOnWindowResize: true,
          type: 'bar',
          width: 5000,
          zoom: {
            enabled: false
          }
        },
        legend: {
          position: 'left',
          show: false
        },

        noData: {
          align: 'center',
          offsetX: 0,
          offsetY: 0,
          style: {
            color: undefined,
            fontFamily: undefined,
            fontSize: '16px'
          },
          text: this.$tc('No data'),
          verticalAlign: 'middle'
        },

        plotOptions: {
          bar: {
            barHeight: 90,
            columnWidth: 90,
            dataLabels: {
              hideOverflowingLabels: false,
              maxItems: 100,
              orientation: 'horizontal',
              position: 'bottom'
            },
            distributed: true,
            horizontal: false,
            rangeBarGroupRows: false,
            rangeBarOverlap: false
          }
        },
        // Точка останова - это максимальная ширина экрана, при которой исходный объект конфигурации будет
        // переопределен объектом конфигурации
        responsive: [
          {
            breakpoint: undefined,
            options: {}
          }
        ]
      }
    },

    chartHeight () {
      if (this.$screenHeight < 900) {
        return 500
      }
      return this.$screenHeight - 200
    }
  },

  data () {
    return {
      apexSeries: [{
        data: []
      }],
      contactDateCreated: null,
      dateRange: null as string[] | null,
      filter: {
        date_period: null as unknown & string | null,
        groups: [] as unknown & GroupInterface[],
        users: [] as unknown & UserInterface[],
        tags: [] as unknown & ContactTagInterface[]
      },
      filterDate: undefined,

      historyProcessLoading: false,
      history_count: 0,
      itemsPerPage: 10,

      menuContactDateCreated: null as boolean | null,

      menuDateRange: null,

      options: {
        labels: []
      },
      page: 1,
      pageCount: 0,
      pieColors: [] as string[],
      pieLabels: [] as string[],
      processPieLoading: false,
      // Процесс загрузки изображений
      // Report
      total_calls: 1,
      // todo: временно
      total_clients: 0,
      users: [] as UserInterface[],

      fetchDiagramData: debounce(() => {
        this.historyProcessLoading = true

        const params: any = {
          type: 'all' // Показать всю историю
        }

        if (this.$routerQuery.hasQuery('date_period')) {
          params.date_period = this.$route.query.date_period
        }

        if (this.$routerQuery.hasQuery('user_ids')) {
          params.user_ids = this.$route.query.user_ids
        }

        if (this.$routerQuery.hasQuery('group_ids')) {
          params.group_ids = this.$route.query.group_ids
        }

        if (this.$routerQuery.hasQuery('tag_ids')) {
          params.tag_ids = this.$routerQuery.getQuery<string>('tag_ids')
        }

        new Statistics()
          .callCount<any, any>(params)
          .then((response) => {
            const responseArray: any = response.data

            this.apexSeries = []
            this.apexSeries.push({
              data: responseArray.map((e: any) => {
                return {
                  x: `${e.first_name} ${e.last_name}`,
                  y: e.total
                }
              })
            })
          }).finally(() => (this.historyProcessLoading = false))
      }, 350)
    }
  },

  methods: {
    /**
     * Инициализировать слежение за изменением фильтров
     */
    initializeWatchForFilters () {
      // Фильтрация по пользователям
      this.$watch('filter.users', (newVal: unknown & UserInterface[]) => {
        if (Array.isArray(newVal)) {
          this.$routerQuery.setQuery({
            user_ids: newVal.map((e: UserInterface) => e.id).join(',')
          }).then(() => {
            this.fetchDiagramData()
          })
        } else {
          this.$routerQuery
            .removeQuery(['user_ids'])
            .then(() => {
              this.fetchDiagramData()
            })
        }
      })

      // Фильтрация по группам
      this.$watch('filter.groups', (newVal: unknown & GroupInterface[]) => {
        if (newVal) {
          this.$routerQuery.setQuery({
            group_ids: newVal.map((e: GroupInterface) => e.id).join(',')
          }).then(this.fetchDiagramData)
        } else {
          this.$routerQuery.removeQuery([
            'group_ids'
          ]).then(this.fetchDiagramData)
        }
      })

      // Фильтрация по датам
      this.$watch('filter.date_period', (newVal: unknown & string) => {
        this.$routerQuery.setQuery({ date_period: newVal }).then(this.fetchDiagramData)
      })

      // Фильтрация по тегам контактов
      this.$watch('filter.tags', (newVal: unknown & ContactTagInterface[]) => {
        if (Array.isArray(newVal)) {
          this.$routerQuery.setQuery({
            tag_ids: newVal.map((e: ContactTagInterface) => e.id).join(',')
          }).then(() => {
            this.fetchDiagramData()
          })
        } else {
          this.$routerQuery
            .removeQuery(['tag_ids'])
            .then(() => {
              this.fetchDiagramData()
            })
        }
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

      this.$routerQuery.setQuery({ date_period: dr }).finally(() => (this.fetchDiagramData()))
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

    if (this.$routerQuery.hasQuery('user_ids')) {
      promises.push(this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('user_ids')))
    }

    if (this.$routerQuery.hasQuery('group_ids')) {
      promises.push(this.$refs.sGroupsAutocomplete.setDefault(this.$routerQuery.getQuery('group_ids')))
    }

    // Восстановление фильтра тегов после перезагрузки
    if (this.$routerQuery.hasQuery('tag_ids')) {
      promises.push(new Promise<void>(resolve => {
        new Contacts()
          .getTags({
            tag_ids: this.$routerQuery.getQuery<string>('tag_ids')
          }).then(response => {
            this.$data.filter.tags = response?.data || []
          }).finally(() => (resolve()))
      }))
    }

    // Инициализирую слежку за состоянием фильтров после того как будут проинициализированы все фильтры
    // Загружаю данные после инициализации фильтров
    Promise.all(promises)
      .finally(() => {
        this.fetchDiagramData() // Сначала загружаем данные для диаграммы
        this.initializeWatchForFilters() // Потом начинаем следить за изменением фильтров
      })
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
