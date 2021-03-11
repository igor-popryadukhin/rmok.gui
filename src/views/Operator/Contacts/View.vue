<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
      lg="4"
      class="py-lg-0 py-md-0 pt-sm-0 pt-xl-0"
    >
      <v-card
        class="fill-height"
        flat
        tile
        outlined
      >
        <v-card-title class="mb-2 py-2">
          <template>
            {{ contact.first_name }} {{ contact.last_name }} {{ contact.middle_name }}
          </template>
        </v-card-title>
        <v-card-subtitle v-if="assertObjectHasAttribute(contact.default_phone, 'international')">
          {{ contact.default_phone.international }}
        </v-card-subtitle>
        <v-card-text class="py-0 d-flex justify-space-between">
          <div class="d-flex align-center">{{ $jsSIP.sessionStopwatch }}</div>
          <v-btn
            v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state)"
            text
            outlined
            color="red"
            @click="$jsSIP.cancel()"
          >
            {{ $tc('To complete') }}
          </v-btn>
          <v-btn
            v-else
            :disabled="!$jsSIP.isConnected || !assertObjectHasAttribute(contact.default_phone, 'raw') || !$libPhoneNumberJs.validate(contact.default_phone.raw)"
            color="primary"
            text
            outlined
            @click="onCall(contact.default_phone.raw, contact.id)"
          >
            {{ $tc('Call') }}
          </v-btn>
        </v-card-text>
        <v-divider class="my-4 mx-4"/>
        <v-card-text>
          <v-list
            tile
          >
            <!-- Номера телефонов -->
            <v-skeleton-loader
              v-if="dataLoading"
              type="list-item-avatar-two-line"
            ></v-skeleton-loader>
            <template v-else>
              <v-list-item
                v-for="(phone, phoneIndex) in contact.phones"
                :key="`phone-list-item-${phoneIndex}`"
                ripple
                link
                selectable
              >
                <v-list-item-avatar>
                  <v-icon v-if="phoneIndex === 0" color="primary">mdi-phone</v-icon>
                </v-list-item-avatar>
                <v-item-group>
                  <v-list-item-title>{{ phone.international }}</v-list-item-title>
                  <v-list-item-subtitle>{{ phone.label }}</v-list-item-subtitle>
                </v-item-group>
                <v-spacer/>
                <v-item-group
                >
                  <template
                    v-if="!['idle'].includes($jsSIP.state) && $jsSIP.target === phone.raw"
                  >
                    {{ $jsSIP.sessionStopwatch }}
                  </template>
                </v-item-group>
                <v-item-group
                >
                  <v-btn
                    v-if="!assertObjectHasAttribute(contact.default_phone, 'id')"
                    :key="`phone-default-btn-${phoneIndex}`"
                    icon
                    color="#9e9e9e73"
                    @click.stop="onDefaultPhoneSet(phone)"
                  >
                    <v-icon>mdi-star</v-icon>
                  </v-btn>
                  <v-btn
                    v-else-if="contact.default_phone.id === phone.id"
                    :key="`phone-default-btn-${phoneIndex}`"
                    icon
                    color="#ffc107"
                  >
                    <v-icon>mdi-star</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    :key="`phone-default-btn-${phoneIndex}`"
                    icon
                    color="#9e9e9e73"
                    @click.stop="onDefaultPhoneSet(phone)"
                  >
                    <v-icon>mdi-star</v-icon>
                  </v-btn>
                </v-item-group>
                <v-list-item-action>
                  <v-btn
                    v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target === phone.raw"
                    :key="`phone-cancel-btn-${phoneIndex}`"
                    icon
                    @click="$jsSIP.cancel()"
                  >
                    <v-icon color="red">mdi-phone-hangup</v-icon>
                  </v-btn>
                  <v-btn
                    v-else
                    icon
                    :key="`phone-call-btn-${phoneIndex}`"
                    :disabled="!$jsSIP.isConnected || ['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target !== phone.raw"
                    @click="onCall(phone.raw, contact.id)"
                  >
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>

            <!-- Адреса электронной почты -->
            <v-skeleton-loader
              v-if="dataLoading"
              type="list-item-avatar-two-line"
            ></v-skeleton-loader>
            <template v-else>
              <v-list-item
                v-for="(email, emailIndex) in contact.emails"
                :key="`email-list-item-${emailIndex}`"
                ripple
                link
                selectable
              >
                <v-list-item-avatar size="30">
                  <v-icon v-if="emailIndex === 0">mdi-email</v-icon>
                </v-list-item-avatar>
                <v-list-item-group>
                  <v-list-item-title>{{ email.value }}</v-list-item-title>
                  <v-list-item-subtitle>{{ email.label }}</v-list-item-subtitle>
                </v-list-item-group>
                <v-spacer />
                <v-list-item-action>
                  <v-btn
                    icon
                    disabled
                    :key="`mail-to-btn-${emailIndex}`"
                  >
                    <v-icon>mdi-email</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </template>

            <v-divider class="mt-5" />

            <!-- Геолокация -->
            <v-skeleton-loader
              v-if="dataLoading"
              type="list-item-avatar-two-line"
              max-height="61"
            />
            <v-list-item
              v-else
            >
              <v-list-item-avatar size="30">
                <v-icon color="primary">mdi-map-marker</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ contact.city }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ contact.region }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Текущее время контакта -->
            <v-skeleton-loader
              v-if="dataLoading"
              type="list-item-avatar-two-line"
              max-height="61"
            ></v-skeleton-loader>
            <v-list-item
              v-else
            >
              <v-list-item-avatar size="30">
                <v-icon color="primary">mdi-clock-time-two-outline</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title :key="tick">{{ contactDateTimeNow.toISOString().substr(11, 8) }} {{ gmt }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('Client\'s current time') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <!-- Дата создания контакта -->
            <v-skeleton-loader
              v-if="dataLoading"
              type="list-item-avatar-two-line"
              max-height="61"
            />
            <v-list-item
              v-else
            >
              <v-list-item-avatar size="30">
                <v-icon color="primary">mdi-clock</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ new Date(contact.created_at * 1000).toLocaleString() }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('Date the contact was created') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Tabs -->
    <v-col
      cols="12"
      md="8"
      lg="8"
      class="py-lg-0 py-md-0 pt-sm-0 pt-xl-0 pl-md-0 pl-lg-0 pl-xl-0"
    >
      <v-card
        :height="tabsHeight"
        class="d-flex flex-column"
        flat
        tile
        outlined
      >
        <v-card-actions class="px-4">
          <v-tabs
            v-model="tab"
            height="35"
          >
            <v-tab
              v-for="(tab, tabIndex) in tabs"
              :key="`tab-${tabIndex}`"
              :to="tab.to"
              :disabled="tab.disabled"
            >
              <v-icon left>
                {{ tab.icon }}
              </v-icon>
              {{ $tc(`route.${tab.name}`) }}
              <v-spacer/>
            </v-tab>
          </v-tabs>
        </v-card-actions>

        <v-card-text class="py-0 ">
          <v-divider />
        </v-card-text>

        <v-card-text class="py-1 flex-grow-1 overflow-y-auto">
          <router-view />
        </v-card-text>

        <v-footer color="white" class="pa-4">
          <v-spacer />
          <v-btn-toggle
            :disabled="comment.disabled || comment.text === ''"
            :loading="comment.buttonSave.loading"
            color="primary"
            dense
            tile
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  text
                  disabled
                  v-on="on"
                  v-bind="attrs"
                  :loading="saveAndNextLoading"
                  @click="onSaveAndNext"
                >
                  {{ $t('Save') }}
                </v-btn>
              </template>
              <span>{{ $t('Save and continue') }}</span>
            </v-tooltip>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  icon
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  disabled
                  text
                  icon
                >
                  <v-icon color="primary">mdi-arrow-down-drop-circle-outline</v-icon>
                </v-btn>
              </template>
              <v-list class="pa-0">
                <v-list-item link>
                  <v-list-item-title>{{ $tc('Сохранить и остаться') }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn-toggle>
        </v-footer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ContactResponseInterface, Contacts } from '@/api/Contacts'
