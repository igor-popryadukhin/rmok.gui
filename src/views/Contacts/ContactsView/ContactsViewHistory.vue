<template>
  <v-sheet height="100%">
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
                    <span class="grey--text">{{ $tc('Manager') }}:</span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
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
                  <v-list-item-subtitle>
                    <template v-if="item.owner">
                      <span class="black--text">{{ item.owner.full_name }}</span>
                    </template>
                    <template v-else>
                      —
                    </template>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
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
                          v-on="on"
                        >
                          {{ item.status.name }}
                        </v-chip>
                      </template>
                      <span>{{ $tc('Click on an item to change') }}</span>
                    </v-tooltip>
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
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <v-list-item-action-text
                v-text="$dayjs(item.created_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`)"
              />
              <div class="d-flex flex-wrap">
                <v-btn
                  :key="`v-list-item-action-play-${index}`"
                  icon
                  small
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
      </v-list>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import ContactHistory from '@/api/interfaces/ContactHistory'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { secondsToHmsDigital } from '@/utils/datetime'
import debounce from '@/utils/debounce'
import ContactsViewBase from './ContactsViewBase'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<ContactsViewHistory>({
  components: { AppLoading }
})
export default class ContactsViewHistory extends ContactsViewBase {
  get historyItemsFetching (): boolean {
    return this.$store.getters['contacts/view/history/items_fetching']
  }

  get historyItems (): ContactHistory[] {
    return this.$store.getters['contacts/view/history/items']
  }

  private secondsToHmsDigital (s: number) {
    return secondsToHmsDigital(s)
  }

  public created () {
    this.fetchHistory = debounce(this.fetchHistory, 500)

    this.$root.$on('sse-contact-history-changed', this.onSSEContactHistoryChanged)
  }

  public mounted () {
    this.fetchHistory()
  }

  public beforeDestroy () {
    this.$root.$off('sse-contact-history-changed', this.onSSEContactHistoryChanged)
  }

  private onSSEContactHistoryChanged () {
    this.fetchHistory()
  }

  private fetchHistory () {
    this.$store.dispatch('contacts/view/history/fetch')
  }
}

</script>

<style lang="scss" scoped>

</style>
