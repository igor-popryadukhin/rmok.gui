<template>
  <div style="margin: 0 15px 0 15px;">
    <v-row no-gutters>
      <v-col
        cols="12"
        md="4"
        lg="4"
        class="pa-0 pr-md-5 pr-lg-5"
      >
        <v-app-bar
          color="white"
          class="pa-0"
          elevate-on-scroll
        >
          <v-app-bar-nav-icon style="background-color: #8d3eb1; color: white">
            {{ avatar }}
          </v-app-bar-nav-icon>
          <v-toolbar-title>
            {{ contact.first_name }} {{ contact.last_name }}
          </v-toolbar-title>
          <v-spacer/>
        </v-app-bar>
        <v-row v-if="contact.default_phone">
          <v-col class="d-flex justify-space-between">
            <div>{{ contact.default_phone.value.international }}</div>
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
              text
              color="primary"
              outlined
              :disabled="!$jsSIP.isConnected || !$libPhoneNumberJs.validate(contact.default_phone.value.e164)"
              @click="onCall(contact.default_phone.value.e164, contact.id)"
            >
              {{ $tc('Call') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else-if="dataLoading">
          <v-col class="d-flex justify-space-between">
            <div>
              {{ $t('Loading content...') }}
            </div>
            <v-btn
              text
              outlined
              :disabled="true"
            >
              {{ $tc('Call') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col class="d-flex justify-space-between">
            <div>
              Нет номера по умолчанию
            </div>
            <v-btn
              text
              outlined
              :disabled="true"
            >
              {{ $tc('Call') }}
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="session-stopwatch" style="min-height: 50px">
            {{ $jsSIP.sessionStopwatch }}
          </v-col>
        </v-row>
        <v-divider/>

        <!-- Phones & Emails -->
        <v-row v-if="dataLoading">
          <v-col class="text-center grey--text">
            {{ $t('Loading content...') }}
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <v-list
              tile
              dense
            >
              <!-- Phones -->
              <v-list-item
                v-for="(phone, phoneIndex) in contact.phones"
                :key="`phone-list-item-${phoneIndex}`"
                ripple
                link
                selectable
              >
                <v-list-item-avatar size="30">
                  <v-icon v-if="phoneIndex === 0">mdi-phone</v-icon>
                </v-list-item-avatar>
                <v-item-group>
                  <v-list-item-title>{{ phone.value.international }}</v-list-item-title>
                  <v-list-item-subtitle>{{ phone.label }}</v-list-item-subtitle>
                </v-item-group>
                <v-spacer/>
                <v-item-group
                >
                  <template
                    v-if="!['idle'].includes($jsSIP.state) && $jsSIP.target === phone.value.e164"
                  >
                    {{ $jsSIP.sessionStopwatch }}
                  </template>
                </v-item-group>
                <v-item-group
                >
                  <v-btn
                    v-if="!contact.default_phone"
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
                    v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target === phone.value.e164"
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
                    :disabled="!$jsSIP.isConnected || ['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target !== phone.value.e164"
                    @click="onCall(phone.value.e164, contact.id)"
                  >
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <!-- Emails -->
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
            </v-list>
          </v-col>
        </v-row>

<!--        <v-row>-->
<!--          <v-col>-->
<!--            {{ contact }}-->
<!--          </v-col>-->
<!--        </v-row>-->
      </v-col>

      <!-- Tabs -->
      <v-col
        cols="12"
        md="8"
        lg="8"
      >
        <v-row>
          <v-col class="pt-0">
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
            <v-container class="pb-0" style="min-height: 300px">
              <vuescroll :style="{ height: `${$screenHeight - 355}px` }" style="width: 99%" >
                <router-view />
              </vuescroll>
            </v-container>
          </v-col>
        </v-row>

        <!-- Comment -->
        <v-row>
          <v-col class="pa-0 pl-6">
            <v-textarea
              v-model="comment.text"
              :disabled="comment.disabled"
              rows="4"
              outlined
              :placeholder="$t('Comment')"
              value=""
              hide-details
            >
              <template v-slot:prepend-inner>
                <v-icon>
                  mdi-comment
                </v-icon>
              </template>
              <template v-slot:append>
                <v-btn
                  icon
                  text
                  disabled
                >
                  <v-icon>
                    mdi-microphone
                  </v-icon>
                </v-btn>
              </template>
            </v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="pa-0 pt-3 text-right">
            <v-btn
              :disabled="comment.disabled || comment.text === ''"
              :loading="comment.buttonSave.loading"
              outlined
              color="primary"
              @click="onSaveComment"
            >
              {{ $t('Save') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import lvovich from '@/mixins/lvovich'
import { ContactResponseInterface, Contacts } from '@/api/Contacts'
import { Route } from 'vue-router'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { secondsToHmsDigital } from '@/utils/datetime'
import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'
import vuescroll from 'vuescroll'
import '@/plugins/libphonenumber-js'
import { MainSearchMethod } from '@/Interfaces'

interface TabInterface {
  name: string;
  icon: string;
  disabled: boolean;
  to?: string | Route;
}

export default (Vue as VueConstructor<Vue & any>).extend({
  mixins: [lvovich],

  components: {
    vuescroll
  },

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
          name: 'leads_script',
          icon: 'mdi-script-text',
          disabled: false,
          to: {
            name: 'leads_script'
          }
        },
        {
          name: 'leads_history',
          icon: 'mdi-history',
          disabled: false,
          to: {
            name: 'leads_history'
          }
        },
        {
          name: 'leads_task',
          icon: 'mdi-clipboard-list',
          disabled: false,
          to: {
            name: 'leads_task'
          }
        }
      ] as TabInterface[],
      dataLoading: true,
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
        created_at: 0
      } as ContactInterface
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

  beforeRouteUpdate (to, from, next) {
    if (from.params.contact_id !== to.params.contact_id) {
      const contacts: Contacts = new Contacts()

      this.dataLoading = true
      contacts
        .getById(+to.params.contact_id)
        .then((contact: ContactInterface) => {
          this.contact = contact
        }).finally(() => {
          this.dataLoading = false
          this.$root.$emit('root-loading-data-hide')
        })
    }
    next()
  },

  created () {
    const contacts: Contacts = new Contacts()

    this.dataLoading = true
    contacts
      .getById(+this.$route.params.contact_id)
      .then((contact: ContactInterface) => {
        // this.$route.title = `${contact.first_name} ${contact.last_name}`
        this.contact = contact
      }).finally(() => {
        this.dataLoading = false
        this.$root.$emit('root-loading-data-hide')
      })
  },

  beforeDestroy () {
    this.$root.$off('root-main-search', this.onRootMainSearch)
    this.$root.$off('root-main-search-selected', this.onRootMainSearchSelected)
  },

  methods: {

    onRootMainSearch (q: string, set: MainSearchMethod) {
      new Contacts()
        .search({
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
      this.$jsSIP.call(target, {contact_id: contactId, target})
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
    }
  }
})
</script>

<style lang="scss">
.tool-bar div {
  padding-left: 0;
}

.session-stopwatch {
  font-family: monospace;
  font-size: 1.4rem;
  color: #9C27B0;
}
</style>
