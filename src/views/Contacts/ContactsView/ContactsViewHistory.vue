<template>
  <div style="height: 100%">
    <template v-if="historyItemsFetching && historyItems.length === 0">
      <div class="d-flex align-center justify-center fill-height">
        <app-loading />
      </div>
    </template>
    <template v-else-if="historyItems.length === 0">
      <div class="d-flex align-center justify-center fill-height">
        <span class="grey--text">{{ $tc('There are no calls for this contact') }}</span>
      </div>
    </template>
    <template v-else>
      <v-list dense>
        <template v-for="(item, index) in historyItems">
          <v-list-item
            :key="`v-list-item-${index}`"
            link
            three-line
          >
            <v-list-item-avatar>
              <!-- Incoming call -->
              <app-tooltip
                v-if="item.autodialer"
              >
                <template #activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-robot
                  </v-icon>
                </template>
                <span>{{ $tc('Robot caller') }}</span>
              </app-tooltip>

              <!-- Incoming call -->
              <app-tooltip
                v-else-if="item.type === 'call' && item.direction === 'incoming'"
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
              </app-tooltip>

              <!-- Incoming call canceled -->
              <app-tooltip
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
              </app-tooltip>

              <!-- Outgoing call -->
              <app-tooltip
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
              </app-tooltip>

              <!-- Outgoing call canceled -->
              <app-tooltip
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
              </app-tooltip>

              <!-- Missed -->
              <app-tooltip
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
              </app-tooltip>
            </v-list-item-avatar>
            <v-list-item-content>
              <div class="d-flex align-center justify-space-between">
                <div class="font-weight-medium subtitle-2">
                  <span
                    v-if="item.type === 'call'"
                    class="mr-2 black--text"
                  >
                    {{ formatPhoneNumber(item.target) }}
                  </span>
                  <span
                    v-else
                    class="mr-2 black--text"
                  >
                    {{ item.target }}
                  </span>
                </div>
                <div class="text-caption grey--text">
                  {{ $dayjs(item.created_at * 1000).format('DD.MM.YYYY HH.mm') }}
                </div>
              </div>
              <div class="d-flex justify-start">
                <div>
                  <v-list-item-subtitle>
                    <span class="grey--text">{{ $tc('Duration') }}:</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.owner">
                    <span class="grey--text">{{ $tc('Manager') }}:</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.comment">
                    <span class="grey--text">{{ $tc('Comment') }}:</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span class="grey--text">{{ $tc('Result') }}:</span>
                  </v-list-item-subtitle>
                </div>
                <div class="ml-3">
                  <v-list-item-subtitle>
                    <span class="black--text">{{ secondsToHmsDigital(item.call_duration) }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.owner">
                    <span class="black--text">{{ item.owner.full_name }}</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-if="item.comment">
                    <span class="black--text">
                      {{ item.comment }}
                    </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-chip
                      v-if="item.status"
                      :color="item.status.color"
                      label
                      outlined
                      x-small
                    >
                      {{ item.status.name }}
                    </v-chip>
                    <v-chip
                      v-else
                      label
                      outlined
                      x-small
                    >
                      {{ $tc('Status not set') }}
                    </v-chip>
                  </v-list-item-subtitle>
                </div>
                <div class="align-self-end ml-auto">
                  <v-btn
                    icon
                    small
                    @click="onBtnItemEditClick(item)"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    @click="onBtnItemPlayClick(item)"
                  >
                    <v-icon>mdi-play-circle-outline</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-list-item-content>
            <!--            <v-list-item-action>-->
            <!--              <div class="d-flex flex-wrap">-->
            <!--                <v-btn-->
            <!--                  :key="`v-list-item-action-play-${index}`"-->
            <!--                  icon-->
            <!--                  small-->
            <!--                >-->
            <!--                  <v-icon>mdi-play</v-icon>-->
            <!--                </v-btn>-->
            <!--              </div>-->
            <!--            </v-list-item-action>-->
          </v-list-item>

          <v-divider
            :key="`v-divider-${index}`"
            inset
          />
        </template>
      </v-list>
    </template>
  </div>
</template>

<script lang="ts">
import ContactHistory from '@/api/interfaces/ContactHistory'
import StatusGroup from '@/api/interfaces/StatusGroup'
import AppBase from '@/AppBase'
import AppContactHistoryEdit from '@/components/AppContactHistoryEdit/AppContactHistoryEdit.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { secondsToHmsDigital } from '@/utils/datetime'
import debounce from '@/utils/debounce'
import parsePhoneNumber from 'libphonenumber-js'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ContactsViewHistory>({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('contacts/view/history/fetch', to.params.id)
    })
  }
})
export default class ContactsViewHistory extends AppBase {
  get historyItemsFetching (): boolean {
    return this.$store.getters['contacts/view/history/items_fetching']
  }

  get historyItems (): ContactHistory[] {
    return this.$store.getters['contacts/view/history/items']
  }

  get statuses (): StatusGroup[] {
    return this.$store.getters['contacts/view/contact_project_statuses']
  }

  public created () {
    this.fetchHistory = debounce(this.fetchHistory, 500)

    this.$root.$on('sse-contact-history-changed', this.onSSEContactHistoryChanged)
  }

  public beforeDestroy () {
    this.$root.$off('sse-contact-history-changed', this.onSSEContactHistoryChanged)
  }

  private secondsToHmsDigital (s: number) {
    return secondsToHmsDigital(s)
  }

  private onSSEContactHistoryChanged () {
    this.fetchHistory()
  }

  private fetchHistory () {
    this.$store.dispatch('contacts/view/history/fetch', this.$route.params.id)
  }

  private async onBtnItemEditClick (item) {
    const statuses = []
    this.statuses.forEach((e1) => {
      e1.children.forEach((e2) => {
        statuses.push({
          ...e2,
          color: e1.color
        })
      })
    })
    const dialog = await this.$dialog.show(AppContactHistoryEdit, {
      waitForResult: false,
      overlayOpacity: 0.1,
      showClose: false,
      statusId: item.status?.id || 0,
      comment: item.comment || '',
      statuses
    })

    // @ts-expect-error: dialog.vmd.$on
    dialog.vmd.$on('click:btn:save', ({ status_id, comment }) => {
      dialog.close()

      this.$axios.patch(`/contacts/history/${item.id}`, { status_id, comment })
    })
    // @ts-expect-error: dialog.vmd.$on
    dialog.vmd.$on('click:btn:cancel', dialog.close)
  }

  private async onBtnItemPlayClick (item) {
    this.$root.$emit('audio-player-show', {
      src: `${process.env.VUE_APP_API}/contacts/history/audio/${item.audio_recording_id}`,
      author: `${item.owner.name} / ${item.contact.name}`
    })
  }

  /**
   *
   * @param phone
   * @private
   */
  private formatPhoneNumber (phone: string) {
    const phoneNumber = parsePhoneNumber(phone, 'RU')
    if (phoneNumber) {
      return phoneNumber.formatNational()
    }

    return 'Не верный формат'
  }
}

</script>

<style lang="scss" scoped>

</style>
