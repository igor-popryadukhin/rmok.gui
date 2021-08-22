<template>
  <v-list dense>
    <template v-if="isListEmpty && historyLoading === true">
      <div class="d-flex align-center justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="isListEmpty && historyLoading === false">
      <v-list-item
        class="justify-center"
        style="height: 50vh"
      >
        <span class="grey--text">{{ $tc('There are no calls for this contact') }}</span>
      </v-list-item>
    </template>
    <template v-else>
      <template v-for="(item, index) in history">
        <v-list-item
          :key="`v-list-item-${index}`"
          link
          three-line
          @mousemove="buttonsHoverIndex = index"
        >
          <v-list-item-avatar>
            <!-- Incoming call -->
            <v-tooltip
              v-if="item.type === 'call' && item.direction === 'incoming'"
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-phone-incoming
                </v-icon>
              </template>
              <span>{{ $tc('Incoming call') }}</span>
            </v-tooltip>

            <!-- Incoming call canceled -->
            <v-tooltip
              v-else-if="item.type === 'call' && item.direction === 'incoming_canceled'"
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  color="red"
                  v-on="on"
                >
                  mdi-phone-incoming
                </v-icon>
              </template>
              <span>{{ $tc('Incoming call canceled') }}</span>
            </v-tooltip>

            <!-- Outgoing call -->
            <v-tooltip
              v-else-if="item.type === 'call' && item.direction === 'outgoing'"
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  v-on="on"
                >
                  mdi-phone-outgoing
                </v-icon>
              </template>
              <span>{{ $tc('Outgoing call') }}</span>
            </v-tooltip>

            <!-- Outgoing call canceled -->
            <v-tooltip
              v-else-if="item.type === 'call' && item.direction === 'outgoing_canceled'"
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  color="red"
                  v-on="on"
                >
                  mdi-phone-outgoing
                </v-icon>
              </template>
              <span>{{ $tc('Outgoing call canceled') }}</span>
            </v-tooltip>

            <!-- Missed -->
            <v-tooltip
              v-else-if="item.type === 'call' && item.direction === 'missed'"
              bottom
            >
              <template #activator="{ on, attrs }">
                <v-icon
                  v-bind="attrs"
                  color="red"
                  v-on="on"
                >
                  mdi-phone-missed
                </v-icon>
              </template>
              <span>{{ $tc('Missed call') }}</span>
            </v-tooltip>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              <span
                class="mr-2 black--text"
                style="letter-spacing: 1.2px; font-weight: 500;"
              >
                {{ item.target || '—' }}
              </span>
            </v-list-item-title>
            <div class="d-flex justify-start">
              <div>
                <v-list-item-subtitle>
                  <span class="grey--text">{{ $tc('Duration') }}:</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="grey--text">{{ $tc('Comment') }}:</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="grey--text">{{ $tc('Manager') }}:</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="grey--text">{{ $tc('Result') }}:</span>
                </v-list-item-subtitle>
              </div>
              <div class="ml-3">
                <v-list-item-subtitle>
                  <span class="black--text">{{ secondsToHmsDigital(item.call_duration) }}</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span class="black--text">{{ item.comment || '—' }}</span>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <template v-if="item.creator">
                    <span class="black--text">{{ item.creator.first_name }} {{ item.creator.last_name }}</span>
                  </template>
                  <template v-else>
                    —
                  </template>
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  <span
                    v-if="item.status"
                    class="label"
                    :style="{ 'background-color': item.status.color }"
                  >
                    {{ item.status.name }}
                  </span>
                  <span
                    v-else
                    class="label label-outlined label-color-grey"
                  >
                    {{ $tc('Status not set') }}
                  </span>
                </v-list-item-subtitle>
              </div>
            </div>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text v-text="$dayjs(item.created_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`)" />
            <div class="d-flex flex-wrap">
              <v-btn
                :key="`v-list-item-action-play-${index}`"
                :loading="item.actions.playing.loading"
                icon
                @click="onPlayClick(item)"
              >
                <v-icon>mdi-play</v-icon>
              </v-btn>
              <v-btn
                :key="`v-list-item-action-${index}`"
                icon
                :loading="item.actions.edit.loading"
                @click.stop="onShowDialogCallEdit(item)"
              >
                <v-icon>mdi-pencil-box-outline</v-icon>
              </v-btn>
            </div>
          </v-list-item-action>
        </v-list-item>

        <v-divider
          :key="`v-divider-${index}`"
          inset
        />
      </template>
    </template>
  </v-list>
