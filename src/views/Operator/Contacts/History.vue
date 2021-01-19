<template>
  <div>
    <v-row no-gutters>
      <v-col
        cols="12"
      >
        <v-btn-toggle
          v-model="historyFilter.selected"
          tile
          color="primary"
        >
          <v-btn
            v-for="(item, key) in historyFilter.items"
            :key="key"
            small
            text
            :value="item.value"
          >
            {{ $t(item.title) }}
          </v-btn>
        </v-btn-toggle>
          <v-list>
          <template v-if="history.length === 0 && historyLoading  === true">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">{{ $tc('Loading content...') }}</span>
              <v-spacer />
            </v-list-item>
          </template>
          <template v-if="history.length === 0 && historyLoading === false">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">По этому контакту ещё нет не одного звонка</span>
              <v-spacer />
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item
              v-for="(item, index) in history"
              :key="index"
              ripple
              link
              selectable
            >
              <v-list-item-group>
                <v-list-item-avatar>
                  <!-- Comment -->
                  <v-tooltip
                    v-if="item.type === 'comment'"
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

                  <!-- Mail -->
                  <v-tooltip
                    v-else-if="item.type === 'mail'"
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

                  <!-- Incoming call -->
                  <v-tooltip
                    v-else-if="item.type === 'call' && item.direction === 'incoming'"
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
              </v-list-item-group>
              <v-list-item-group v-if="item.type === 'comment'">
                <v-list-item-title>{{ item.comment }}</v-list-item-title>
              </v-list-item-group>
              <v-list-item-group v-else-if="item.type === 'call'">
                <v-list-item-title>{{ $libPhoneNumberJs.parsePhoneNumber(item.target).formatNational() }}</v-list-item-title>
                <v-list-item-subtitle class="pt-1">
                  {{ secondsToHmsDigital(item.session_duration) }}
                </v-list-item-subtitle>
              </v-list-item-group>
              <v-spacer />
              <v-list-item-group class="mr-5">
                {{ item.status_result }}
              </v-list-item-group>
              <v-list-item-group>
                <v-list-item-title>{{ new Date(item.start_time * 1000).toLocaleString() }}</v-list-item-title>
              </v-list-item-group>
              <v-list-item-action>
                <v-btn
                  v-if="item.type === 'comment'"
                  icon
                  :key="`v-list-item-action-${index}`"
                  :loading="item.actions.edit.loading"
                  @click.stop="onShowDialogCommentEdit(item)"
                >
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { secondsToHmsDigital } from '@/utils/datetime'
import DCommentEdit from '@/components/Dialogs/DCommentEdit.vue'
import '@/plugins/libphonenumber-js'

export default Vue.extend({

  data () {
    return {
      historyLoading: false,
      historyFilter: {
        selected: null as any,
        items: [
          {
            title: 'All',
            value: 'all'
          },
          {
            title: 'Last comment',
            value: 'comment'
          },
          {
            title: 'Challenges',
            value: 'call'
          }
        ]
      },
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

  watch: {
    'historyFilter.selected': {
      handler (value) {
        const name: string = this.$route.name || ''
        if (value) {
          if (Array.isArray(value)) {
            // todo: is array
          } else {
            this.$router.replace({
              name,
              query: {
                filter: value
              }
            }).then(() => {
              this.history = []
              this.loadHistory()
            })
          }
        }
      }
    }
  },

  mounted () {
    this.$root.$on('root-contact-history-change', this.loadHistory)
  },

  created () {
    if (this.$route.query.filter) {
      this.historyFilter.selected = this.historyFilter.items.find((e) => e.value === this.$route.query.filter)?.value
    }
    this.loadHistory()
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

    loadHistory () {
      this.historyLoading = true
      new Contacts()
        .getHistory(
          +this.$route.params.contact_id,
          String(this.$route.query.filter) === 'all' ? '' : String(this.$route.query.filter) || '',
          +this.$route.query.history_offset || 0,
          +this.$route.query.history_count || 50
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

<style scoped>
</style>
