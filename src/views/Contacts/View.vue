<template>
  <v-sheet style="height: calc(100vh - 88px);">
    <template v-if="loading">
      <div class="d-flex align-center justify-center fill-height">
        <div>
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="contactNotFound">
      <app-error
        :title="$tc('Contact not found.')"
        :sub-title="$tc('If the error persists, contact your service representative.')"
      />
    </template>
    <v-sheet v-else>
      <v-row>
        <v-col
          v-bind="colAttributeLeft"
          cols="12"
        >
          <v-sheet
            :style="leftColumnStyleComputed"
            class="fill-height"
            flat
            tile
          >
            <app-tools>
              <template #left>
                <span style="font-weight: 500">
                  {{ contact.contact_name || '+0 000 000-00-00' }}
                </span>
              </template>
            </app-tools>
            <v-divider class="mb-2" />

            <app-tools>
              <template #right>
                <v-btn
                  :x-small="$vuetify.breakpoint.md"
                  :small="!$vuetify.breakpoint.md"
                  color="primary"
                  class="mr-2"
                  text
                  outlined
                  tile
                  @click="taskDialogVisible = true"
                >
                  {{ $tc('Add task') }}
                </v-btn>
                <v-btn
                  v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state)"
                  :x-small="$vuetify.breakpoint.md"
                  :small="!$vuetify.breakpoint.md"
                  class="mr-0"
                  color="error"
                  text
                  outlined
                  tile
                  @click="$jsSIP.cancel()"
                >
                  {{ $tc('To complete') }}
                </v-btn>
                <v-btn
                  v-else
                  :x-small="$vuetify.breakpoint.md"
                  :small="!$vuetify.breakpoint.md"
                  :disabled="callBtnIsDisabled"
                  class="mr-0"
                  color="primary"
                  text
                  outlined
                  tile
                  @click="onBtnCallClick(contact.default_phone.raw, contact.id)"
                >
                  {{ $tc('Call') }}
                </v-btn>
                <v-btn
                  v-if="!$jsSIP.isConnected"
                  :x-small="$vuetify.breakpoint.md"
                  :small="!$vuetify.breakpoint.md"
                  :to="{ name: 'settings_telephony' }"
                  class="ml-1 mr-0"
                  color="error"
                  icon
                  @click="onBtnCallErrorClick"
                >
                  <v-icon>mdi-alert-circle-outline</v-icon>
                </v-btn>
              </template>
            </app-tools>

            <app-tools>
              <template #right>
                <span>
                  {{ $jsSIP.sessionStopwatch }}
                </span>
              </template>
            </app-tools>
            <v-divider class="mt-4" />

            <v-list
              :dense="$vuetify.breakpoint.md"
              tile
            >
              <!-- Номера телефонов -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
              />
              <template v-else>
                <v-list-item
                  v-for="(phone, phoneIndex) in contact.phones"
                  :key="`phone-list-item-${phoneIndex}`"
                  ripple
                  link
                  selectable
                >
                  <v-list-item-avatar>
                    <v-icon
                      v-if="phoneIndex === 0"
                      color="primary"
                    >
                      mdi-phone
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ phone.international }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ phone.label || $tc('No label') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state) && $jsSIP.target === phone.raw"
                      :key="`phone-cancel-btn-${phoneIndex}`"
                      small
                      icon
                      @click="$jsSIP.cancel()"
                    >
                      <v-icon color="red">
                        mdi-phone-hangup
                      </v-icon>
                    </v-btn>
                    <v-btn
                      v-else
                      :key="`phone-call-btn-${phoneIndex}`"
                      :disabled="callBtnIsDisabled"
                      icon
                      small
                      @click="onBtnCallClick(phone.raw, contact.id)"
                    >
                      <v-icon>mdi-phone</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>

              <!-- Адреса электронной почты -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
              />
              <template v-else>
                <v-list-item
                  v-for="(email, emailIndex) in contact.emails"
                  :key="`email-list-item-${emailIndex}`"
                  ripple
                  link
                  selectable
                >
                  <v-list-item-avatar size="30">
                    <v-icon v-if="emailIndex === 0">
                      mdi-email
                    </v-icon>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title>{{ email.value }}</v-list-item-title>
                    <v-list-item-subtitle>{{ email.label || $tc('No label') }}</v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      :key="`mail-to-btn-${emailIndex}`"
                      small
                      icon
                      disabled
                    >
                      <v-icon>mdi-email</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </template>

              <v-divider class="mt-5" />

              <!-- Геолокация -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
                max-height="61"
              />
              <v-list-item
                v-else
              >
                <v-list-item-avatar size="30">
                  <v-icon color="primary">
                    mdi-map-marker
                  </v-icon>
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
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
                max-height="61"
              />
              <v-list-item
                v-else
              >
                <v-list-item-avatar size="30">
                  <v-icon color="primary">
                    mdi-clock-time-two-outline
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title :key="clientTimeTick">
                    {{ $dayjs(new Date()).tz(contact.tz).format(`${date_time_format.short_date} ${date_time_format.long_time} (Z)`) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $tc('Client\'s current time') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Дата создания контакта -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
                max-height="61"
              />
              <v-list-item
                v-else
              >
                <v-list-item-avatar size="30">
                  <v-icon color="primary">
                    mdi-clock
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $dayjs(contact.created_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $tc('Date the contact was created') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Владелец -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
                max-height="61"
              />
              <v-list-item
                v-else
              >
                <v-list-item-avatar size="30">
                  <v-icon color="primary">
                    mdi-account
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ contactOwnerName }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $tc('Responsible') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Проект -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
                max-height="61"
              />
              <v-list-item
                v-else-if="contactProject"
              >
                <v-list-item-avatar size="30">
                  <v-icon color="primary">
                    mdi-projector-screen
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ contactProject }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $tc('Project') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- Теги -->
            <template v-if="contact.tags.length">
              <v-card-text class="pa-0 text-right">
                <v-divider />
              </v-card-text>
              <v-card-text class="px-0 text-right">
                <v-chip-group>
                  <v-chip
                    v-for="(item, key) in contact.tags"
                    :key="key"
                    :color="item.color"
                    label
                    small
                    outlined
                  >
                    {{ item.name }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </template>
            <!-- Теги -->

            <!-- Заметки -->
            <template v-if="contact.notes">
              <v-card-text class="pa-0">
                <v-divider />
              </v-card-text>
              <v-card-text class="px-0 text-justify">
                <p v-html="contact.notes" />
              </v-card-text>
            </template>
            <!-- Заметки -->

            <v-card-text class="pa-0 text-right">
              <v-divider />
            </v-card-text>
            <v-card-text class="px-0 text-right">
              <v-btn
                color="primary"
                text
                outlined
                small
                tile
                @click="onContactEditClick($route.params.contact_id)"
              >
                {{ $tc('Edit contact') }}
              </v-btn>
            </v-card-text>
          </v-sheet>
        </v-col>

        <!-- Tabs -->
        <v-col
          v-bind="colAttributeRight"
          cols="12"
          class="pl-md-0 pl-lg-0"
        >
          <v-card
            :height="tabsHeight"
            class="d-flex flex-column"
            flat
            tile
          >
            <v-card-actions class="px-0">
              <v-tabs
                height="35"
              >
                <template v-for="(tab, tabIndex) in tabs">
                  <v-tab
                    v-if="tab.visible"
                    :key="`tab-${tabIndex}`"
                    :to="tab.to"
                  >
                    <v-icon left>
                      {{ tab.icon }}
                    </v-icon>
                    {{ $tc(`route.${tab.name}`) }}
                    <v-spacer />
                  </v-tab>
                </template>
              </v-tabs>
            </v-card-actions>

            <v-card-text class="pa-0 ">
              <v-divider />
            </v-card-text>

            <v-card-text class="px-0 py-1 flex-grow-1 overflow-y-auto">
              <keep-alive>
                <router-view />
              </keep-alive>
            </v-card-text>

            <!-- Статусы -->
            <v-fade-transition mode="in-out">
              <v-card-text
                v-if="status.visible"
                class="pa-0"
                style="border-top: solid rgb(58,112,212);"
              >
                <app-status
                  v-model="status.status_id"
                  :options="contact.project.statuses"
                  min-height="300"
                  @on-close="status.visible = false"
                />

                <!-- Комментарий -->
                <div class="pt-5">
                  <v-textarea
                    v-model="status.comment"
                    :placeholder="$t('Comment')"
                    rows="4"
                    outlined
                    hide-details
                  >
                    <template #prepend-inner>
                      <v-icon>
                        mdi-comment
                      </v-icon>
                    </template>
                    <template #append>
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
                </div>

                <!-- Оценить качество связи -->
                <div class="py-2">
                  <v-btn
                    :disabled="!(btnRateQualityAvailable && countryAvailable)"
                    color="primary"
                    text
                    tile
                    small
                    @click="onBtnRateQualityClick"
                  >
                    {{ $tc('Rate the quality of the connection') }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-fade-transition>

            <v-card-actions
              class="pa-4 px-0"
              style="border-top: #3a70d4 solid"
            >
              <v-spacer />
              <v-btn-toggle
                color="primary"
                dense
                tile
              >
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      v-bind="attrs"
                      :loading="saveAndNextLoading"
                      :disabled="!status.visible"
                      color="primary"
                      text
                      small
                      v-on="on"
                      @click="onSaveClick"
                    >
                      {{ $t('Save') }}
                    </v-btn>
                  </template>
                  <span>{{ $t('Save and continue') }}</span>
                </v-tooltip>
                <v-menu offset-y>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="primary"
                      v-bind="attrs"
                      :disabled="!status.visible"
                      text
                      icon
                      small
                      v-on="on"
                    >
                      <v-icon color="primary">
                        mdi-arrow-down-drop-circle-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <v-list class="pa-0">
                    <v-list-item
                      link
                      @click="onSaveAndStayClick(status)"
                    >
                      <v-list-item-title>{{ $tc('Сохранить и остаться') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-btn-toggle>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <template v-if="taskDialogVisible">
        <app-task-dialog-edit
          v-model="taskDialogVisible"
          @update="onTaskDialogCreate"
        />
      </template>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import { Calls } from '@/api/Calls'
import { Contacts } from '@/api/Contacts'
import Contact from '@/api/interfaces/Contact'
import {
  ContactEmailInterface,
  ContactPhoneInterface
} from '@/api/Schemas/ContactInterface'
import Tasks from '@/api/Tasks'
import AppCardCommunicationQualityAssessment
  from '@/components/AppCardCommunicationQualityAssessment/AppCardCommunicationQualityAssessment.vue'
import AppStatus from '@/components/AppStatus/AppStatus.vue'
import JSSIPPayloadInterface from '@/interfaces/JSSIPPayloadInterface'
import lvovich from '@/mixins/lvovich'
import { ContactInterface as SCEContactInterface } from '@/snippets/SContactEditor/interfaces'
import SContactDialogEditor from '@/snippets/SContactEditor/SContactDialogEditor.vue'
import store from '@/store'
import { secondsToHmsDigital } from '@/utils/datetime'
import { EndEvent, RTCSession } from 'jssip/lib/RTCSession'
import Vue from 'vue'
import { Location } from 'vue-router/types/router'
import { mapGetters } from 'vuex'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

interface JsSIPSessionEnded {
  target: string;
  session: RTCSession;
  event: EndEvent;
}

interface Tab {
  name: string;
  icon: string;
  visible: boolean;
  to?: string | Location;
}

interface IStatus {
  /** Положительный идентификатор статуса. */
  status_id: number;
  /** Положительный идентификатор контакта. */
  contact_id: number;
  /** Положительный идентификатор исторической записи. */
  contact_history_id: number;
  /** Видимость компонента выбора статуса. */
  visible: boolean;
  /** Комментарий */
  comment: string;
}

interface Data {
  rtcSessionAudioRecordId: string;
  rtcSession?: RTCSession;
  processLoadingContact: boolean;
  contact: Contact;
  contactNotFound: boolean;
  [key: string]: any;
}

interface Methods {
  [key: string]: any;
}

interface Computed {
  tabs: Tab[];
  [key: string]: any;
}

interface Props {
  [key: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({

  components: {
    AppError: () => import('@/components/AppError/AppError.vue'),
    AppLoading,
    AppTaskDialogEdit: () => import('@/components/AppTaskDialogEdit/AppTaskDialogEdit.vue'),
    AppStatus
  },

  mixins: [lvovich],

  beforeRouteEnter (to, from, next) {
    if (from.fullPath !== '/') {
      // Сохраняю маршрут, откуда пришёл
      store.commit('system/route/full_path', from.fullPath)
    }
    next()
  },

  beforeRouteLeave (to, from, next) {
    let answer = true

    if (this.status.visible) {
      answer = this.$confirm()
    }

    if (answer) {
      this.$activity.end()
      next()
    } else {
      next(false)
    }
  },

  data (): Data {
    return {
      taskDialogVisible: false,
      rtcSessionAudioRecordId: '',
      rtcSession: undefined,
      processLoadingContact: false,
      contact: {
        id: 0,
        first_name: '',
        last_name: '',
        middle_name: '',
        contact_name: '',
        default_phone: undefined,
        project: {
          id: 0,
          name: '',
          description: '',
          owner: undefined,
          scenario: '',
          statuses: [],
          created_at: 0
        },
        owner: undefined,
        status: null,
        city: '',
        notes: '',
        tags: [],
        emails: [],
        phones: [],
        created_at: 0,
        tz: 'Europe/Moscow'
      },
      statuses: {
        historyId: 0,
        visible: false
      },
      saveAndNextLoading: false,
      status: {
        status_id: 0,
        contact_id: 0,
        contact_history_id: 0,
        visible: false,
        comment: ''
      } as IStatus,
      clientTimeTick: 0,
      btnRateQualityAvailable: true,
      contactNotFound: false,
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      settingsNavigationDrawerMini: 'settings/navigation_drawer_mini'
    }),

    colAttributeLeft () {
      return {
        lg: this.settingsNavigationDrawerMini ? 3 : 4,
        md: this.settingsNavigationDrawerMini ? 4 : 4
      }
    },

    colAttributeRight () {
      return {
        lg: this.settingsNavigationDrawerMini ? 9 : 8,
        md: this.settingsNavigationDrawerMini ? 8 : 8
      }
    },

    /**
     * Просматриваемый идентификатор контакта.
     */
    contactId (): number {
      return +this.$route.params.contact_id
    },

    /**
     * Делает кнопку позвонить недоступной, если не выполнены условия
     */
    callBtnIsDisabled () {
      return !this.$jsSIP.isConnected || this.status.visible
    },

    leftColumnStyleComputed () {
      return {
        'border-right': '#3a70d4 solid',
        'padding-right': '8px'
      }
    },

    sessionStopwatch () {
      return this.$jsSIP.sessionStopwatch
    },

    tabsHeight () {
      let h: number = this.$screenHeight - 115
      if (h < 850) {
        h = 850
      }
      return h
    },

    tabs (): Tab[] {
      const params = {
        contact_id: this.contactId
      }
      return [
        {
          name: 'contacts_view_script',
          icon: 'mdi-script-text',
          visible: true,
          to: {
            name: 'contacts_view_scenario',
            params
          }
        },
        {
          name: 'contacts_view_history',
          icon: 'mdi-history',
          visible: true,
          to: {
            name: 'contacts_view_history',
            params
          }
        },
        {
          name: 'contacts_view_tasks',
          icon: 'mdi-clipboard-list',
          visible: true,
          to: {
            name: 'contacts_view_tasks',
            params
          }
        }
      ]
    },

    contactOwnerName () {
      const collection: string[] = []

      if (this.contact?.owner?.first_name) {
        collection.push(this.contact?.owner?.first_name)
      }

      if (this.contact?.owner?.last_name) {
        collection.push(this.contact?.owner?.last_name)
      }
      return collection.join(' ')
    },

    contactProject () {
      return this.contact?.project?.name || false
    },

    countryAvailable (): boolean {
      return Boolean(this.$store.getters['profile/country'])
    }
  },

  watch: {
    'status.visible' (value: boolean) {
      if (!value) {
        window.onbeforeunload = null
      }
    }
  },

  deactivated () {
    this.$destroy()
  },

  mounted () {
    // Обновления времени
    setInterval(() => {
      this.clientTimeTick++
    }, 1000)

    this.fetchContact(this.contactId)
  },

  destroyed () {
    this.$activity.end()
  },

  methods: {
    fetchContact (contact_id: number) {
      this.processLoadingContact = true
      this.loading = true
      new Contacts()
        .getById(contact_id)
        .then((response) => {
          this.$data.contact.id = response.id
          this.$data.contact.first_name = response.first_name
          this.$data.contact.last_name = response.last_name
          this.$data.contact.middle_name = response.middle_name
          this.$data.contact.contact_name = response.contact_name
          this.$data.contact.default_phone = response.default_phone
          this.$data.contact.project = response.project
          this.$data.contact.owner = response.owner
          this.$data.contact.notes = response.notes
          this.$data.contact.city = response.city || this.$tc('No data')
          this.$data.contact.tags = response.tags || []
          this.$data.contact.emails = response.emails || []
          this.$data.contact.phones = response.phones || []
          this.$data.contact.tz = response.tz || 'Europe/Moscow'
          this.$data.contact.last_status = response.status || null
          this.$data.contact.created_at = response.created_at || 0

          this.$store.commit('project/scenario', response.project?.scenario)
        })
        .finally(() => {
          this.processLoadingContact = false
          this.loading = false
        })
        .catch(() => {
          this.contactNotFound = true
        })
    },

    /**
     * Создание новой задачи.
     */
    onTaskDialogCreate (data: unknown & { date: string; time: string; type: string; description: string }) {
      this.$appDebug(data)

      const plannedFor = this.$dayjs(`${data.date} ${data.time}`, 'YYYY-MM-DD HH:mm')
      new Tasks()
        .create({
          contact_id: this.contactId,
          type: data.type,
          planned_for: plannedFor.unix(),
          description: data.description
        }).then(() => {
          this.$toast.success(this.$t('planned_for', { date: plannedFor.format('DD.MM.YYYY HH:mm'), description: data.description }).toString())
        })
    },

    /**
     * @param target Номер телефона.
     * @param contactId Идентификатор контакта.
     */
    onBtnCallClick (target: string, contactId: number) {
      // Закрыть все открытые задачи контакта если есть таковые.
      new Contacts().closeAllTasks(contactId)

      // Обязательно перейти на вкладку сценария!
      this.$router.push({ name: 'contacts_view_scenario', params: this.$route.params })

      this.$appDebug('Звоним: %s', target)
      this.rtcSession = this.$jsSIP.call<JSSIPPayloadInterface>(target, {
        contact_id: contactId,
        target
      })

      this.rtcSession.on('connecting', (event) => {
        if (event.request.hasHeader('Call-ID')) {
          this.rtcSessionAudioRecordId = event.request.getHeader('Call-ID')
        }
      })

      // Легитимное завершение сессии
      this.rtcSession.on('ended', (event: EndEvent) => {
        this.onJsSIPSessionEnded({
          target,
          event,
          session: this.rtcSession
        })
      })

      // Завершение с ошибкой
      this.rtcSession.on('failed', (event) => {
        this.onJsSIPSessionEnded({
          target,
          event,
          session: this.rtcSession
        })
      })

      window.onbeforeunload = (evt: any) => {
        const message = this.$tc('Finish working with the card!')
        if (typeof evt === 'undefined') {
          evt = window.event
        }
        if (evt) {
          evt.returnValue = message
        }
        return message
      }
    },

    onBtnCallErrorClick () {
      // TODO
    },

    /**
     * Данное событие срабатывает когда завершилась сессия звонка
     */
    onJsSIPSessionEnded (data: JsSIPSessionEnded) {
      const historyData = {
        audio_record_id: this.rtcSessionAudioRecordId,
        cause: data.event.cause,
        direction: data.session.direction,
        originator: data.event.originator,
        session_end_time: this.$jsSIP.sessionEndTime.getTime() / 1000,
        session_start_time: this.$jsSIP.sessionStartTime.getTime() / 1000,
        type: 'call',
        target: data.target
      } as any

      // Если есть время разговора
      if ((data.session.start_time) && (data.session.end_time)) {
        historyData.start_timestamp = data.session.start_time.getTime() / 1000
        historyData.end_timestamp = data.session.end_time.getTime() / 1000
      }

      new Contacts()
        .addHistory(this.contact.id, historyData)
        .then((id: number) => {
          // Удаляю из Vuex
          this.$store.dispatch('contacts_new/items_remove_from_store', this.contactId)

          this.$activity.begin({
            type: 'card_filling'
          })

          this.status.visible = true
          this.status.contact_history_id = id
          this.status.contact_id = this.contact.id
        })
    },

    /**
     *
     */
    onContactEditClick (contact_id: number) {
      new Contacts()
        .getById(contact_id)
        .then(async (response) => {
          const instance = await this.$dialog.show(SContactDialogEditor, {
            on: {
              cancel: () => {
                instance.close()
              },

              /** @param data Новые данные контакта **/
              save: (data: SCEContactInterface) => {
                new Contacts()
                  .update(contact_id, {
                    address: data.address,
                    city: data.city,
                    emails: data.emails,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    middle_name: data.middle_name,
                    notes: data.notes,
                    phones: data.phones,
                    region: data.region,
                    tags: data.tags
                  })
                  .then(() => {
                    this.$toast.success(this.$tc('Contact updated'))
                    this.fetchContact(+this.$route.params.contact_id)
                  })
                  .finally(() => (instance.close()))
              }
            },
            title: this.$tc('Editing a contact'),
            value: {
              address: response?.address || '',
              city: response?.city || '',
              emails: response.emails?.map((value: ContactEmailInterface) => {
                return {
                  label: value.label,
                  value: value.value
                }
              }) || [],
              first_name: response?.first_name || '',
              last_name: response?.last_name || '',
              middle_name: response?.middle_name || '',
              notes: response?.notes,
              phones: response.phones?.map((value: ContactPhoneInterface) => {
                return {
                  label: value.label,
                  value: value.raw
                }
              }) || [],
              region: response.region,
              tags: response.tags
            } as SCEContactInterface,
            waitForResult: false,
            width: '60%'
          })
        })
    },

    /**
     * Сохранить статус и остаться на странице
     *
     * @param status
     **/
    async onSaveAndStayClick (status: IStatus) {
      await this.save(status)
    },

    /**
     * Сохранить статус
     *
     */
    async onSaveClick () {
      await this.save()
    },

    /**
     * Событие, генерируется при нажатии на кнопку "оценить качество связи"
     */
    async onBtnRateQualityClick () {
      const dialog = await this.$dialog.show(AppCardCommunicationQualityAssessment, {
        waitForResult: false,
        persistent: true,
        showClose: false,
        handler: (btn: 'ok' | 'cancel', data: {comment: string; rating: number}) => {
          if (btn === 'ok' && data?.rating) {
            new Calls()
              .communicationQualityAssessment({
                contact_id: this.contactId,
                comment: data.comment,
                rating: data.rating
              })
              .then(() => {
                this.btnRateQualityAvailable = false
                this.$toast.success(this.$tc('Thank you for your feedback!'))
              })
          }

          dialog.close()
        }
      })
    },

    async save () {
      if (!this.validate()) {
        return
      }
      this.$activity.end() // Завершаю измерение активности
      window.onbeforeunload = null // Отменяю запрос подтверждения ухода
      this.saveAndNextLoading = true

      return new Contacts()
        .editHistory(this.status.contact_history_id, {
          comment: this.status.comment,
          status_id: this.status.status_id
        }).then(() => {
          // Очистить предыдущий результат выбранного статуса
          this.status.contact_id = 0
          this.status.contact_history_id = 0
          this.status.status_id = 0
          this.status.visible = false
          this.status.comment = ''

          // Вернуться откуда пришёл
          this.$store.dispatch('system/route/navigate')
        }).finally(() => (this.saveAndNextLoading = false))
    },

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    },

    validate (): boolean {
      if (this.status.status_id <= 0) {
        this.$toast.warning('Выберите статус!')
        return false
      }

      return true
    }
  }
})
</script>

<style lang="scss">
.card-left {
  border-right: #3a70d4 solid 4px
}

.tool-bar div {
  padding-left: 0;
}

.session-stopwatch {
  font-family: monospace;
  font-size: 1.4rem;
}
</style>

<i18n>
{
  "ru": {
    "planned_for": "Запланировано на {date} \n {description}"
  }

}
</i18n>
