<template>
  <v-sheet>
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
                    <template v-if="item.owner">
                      <span class="black--text">{{ item.owner.full_name }}</span>
                    </template>
                    <template v-else>
                      —
                    </template>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle @click="onAppContactHistoryCommentDialogEdit(item.id)">
                    <span class="black--text">
                      {{ item.comment || '—' }}
                    </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-tooltip
                      v-if="item.status"
                      open-delay="500"
                      color="primary"
                      bottom
                    >
                      <template #activator="{on, attrs}">
                        <v-chip
                          v-bind="attrs"
                          :color="item.status.color"
                          label
                          outlined
                          x-small
                          @click.stop="onListItemEditClick(item.id)"
                          v-on="on"
                        >
                          {{ item.status.name }}
                        </v-chip>
                      </template>
                      <span>{{ $tc('Click on an item to change') }}</span>
                    </v-tooltip>
                    <v-chip
                      v-else
                      :color="item.status.color"
                      label
                      outlined
                      x-small
                      @click.stop="onListItemEditClick(item.id)"
                    >
                      {{ $tc('Status not set') }}
                    </v-chip>
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
                  small
                  @click="onPlayClick(item)"
                >
                  <v-icon>mdi-play</v-icon>
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

    <!-- Диалог изменения статуса -->
    <template v-if="appContactHistoryDialogEdit.visible">
      <app-contact-history-status-dialog-edit
        v-model="appContactHistoryDialogEdit.statusId"
        :visible.sync="appContactHistoryDialogEdit.visible"
        :items="appContactHistoryDialogEdit.items"
        outlined
        @btn:cancel="appContactHistoryDialogEdit.visible = false"
        @btn:save="onAppContactHistoryDialogEditSave"
      />
    </template>
    <!-- Диалог изменения статуса -->

    <!-- Диалог изменения комментария -->
    <template v-if="appContactHistoryCommentEdit.visible">
      <app-contact-history-comment-dialog-edit
        v-model="appContactHistoryCommentEdit.comment"
        :visible.sync="appContactHistoryCommentEdit.visible"
        @btn:cancel="appContactHistoryCommentEdit.visible = false"
        @btn:save="onAppContactHistoryCommentDialogEditSave"
      />
    </template>
    <!-- Диалог изменения комментария -->
  </v-sheet>
</template>

<script lang="ts">
import ContactHistory from '@/api/ContactHistory'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { secondsToHmsDigital } from '@/utils/datetime'
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
  components: {
    AppContactHistoryStatusDialogEdit: () => import('@/components/AppContactHistoryStatusDialogEdit/AppContactHistoryStatusDialogEdit.vue'),
    AppContactHistoryCommentDialogEdit: () => import('@/components/AppContactHistoryCommentDialogEdit/AppContactHistoryCommentDialogEdit.vue'),
    AppLoading
  },

  data () {
    return {
      appContactHistoryDialogEdit: {
        visible: false,
        contactHistoryId: 0,
        statusId: 0,
        items: []
      },

      appContactHistoryCommentEdit: {
        visible: false,
        historyId: 0,
        comment: ''
      },

      processItemsEdit: [] as number[],
      buttonsHover: [],
      buttonsHoverIndex: -1,
      comment: {
        buttonSave: {
          loading: false
        },
        disabled: false,
        text: ''
      },
      history: [] as ContactHistory[],
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

    onAppContactHistoryDialogEditSave () {
      new Contacts()
        .editHistory(this.appContactHistoryDialogEdit.contactHistoryId, {
          status_id: this.appContactHistoryDialogEdit.statusId
        })
        .then(() => {
          this.$toast.success('Changes accepted')
        }).finally(() => (this.appContactHistoryDialogEdit.visible = false))
    },

    /**
     * @param id идентификатор записи истории истории
     */
    onAppContactHistoryCommentDialogEdit (id: number) {
      new Contacts()
        .getHistoryById(id)
        .then((response) => {
          this.appContactHistoryCommentEdit.historyId = response.id
          this.appContactHistoryCommentEdit.comment = response.comment
          this.appContactHistoryCommentEdit.visible = true
        }).finally(() => {
          const index = this.processItemsEdit.indexOf(id)
          if (index > -1) {
            this.processItemsEdit.splice(index, 1)
          }
        })
    },

    onAppContactHistoryCommentDialogEditSave () {
      new Contacts()
        .editHistory(this.appContactHistoryCommentEdit.historyId, {
          comment: this.appContactHistoryCommentEdit.comment
        })
        .then(() => {
          this.$toast.success('Changes accepted')
        }).finally(() => (this.appContactHistoryCommentEdit.visible = false))
    },

    /**
     * Событие происходит, когда нажали на кнопку изменить историю.
     * @param id идентификатор истории.
     */
    onListItemEditClick (id: number) {
      this.processItemsEdit.push(id)
      new Contacts()
        .getHistoryById(id)
        .then((response) => {
          this.appContactHistoryDialogEdit.contactHistoryId = response.id
          this.appContactHistoryDialogEdit.visible = true
          this.appContactHistoryDialogEdit.statusId = response.status?.id

          const statuses = []
          for (const statusesElement of response.project?.statuses) {
            for (const child of statusesElement.children) {
              statuses.push(child)
            }
          }

          this.appContactHistoryDialogEdit.items = statuses
        }).finally(() => {
          const index = this.processItemsEdit.indexOf(id)
          if (index > -1) {
            this.processItemsEdit.splice(index, 1)
          }
        })
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