import Leads from '@/api/Leads'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'
import JSSIPPayloadInterface from '@/interface/JSSIPPayloadInterface'
import { MainSearchMethod } from '@/Interfaces'
import lvovich from '@/mixins/lvovich'
import '@/plugins/libphonenumber-js'
import { secondsToHmsDigital } from '@/utils/datetime'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { Route } from 'vue-router'

interface TabInterface {
  name: string;
  icon: string;
  disabled: boolean;
  to?: string | Route;
}

export default (Vue as VueConstructor<VInterface>).extend({
  mixins: [lvovich],

  data () {
    return {
      /* eslint-disable */
      statuses: {
        historyId: 0,
        visible: false
      },
      tab: null,
      tabs: [
        {
          name: 'operator_contacts_view_script',
          icon: 'mdi-script-text',
          disabled: false,
          to: {
            name: 'operator_contacts_view_script'
          }
        },
        {
          name: 'operator_contacts_view_history',
          icon: 'mdi-history',
          disabled: false,
          to: {
            name: 'operator_contacts_view_history'
          }
        },
        {
          name: 'operator_contacts_view_tasks',
          icon: 'mdi-clipboard-list',
          disabled: false,
          to: {
            name: 'operator_contacts_view_tasks'
          }
        }
      ] as TabInterface[],
      saveAndNextLoading: false,
      dataLoading: false,
      comment: {
        disabled: false,
        text: '',
        buttonSave: {
          loading: false
        }
      },
      contact: {
        city: '',
        default_phone: undefined,
        emails: [],
        first_name: '',
        id: 0,
        last_name: '',
        middle_name: '',
        phones: [],
        user: undefined,
        current_date_time: 0,
        timezone_offset: 0,
        created_at: 0
      },
      tick: 0,
      contactDateTimeNow: new Date()
      /* eslint-enable */
    }
  },

  computed: {
    avatar () {
      const first: string = this.contact.first_name || ''
      const last: string = this.contact.last_name || ''
      return first.charAt(0) + last.charAt(0)
    },

    sessionStopwatch () {
      return this.$jsSIP.sessionStopwatch
    },

    tabsHeight () {
      let h: number = this.$screenHeight - 115
      if (h < 640) { h = 640 }
      return h
    },

    gmt () {
      const offset: number | null = this.contact.timezone_offset || null

      if (offset === null) {
        return ''
      }

      if (offset > 0) {
        return `(GMT+${offset})`
      } else if (offset < 0) {
        return `(GMT${offset})`
      } else {
        return `(GMT ${offset})`
      }
    }
  },

  mounted () {
    this.$root.$on('root-main-search', this.onRootMainSearch)
    this.$root.$on('root-main-search-selected', this.onRootMainSearchSelected)
    // Prevent booting or closing a tab!!!
    // window.onbeforeunload = () => {
    //   return true
    // }
  },

  beforeRouteEnter (to, from, next) {
    new Contacts()
      .getById(+to.params.contact_id)
      .then((response: ContactInterface) => {
        // TODO: Фамилия имя отчество в хлебных крошках
        // from.meta.route_breadcrumb_name = `${response.first_name} ${response.last_name} ${response.middle_name}`
        next((vm: VInterface) => {
          vm.contact = response
          vm.contactDateTimeNow = new Date(response.current_date_time * 1000)
        })
      }).catch(() => {
        next({ name: 'not_found' })
      })
  },

  beforeRouteUpdate (to, from, next) {
    if (from.params.contact_id !== to.params.contact_id) {
      const contacts: Contacts = new Contacts()

      this.dataLoading = true
      contacts
        .getById(+to.params.contact_id)
        .then((contact: ContactInterface) => {
          this.contact = contact
          this.contactDateTimeNow = new Date(contact.current_date_time * 1000)
        }).finally(() => {
          this.dataLoading = false
        })
    }
    next()
  },

  beforeDestroy () {
    this.$root.$off('root-main-search', this.onRootMainSearch)
    this.$root.$off('root-main-search-selected', this.onRootMainSearchSelected)
  },

  methods: {
    onRootMainSearch (q: string, set: MainSearchMethod) {
      new Contacts()
        .find({
          q,
          offset: 0,
          count: 10
        }).then((response: ContactResponseInterface) => {
          set(response.items.map((e: ContactInterface) => {
            return {
              ...e,
              title: `${e.first_name} ${e.last_name}`,
              subtitle: e.city
            }
          }))
        })
    },

    onRootMainSearchSelected (data: ContactInterface) {
      this.$router.push({ path: `/contacts/${data.id}/script` })
    },

    onCall (target: string, contactId: number) {
      /* eslint-disable */
      this.$jsSIP.call<JSSIPPayloadInterface>(target, {
        contact_id: contactId,
        target
      })
      /* eslint-enable */
    },

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    },

    onDefaultPhoneSet (value?: PhoneNumberInterface) {
      /* eslint-disable */
      if (value) {
        this.contact.default_phone = value
        new Contacts().setDefaultPhoneNumber(this.contact.id, value?.id)
      }
      /* eslint-enable */
    },

    onSaveComment () {
      /* eslint-disable */
      this.comment.disabled = true
      this.comment.buttonSave.loading = true
      new Contacts()
        .addHistory(+this.$route.params.contact_id, {
          type: 'comment',
          comment: this.comment.text
        }).then(() => {
        this.comment.text = ''
        this.$root.$emit('root-contact-history-change')
      }).finally(() => {
        this.comment.disabled = false
        this.comment.buttonSave.loading = false
      })
      /* eslint-enable */
    },

    onSaveAndNext () {
      this.saveAndNextLoading = true
      new Leads()
        .next(+this.$route.params.contact_id)
        .then((contact_id) => {
          const name = String(this.$route.name)
          this.$router.push({
            name,
            params: {
              contact_id: String(contact_id)
            }
          })
        })
        .catch(() => {
          this.$router.replace({
            name: 'operator_contacts_view'
          })
        }).finally(() => {
          this.saveAndNextLoading = false
        })
    }
  }
})
</script>

<style lang="scss" scoped>

.tool-bar div {
  padding-left: 0;
}

.session-stopwatch {
  font-family: monospace;
  font-size: 1.4rem;
}
</style>
