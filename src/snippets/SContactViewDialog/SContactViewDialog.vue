<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog.visible"
      max-width="900"
      persistent
    >
      <v-card class="overflow-hidden">
        <v-app-bar
          absolute
          color="white"
          height="80"
          class="pr-4"
          elevate-on-scroll
        >
          <v-app-bar-nav-icon class="ml-3" style="background-color: #8d3eb1; color: white">
            {{ avatar }}
          </v-app-bar-nav-icon>
          <v-toolbar-title>
            {{ contact.first_name }} {{ contact.last_name }}
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            icon
            :disabled="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state)"
            @click="dialog.visible = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-app-bar>
        <v-sheet
          id="scrolling-techniques-7"
          max-height="600"
          style="margin-top: 80px"
        >
          <v-container class="pl-5 pr-5">
            <vue-scroll :style="{ height: `${500}px` }" style="width: 100%">
              <!-- Contacts -->
              <v-list tile dense>
                <!-- Emails -->
                <v-list-item
                  v-for="(email, emailIndex) in contact.emails"
                  :key="`email-${emailIndex}`"
                  ripple
                  link
                  selectable
                >
                  <v-list-item-avatar size="30">
                    <v-icon v-if="emailIndex === 0">mdi-email</v-icon>
                  </v-list-item-avatar>
                  <v-item-group>
                    <v-list-item-title>{{ email.value }}</v-list-item-title>
                    <v-list-item-subtitle>{{ email.type }}</v-list-item-subtitle>
                  </v-item-group>
                </v-list-item>

                <!-- Phones -->
                <v-list-item
                  v-for="(phone, phoneIndex) in contact.phones"
                  :key="phoneIndex"
                  ripple
                  link
                  selectable
                >
                  <v-list-item-avatar size="30">
                    <v-icon v-if="phoneIndex === 0">mdi-phone</v-icon>
                  </v-list-item-avatar>
                  <v-item-group>
                    <v-list-item-title>{{ phone.value.international }}</v-list-item-title>
                    <v-list-item-subtitle>{{ phone.type }}</v-list-item-subtitle>
                  </v-item-group>
                  <v-spacer />
                  <v-item-group
                  >
                    <template v-if="['accepted'].includes($jsSIP.state) && $jsSIP.target === phone.value.e164">
                      {{ secondsToHms($jsSIP.seconds) }}
                    </template>
                  </v-item-group>
                  <v-list-item-action>
                    <v-btn
                      v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target === phone.value.e164"
                      :key="phone.value"
                      icon
                      @click="$jsSIP.cancel()"
                    >
                      <v-icon color="red">mdi-phone-hangup</v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      icon
                      :key="phone.value"
                      :disabled="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target !== phone.value.e164"
                      @click="onCall(phone.value.e164, contact.id)"
                    >
                      <v-icon>mdi-phone</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              <v-divider />
              <!-- History -->
              <v-list
                tile
                dense
              >
                <template v-if="contactHistory.length === 0">
                  <v-list-item class="text-center">
                    <v-spacer />
                    <span class="grey--text">
                        По этому контакту ещё нет не одного звонка
                      </span>
                    <v-spacer />
                  </v-list-item>
                </template>
                <template v-else-if="dialog.history.loading">
                  <v-list-item class="text-center">
                    <v-spacer />
                    <span class="grey--text">
                        Загрузка содержимого...
                      </span>
                    <v-spacer />
                  </v-list-item>
                </template>
                <template v-else>
                  <v-list-item
                    v-for="(item, index) in contactHistory"
                    :key="index"
                    ripple
                    link
                    selectable
                    dense
                  >
                    <v-item-group>
                      <v-list-item-avatar size="25">
                        <v-icon
                          v-if="item.direction === 0"
                          color="red"
                        >mdi-phone-missed
                        </v-icon>
                        <v-icon v-else-if="item.direction === 1">mdi-phone-incoming</v-icon>
                        <v-icon v-else-if="item.direction === 2" color="red">mdi-phone-incoming</v-icon>
                        <v-icon v-else-if="item.direction === 3">mdi-phone-outgoing</v-icon>
                        <v-icon v-else-if="item.direction === 4" color="red">mdi-phone-outgoing</v-icon>
                      </v-list-item-avatar>
                    </v-item-group>
                    <v-item-group class="mr-5">
                      <v-list-item-title>{{ $libPhoneNumberJs.parsePhoneNumber(item.target).formatNational() }}</v-list-item-title>
                    </v-item-group>
                    <v-item-group>
                      <v-list-item-title v-if="item.direction === 0">Пропущеный</v-list-item-title>
                      <v-list-item-title v-else-if="item.direction === 1">Входящий {{ secondsToHms(item.duration) }}</v-list-item-title>
                      <v-list-item-title v-else-if="item.direction === 2">Входящий отменён {{ secondsToHms(item.duration) }}</v-list-item-title>
                      <v-list-item-title v-else-if="item.direction === 3">Исходящий {{ secondsToHms(item.duration) }}</v-list-item-title>
                      <v-list-item-title v-else-if="item.direction === 4">Исходящий отменён {{ secondsToHms(item.duration) }}</v-list-item-title>
                    </v-item-group>
                    <v-spacer />
                    <v-item-group>
                      <v-list-item-title>{{ new Date(item.start_time * 1000).toLocaleString() }}</v-list-item-title>
                    </v-item-group>
                  </v-list-item>
                </template>
              </v-list>
            </vue-scroll>
          </v-container>
        </v-sheet>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { ContactInterface, HistoryInterface } from '@/api/Schemas/ContactInterface'
import { Contacts } from '@/api/Contacts'
import { secondsToHms } from '@/utils/datetime'

export default Vue.extend({
  props: {
    showing: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      dialog: {
        visible: false,
        history: {
          loading: false
        }
      },
      contactHistory: [] as HistoryInterface[],
      contact: {} as ContactInterface
    }
  },

  computed: {
    avatar () {
      const first: string = this.contact.first_name || ''
      const last: string = this.contact.last_name || ''
      return first.charAt(0) + last.charAt(0)
    }
  },

  watch: {
  },

  mounted () {
    this.$parent.$on('contact-show', this.onContactShow)
    this.$root.$on('jssip-session-cancel', this.onJssipSessionCancel)
  },

  beforeDestroy () {
    this.$parent.$off('contact-show', this.onContactShow)
    this.$root.$off('jssip-session-cancel', this.onJssipSessionCancel)
  },

  methods: {
    onContactShow (id: number) {
      const contacts: Contacts = new Contacts()

      // Load contact history
      contacts.getById(id)
        .then((contact) => {
          this.dialog.visible = true
          this.contact = contact as any

          this.dialog.history.loading = true
          contacts.getHistory(id)
            .then((history: any) => {
              this.contactHistory = history.items
            }).finally(() => {
              this.dialog.history.loading = false
            })
        })
    },

    secondsToHms (s: number) {
      return secondsToHms(s)
    },

    onCall (target: string, contactId: number) {
      /* eslint-disable */
      this.$jsSIP.call(target, { contact_id: contactId, target })
      /* eslint-enable */
    },

    // Occurs when a session has ended for one reason or another
    onJssipSessionCancel (data: any) {
      // If the claw-tact dialogue is open, load the updated history
      if (this.dialog.visible) {
        new Contacts()
          .getHistory(this.contact.id)
          .then((history: any) => {
            this.contactHistory = history.items
          })
      }
    }
  }
})
</script>

<style scoped>

</style>