</template>

<script lang="ts">
import ContactHistory from '@/api/ContactHistory'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import DTextarea from '@/components/Dialogs/DTextarea.vue'
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { secondsToHmsDigital } from '@/utils/datetime'
import VStatusEditDialog, { StatusInterface } from '@/components/VStatusEditDialog/VStatusEditDialog.vue'
import { mapGetters } from 'vuex'
import { debounce } from 'vuetify/src/util/helpers'

interface Data {
  [key: string]: any;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  [key: string]: any;
}

interface Props {
  [key: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  components: { AppLoading },

  data () {
    return {
      buttonsHover: [],
      buttonsHoverIndex: -1,
      comment: {
        buttonSave: {
          loading: false
        },
        disabled: false,
        text: ''
      },
      history: [],
      historyLoading: false
    }
  },

  computed: {
    ...mapGetters({
      database_statuses: 'database/statuses_grouped'
    }),

    isListEmpty () {
      return this.history.length === 0
    }
  },

  created () {
    if (this.$route.query.filter) {
      this.historyFilter.selected = this.historyFilter.items.find((e) => e.value === this.$route.query.filter)?.value
    }
    this.loadHistory()

    this.onSSEContactHistoryChanged = debounce(this.onSSEContactHistoryChanged, 1000)

    this.$root.$on('sse-contact-history-changed', this.onSSEContactHistoryChanged)
  },

  beforeDestroy () {
    this.$root.$off('sse-contact-history-changed', this.onSSEContactHistoryChanged)
  },

  methods: {

    /**
     * Загружает историю контакта
     */
    loadHistory () {
      this.historyLoading = true

      const params: Record<string, string | number> = {}

      params.type = 'all'
      params.offset = 0
      params.count = 100

      new Contacts()
        .getHistory(+this.$route.params.contact_id, params)
        .then((response) => {
          this.history = response.data.map((e: any) => {
            return Object.assign({
              actions: {
                playing: {
                  loading: false
                },
                edit: {
                  loading: false
                }
              }
            }, e)
          })
        }).finally(() => {
          this.historyLoading = false
        })
    },

    onSSEContactHistoryChanged () {
      this.loadHistory()
    },

    onShowDialogCallEdit ({ id, comment, actions, status }: any) {
      const contact_id = +this.$route.params.contact_id
      if (this.database_statuses.length > 0) {
        this.$dialog.show(VStatusEditDialog, {
          comment,
          height: '600',
          onSave: ({ status, comment }: StatusInterface) => {
            actions.edit.loading = true
            new Contacts()
              .updateHistory(id, {
                comment,
                status_id: status.id
              }).then(() => {
                this.loadHistory()
              }).finally(() => {
                actions.edit.loading = false
              })
          },

          // Statuses in current project
          statusId: status?.id || 0,

          statuses: this.database_statuses,

          waitForResult: true,
          width: '60%'
        }).finally(() => (actions.edit.loading = false))
      } else {
        this.$toast.warning(this.$tc('The status cannot be set, because the project is configured incorrectly!'))
      }
    },

    onPlayClick (item: unknown & { id: number; creator: unknown & { first_name: string; last_name: string }, contact: unknown & { first_name: string; last_name: string } }) {
      item.actions.playing.loading = true
      new ContactHistory()
        .getAudioFile(item.id)
        .then((response: any) => {
          this.$root.$emit('on-audio-player-show', {
            src: response.url,
            author: `${item.creator.first_name} ${item.creator.last_name} - ${item.contact.last_name} ${item.contact.first_name}`
          })
        }).catch((e) => {
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        }).finally(() => {
          item.actions.playing.loading = false
        })
    },

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    },

    /**
     * Метод предназначен для обновления всего компонента
     */
    update () {
      this.loadHistory()
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
