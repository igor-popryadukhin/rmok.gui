<template>
  <v-container class="pa-0" fluid>
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <div v-if="history.length === 0 && historyLoading === true" class="d-flex align-center justify-center height-vh-50">
          <div class="grey--text">
            {{ $tc('Loading content...') }}
          </div>
        </div>
        <template v-else-if="history.length === 0 && historyLoading === false">
            <div class="d-flex align-center justify-center height-vh">
              <div class="grey--text">{{ $tc('There are no calls for this contact') }}</div>
            </div>
          </template>
        <template v-else>
          <v-list>
            <template v-for="(item, index) in history">
              <!-- Call -->
              <v-list-item
                v-if="item.type === 'call'"
                :key="`v-list-item-${index}`"
                link
                selectable
                color="red"
              >
                <v-list-item-avatar>

                  <!-- Incoming call -->
                  <v-tooltip
                    v-if="item.type === 'call' && item.direction === 'incoming'"
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
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
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="red"
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
                    <template v-slot:activator="{ on, attrs }">
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
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="red"
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
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                        color="red"
                      >
                        mdi-phone-missed
                      </v-icon>
                    </template>
                    <span>{{ $tc('Missed call') }}</span>
                  </v-tooltip>

                </v-list-item-avatar>
                <v-list-item-content style="width: 18%">
                  <v-list-item-title>{{ $libPhoneNumberJs.parsePhoneNumber(item.target).formatNational() }}</v-list-item-title>
                  <v-list-item-subtitle class="pt-1">
                    {{ secondsToHmsDigital(item.call_duration) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <div class="d-flex flex-row">
                    <div class="grey--text mr-5">{{ $tc('Result') }}: </div>
                    <div>
                      <span v-if="item.status_result" class="label" :style="{'background-color': item.status_color}">
                        {{ item.status_result }}
                      </span>
                      <span v-else class="label label-outlined label-color-grey">
                        {{ $tc('Status not set') }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-1">
                    <div>{{ item.comment }}</div>
                  </div>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-action>
                  <v-list-item-action-text v-text="new Date(item.created_at * 1000).toLocaleString()"></v-list-item-action-text>
                  <v-btn
                    icon
                    :key="`v-list-item-action-${index}`"
                    :loading="item.actions.edit.loading"
                    @click.stop="onShowDialogCallEdit(item)"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <!-- Comment -->
              <v-list-item
                v-else-if="item.type === 'comment'"
                :key="`v-list-item-${index}`"
                link
                selectable
              >
                <v-list-item-avatar>
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-comment
                      </v-icon>
                    </template>
                    <span>{{ $tc('Comment') }}</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content style="width: 18%">
                  <v-list-item-title>{{ $libPhoneNumberJs.parsePhoneNumber(item.target).formatNational() }}</v-list-item-title>
                  <v-list-item-subtitle class="pt-1">
                    {{ secondsToHmsDigital(item.call_duration) }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content>
                  <div class="d-flex flex-row">
                    <div class="grey--text mr-5">Результат: </div>
                    <div>
                      <span class="label" :style="{'background-color': item.status_color}">
                        {{ item.status_result }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-1">
                    <div>{{ item.comment }}</div>
                  </div>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-action>
                  <v-list-item-action-text v-text="new Date(item.created_at * 1000).toLocaleString()"></v-list-item-action-text>
                  <v-btn
                    v-if="item.type === 'comment'"
                    icon
                    :key="`v-list-item-action-${index}`"
                    :loading="item.actions.edit.loading"
                    @click.stop="onShowDialogCommentEdit(item)"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-else-if="item.type === 'call'"
                    icon
                    :key="`v-list-item-action-${index}`"
                    :loading="item.actions.edit.loading"
                    @click.stop="onShowDialogCallEdit(item)"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <!-- Email -->
              <v-list-item
                v-else-if="item.type === 'mail'"
                :key="`v-list-item-${index}`"
                link
                selectable
              >
                <v-list-item-avatar>
                  <v-tooltip
                    bottom
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        v-on="on"
                      >
                        mdi-email
                      </v-icon>
                    </template>
                    <span>{{ $tc('Comment') }}</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content style="width: 18%">
                  <v-list-item-title>{{ item.target }}</v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <div class="d-flex flex-row">
                    <div class="grey--text mr-5">Результат: </div>
                    <div>
                      <span class="label" :style="{'background-color': item.status_color}">
                        {{ item.status_result }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-1">
                    <div>{{ item.comment }}</div>
                  </div>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-action>
                  <v-list-item-action-text v-text="new Date(item.created_at * 1000).toLocaleString()"></v-list-item-action-text>
                  <v-btn
                    v-if="item.type === 'comment'"
                    icon
                    :key="`v-list-item-action-${index}`"
                    :loading="item.actions.edit.loading"
                    @click.stop="onShowDialogCommentEdit(item)"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                  <v-btn
                    v-else-if="item.type === 'call'"
                    icon
                    :key="`v-list-item-action-${index}`"
                    :loading="item.actions.edit.loading"
                    @click.stop="onShowDialogCallEdit(item)"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider :key="`v-divider-${index}`"/>
            </template>
          </v-list>
        </template>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { secondsToHmsDigital } from '@/utils/datetime'
import DCommentEdit from '@/components/Dialogs/DCommentEdit.vue'
import '@/plugins/libphonenumber-js'
import VStatusEditDialog, { StatusInterface } from '@/components/VStatusEditDialog/VStatusEditDialog.vue'

export default Vue.extend({

  data () {
    return {
      historyLoading: false,
      historyDialog: {
        visible: false,
        historyId: 0
      },
      history: [],
      comment: {
        disabled: false,
        text: '',
        buttonSave: {
          loading: false
        }
      }
    }
  },

  mounted () {
    this.$root.$on('root-contact-history-change', this.loadHistory)
  },

  beforeRouteUpdate (to, from, next) {
    if (from.params.contact_id !== to.params.contact_id) {
      this.loadHistory()
    }
    next()
  },

  created () {
    if (this.$route.query.filter) {
      this.historyFilter.selected = this.historyFilter.items.find((e) => e.value === this.$route.query.filter)?.value
    }
    this.loadHistory()
    this.$root.$on('root-contact-history-change', this.loadHistory)
  },

  beforeDestroy () {
    this.$root.$off('root-contact-history-change', this.loadHistory)
  },

  methods: {
    onShowDialogCommentEdit ({ id, comment, actions }: any) {
      this.$dialog.show(DCommentEdit, {
        waitForResult: true,
        title: this.$t('Comment'),
        text: comment,
        saveTitle: this.$t('Save'),
        cancelTitle: this.$t('Cancel'),
        onSave: (value: string) => {
          actions.edit.loading = true
          new Contacts()
            .updateHistory(id, {
              comment: value
            }).then(() => {
              const element: any = this.history.find((e: any) => e.id === id)
              if (element) {
                element.comment = value
              }
            }).finally(() => {
              actions.edit.loading = false
            })
        }
      })
    },

    onShowDialogCallEdit ({ id, comment, actions }: any) {
      if (this.$store.getters['project/statuses'].length > 0) {
        this.$dialog.show(VStatusEditDialog, {
          waitForResult: true,
          statuses: this.$store.getters['project/statuses'], // Statuses in current project
          comment,
          width: '60%',
          height: '600',
          onSave: ({ status, comment }: StatusInterface) => {
            actions.edit.loading = true
            new Contacts()
              .updateHistory(id, {
                status_id: status.id,
                comment
              }).then(() => {
                const element: any = this.history.find((e: any) => e.id === id)
                if (element) {
                  element.status = status.name
                }
              }).finally(() => {
                actions.edit.loading = false
              })
          }
        })
      } else {
        this.$toast.warning(this.$tc('The status cannot be set, because the project is configured incorrectly!'))
      }
    },

    /**
     * Загружает историю контакта
     */
    loadHistory () {
      this.historyLoading = true
      new Contacts()
        .getHistory(
          +this.$route.params.contact_id,
          String(this.$route.query.filter) === 'all' ? '' : String(this.$route.query.filter) || '',
          +this.$route.query.history_offset || 0,
          +this.$route.query.history_count || 20
        )
        .then((response) => {
          this.history = response.items.map((e: any) => {
            return Object.assign({
              actions: {
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

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    }
  }
})
</script>

<style lang="scss">
.v-list-item__content {
  align-items: center;
  align-self: center;
  display: flex;
  flex-wrap: wrap;
  flex: initial !important;
  overflow: hidden;
  padding: 12px 0;
}
</style>
