<template>
  <div>
    <v-row>
      <v-col class="py-0">
        <v-card tile flat outlined>
          <v-card-text>
            <v-data-table
              :headers="dataTableHistory.headers"
              :items="dataTableHistory.items"
              :server-items-length="dataTableHistory.totalCount"
              :page.sync="dataTableHistory.page"
              :items-per-page="dataTableHistory.itemsPerPage"
              item-key="id"
              :options.sync="dataTableHistory.options"
              :loading="dataTableHistory.processLoading"
              locale="ru"
              :no-data-text="$tc('No data')"
              :height="dataTableHistoryHeight"
              item-class="row-item"
              dense
              fixed-header
              hide-default-footer
              @pagination="onPaginationChange"
            >

              <!-- slots item -->
              <template slot="item.direction" slot-scope="{ item }">
                <app-call-direction
                  :direction="item.direction"
                  :cause="item.cause"
                  :originator="item.originator"
                />
              </template>

              <template slot="item.session_duration" slot-scope="{ item }">
                {{ secondsToHmsDigital(item.session_duration) }}
              </template>

              <template slot="item.call_duration" slot-scope="{ item }">
                {{ secondsToHmsDigital(item.call_duration) }}
              </template>

              <template slot="item.created_at" slot-scope="{ item }">
                {{ new Date(item.created_at * 1000).toLocaleString() }}
              </template>
              <template slot="item.status" slot-scope="{ item }">
                {{ item.id }} / {{ item.direction }} / {{ item.originator }} / {{ item.cause }}
              </template>
              <template slot="item.comment" slot-scope="{ item }">
                {{ item.comment || '-' }}
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
            <v-footer color="white">
              <v-pagination
                v-model="dataTableHistory.page"
                :length="dataTableHistory.pages"
                total-visible="5"
                class="mr-5"
              ></v-pagination>
              <div class="align-self-center">
                {{ dataTableHistory.pageStart }}-{{ dataTableHistory.pageStop }} из {{ dataTableHistory.totalCount }}
              </div>
            </v-footer>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { UserInterface } from '@/api/Users'
import { secondsToHmsDigital } from '@/utils/datetime'
import ContactHistory from '@/api/ContactHistory'
import audioPlayer from '@/mixins/audioPlayer'
import VInterface from '@/VInterface'
import { Contacts } from '@/api/Contacts'
import AppCallDirection from '@/components/AppCallDirection/AppCallDirection.vue'

interface IData {
  [key: string]: string;
}

interface VInnerInterface extends VInterface {
  $data: IData;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: { AppCallDirection },
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
      let h: number = this.$screenHeight - 180
      if (h < 640) {
        h = 640
      }
      return h
    }
  },

  data () {
    return {
      // Data table
      dataTableHistory: {
        headers: [
          {
            align: 'start',
            class: 'header-direction',
            sortable: false,
            text: '#',
            value: 'direction'
          },
          {
            align: 'start',
            class: 'header-target',
            sortable: false,
            text: 'Номер',
            value: 'target'
          },
          {
            align: 'start',
            class: 'header-session-duration',
            sortable: false,
            text: 'Длительность сессии',
            value: 'session_duration'
          },
          {
            align: 'start',
            class: 'header-call-duration',
            sortable: false,
            text: 'Длительность разговора',
            value: 'call_duration'
          },
          {
            align: 'start',
            class: 'header-created-at',
            sortable: false,
            text: 'Дата и время',
            value: 'created_at'
          },
          {
            align: 'end',
            class: 'header-audio-record',
            sortable: false,
            text: 'Запись',
            value: 'record'
          }
          // {
          //   text: 'Клиент',
          //   sortable: true,
          //   value: 'contact'
          // },
          // {
          //   text: 'Результат',
          //   sortable: true,
          //   value: 'status'
          // }
          // {
          //   text: 'Комментарий',
          //   align: 'start',
          //   sortable: false,
          //   value: 'comment'
          // },
          // {
          //   text: 'Длительность разговора',
          //   align: 'end',
          //   sortable: false,
          //   value: 'call_duration'
          // },
          // {
          //   text: 'Общее время сессии',
          //   align: 'end',
          //   sortable: false,
          //   value: 'session_duration'
          // },
          // {
          //   text: 'Менеджер',
          //   sortable: false,
          //   value: 'owner'
          // },
          // {
          //   text: 'Запись',
          //   align: 'end',
          //   sortable: false,
          //   value: 'record'
          // }
        ],
        items: [],
        itemsPerPage: 50,
        options: {},
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 1,
        processLoading: false,
        totalCount: 0
      },

      dateRange: null as string[] | null,

      loading: true,

      menuContactDateCreated: null as boolean | null,
      menuDateRange: null
    }
  },

  methods: {

    // Загрузить историю
    fetchDataHistory () {
      this.dataTableHistory.processLoading = true
      const offset = (this.dataTableHistory.itemsPerPage * this.dataTableHistory.page) - this.dataTableHistory.itemsPerPage

      const params: any = {
        count: this.dataTableHistory.itemsPerPage,
        offset,
        type: 'all' // Показать всю историю
      }

      new Contacts()
        .getHistory<{ count: number }, any>(+this.$route.params.contact_id, params)
        .then((response) => {
          this.dataTableHistory.totalCount = response.meta.count
          this.dataTableHistory.pages = Math.ceil(response.meta.count / this.dataTableHistory.itemsPerPage)
          this.dataTableHistory.items = response.data
        }).finally(() => (this.dataTableHistory.processLoading = false))
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
    }
  },

  mixins: [audioPlayer],

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
    },

    usersSelected: {
      handler (user: UserInterface | null) {
        if (user) {
          this.$routerQuery.setQuery({
            owner_id: user.id
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
      }
    }
  }
})
</script>

<style lang="scss">
  table tr td {
    white-space: nowrap;
  }

  .header {
    &-direction {
      white-space: nowrap !important;
      width: 1px !important;
    }
    &-target {
      white-space: nowrap !important;
      width: 100% !important;
    }
    &-session-duration {
      //white-space: nowrap !important;
    }
    &-call-duration {
      //white-space: nowrap !important;
    }
    &-audio-record {
      //white-space: nowrap !important;
    }
    &-created-at {
      white-space: nowrap !important;
      width: auto !important;
    }
  }

  .row-item {
    background-color: #3a70d4;
  }
</style>
