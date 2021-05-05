<template>
  <v-list dense>
    <template v-if="isListEmpty && historyLoading === true">
      <v-list-item
        class="justify-center"
        style="height: 50vh"
      >
        <span class="grey--text">{{ $tc('Loading content...') }}</span>
      </v-list-item>
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
            <v-list-item-content>
              <v-list-item-title>
                <span class="mr-2 black--text" style="letter-spacing: 1.2px; font-weight: 500;">
                  {{ $libPhoneNumberJs.parsePhoneNumber(item.target).formatNational() }}
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
                    <span class="black--text">{{ item.creator.first_name }}</span>
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
              <v-list-item-action-text v-text="$moment.unix(item.created_at).format('YYY.MM.DD HH:mm')" />
              <div class="d-flex flex-wrap">
                <v-btn
                  :key="`v-list-item-action-play-${index}`"
                  disabled
                  icon
                >
                  <v-icon>mdi-play</v-icon>
                </v-btn>
                <v-btn
                  icon
                  :key="`v-list-item-action-${index}`"
                  :loading="item.actions.edit.loading"
                  @click.stop="onShowDialogCallEdit(item)"
                >
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>

          <v-divider inset :key="`v-divider-${index}`"/>
        </template>
    </template>
  </v-list>
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
  },

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

  methods: {

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
                this.loadHistory(contact_id)
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

    onShowDialogCommentEdit ({ id, comment, actions }: any) {
      this.$dialog.show(DTextarea, {
        showClose: true,
        text: comment,
        title: this.$tc('Comment'),
        value: comment,
        waitForResult: false
      })
    },

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    },

    /**
     * Метод предназначен для обновления всего компонента
     **/
    update () {
      this.loadHistory(+this.$route.params.contact_id)
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
