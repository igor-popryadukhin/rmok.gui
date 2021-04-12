<template>
  <div>
    <div
      v-if="history.length === 0 && historyLoading === true"
      class="d-flex align-center justify-center"
      style="min-height: 400px"
    >
      <div class="grey--text">
        {{ $tc('Loading content...') }}
      </div>
    </div>
    <template v-else-if="history.length === 0 && historyLoading === false">
      <div class="d-flex align-center justify-center" style="min-height: 400px">
        <div class="grey--text">{{ $tc('There are no calls for this contact') }}</div>
      </div>
    </template>
    <template v-else>
      <v-list dense>
        <template v-for="(item, index) in history">
          <!-- Call -->
          <v-list-item
            v-if="item.type === 'call'"
            :key="`v-list-item-${index}`"
            link
            @mousemove="buttonsHoverIndex = index"
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
            <v-list-item-content style="max-width: 200px">
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
                {{ item.comment }}
<!--                <v-btn-->
<!--                  v-if="buttonsHoverIndex === index"-->
<!--                  icon-->
<!--                  x-small-->
<!--                  @click="onShowDialogCommentEdit(item)"-->
<!--                >-->
<!--                  <v-icon>mdi-pencil-box-outline</v-icon>-->
<!--                </v-btn>-->
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text v-text="$moment.unix(item.created_at).format('YYY.MM.DD HH:mm')"></v-list-item-action-text>
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
            <v-list-item-content style="max-width: 200px">
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
            <v-list-item-content style="max-width: 200px">
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
          <v-divider inset :key="`v-divider-${index}`"/>
        </template>
      </v-list>
    </template>
  </div>
</template>

<script lang="ts">
import DTextarea from '@/components/Dialogs/DTextarea.vue'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { Contacts } from '@/api/Contacts'
import { secondsToHmsDigital } from '@/utils/datetime'
import '@/plugins/libphonenumber-js'
import VStatusEditDialog, { StatusInterface } from '@/components/VStatusEditDialog/VStatusEditDialog.vue'
import { mapGetters } from 'vuex'

export default (Vue as VueConstructor<VInterface>).extend({

  data () {
    return {
      historyLoading: false,
      buttonsHoverIndex: -1,
      buttonsHover: [],
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

  computed: {
    ...mapGetters({
      database_statuses: 'database/statuses'
    })
  },

  created () {
    if (this.$route.query.filter) {
      this.historyFilter.selected = this.historyFilter.items.find((e) => e.value === this.$route.query.filter)?.value
    }
    this.loadHistory()
  },

  methods: {
    /**
     * Метод предназначен для обновления всего компонента
     **/
    update () {
      this.loadHistory(+this.$route.params.contact_id)
    },

    onShowDialogCommentEdit ({ id, comment, actions }: any) {
      this.$dialog.show(DTextarea, {
        waitForResult: false,
        title: this.$tc('Comment'),
        text: comment,
        value: comment,
        showClose: true
      })
    },

    onShowDialogCallEdit ({ id, comment, actions, status }: any) {
      const contact_id = +this.$route.params.contact_id
      if (this.database_statuses.length > 0) {
        this.$dialog.show(VStatusEditDialog, {
          waitForResult: true,
          statuses: this.database_statuses, // Statuses in current project
          statusId: status?.id || 0,
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
                this.loadHistory(contact_id)
              }).finally(() => {
                actions.edit.loading = false
              })
          }
        }).finally(() => (actions.edit.loading = false))
      } else {
        this.$toast.warning(this.$tc('The status cannot be set, because the project is configured incorrectly!'))
      }
    },

    /**
     * Загружает историю контакта
     */
    loadHistory (contact_id = 0, params = {}) {
      this.historyLoading = true

      const innerParams: any = Object.assign({}, params)

      if (!this.assertObjectHasAttribute(innerParams, 'type')) {
        innerParams.type = 'all'
      }

      if (!this.assertObjectHasAttribute(innerParams, 'offset')) {
        innerParams.offset = 0
      }

      if (!this.assertObjectHasAttribute(innerParams, 'count')) {
        innerParams.count = 100
      }

      new Contacts()
        .getHistory(contact_id || +this.$route.params.contact_id, innerParams)
        .then((response) => {
          this.history = response.data.map((e: any) => {
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

<style lang="scss" scoped>

</style>
