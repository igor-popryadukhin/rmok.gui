<template>
  <v-sheet style="height: calc(100vh - 88px);">
    <template v-if="loading">
      <div class="d-flex align-center justify-center fill-height">
        <div>
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="contactError">
      <app-error
        :title="$tc(contactErrorCode)"
        :sub-title="$tc(contactErrorMessages)"
      />
    </template>
    <v-sheet v-else>
      <v-row>
        <v-col
          v-bind="colAttributeLeft"
          cols="12"
        >
          <v-card
            :style="leftColumnStyleComputed"
            class="fill-height"
            flat
            tile
          >
            <app-tools>
              <template #left>
                <span style="font-weight: 500">
                  {{ contactViewContactName || '+0 000 000-00-00' }}
                </span>
              </template>
            </app-tools>
            <v-divider class="mb-2" />

            <v-card-text class="d-flex align-center pa-0 mb-4">
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
              <v-spacer />
              <v-btn
                v-if="btnHangUpVisible && incomingDialogVisible === false"
                :x-small="$vuetify.breakpoint.md"
                :small="!$vuetify.breakpoint.md"
                class="mr-0"
                color="error"
                text
                outlined
                tile
                @click="$dialer.hangUp()"
              >
                {{ $tc('Hang up') }}
              </v-btn>
              <v-btn
                v-else
                :x-small="$vuetify.breakpoint.md"
                :small="!$vuetify.breakpoint.md"
                :disabled="btnCallDisable || incomingDialogVisible"
                class="mr-0"
                color="primary"
                text
                outlined
                tile
                @click="onBtnCallClick(contactViewDefaultPhone.raw)"
              >
                {{ $tc('Call') }}
              </v-btn>
            </v-card-text>

            <v-card-text class="pa-0">
              <span>
                {{ $dialer.sessionStopwatch }}
              </span>
            </v-card-text>
            <v-divider />

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
                  v-for="(phone, phoneIndex) in contactViewPhones"
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
                      :key="`phone-call-btn-${phoneIndex}`"
                      :disabled="btnCallDisable"
                      icon
                      small
                      @click="onBtnCallClick(phone.raw)"
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
                  v-for="(email, emailIndex) in contactViewEmails"
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
                  <v-list-item-title>
                    {{ contactViewCity }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ contactViewRegion }}
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
                    {{ $dayjs().tz(contactViewTz).format(`${date_time_format.short_date} ${date_time_format.long_time} (Z)`) }}
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
                    {{ $dayjs(contactViewCreatedAt * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $tc('Date the contact was created') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <!-- Владелец контакта -->
              <template v-if="contactViewOwner">
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
                    <v-list-item-title>{{ contactViewOwner.full_name }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ $tc('Responsible') }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>

              <!-- Проект -->
              <v-skeleton-loader
                v-if="processLoadingContact"
                type="list-item-avatar-two-line"
                max-height="61"
              />
              <v-list-item
                v-else-if="contactViewProject"
              >
                <v-list-item-avatar size="30">
                  <v-icon color="primary">
                    mdi-projector-screen
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ contactViewProject.name }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ $tc('Project') }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <!-- Теги -->
            <template v-if="contactViewTags.length">
              <v-card-text class="pa-0 text-right">
                <v-divider />
              </v-card-text>
              <v-card-text class="px-0 text-right">
                <v-chip-group>
                  <v-chip
                    v-for="(item, key) in contactViewTags"
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
            <template v-if="contactViewNotes">
              <v-card-text class="pa-0">
                <v-divider />
              </v-card-text>
              <v-card-text class="px-0 text-justify">
                <p v-html="contactViewNotes" />
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
          </v-card>
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
                v-if="unsavedCallUnsaved"
                class="pa-0"
                style="border-top: solid rgb(58,112,212);"
              >
                <app-status
                  v-model="unsavedCallUnsavedDataStatusId"
                  :options="contactViewStatuses"
                  min-height="300"
                />

                <!-- Комментарий -->
                <div class="pt-5">
                  <v-textarea
                    v-model="unsavedCallUnsavedDataContactComment"
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
                      :disabled="!unsavedCallUnsaved"
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
                      :disabled="!unsavedCallUnsaved"
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
                      @click="onSaveAndStayClick()"
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
import APIError from '@/api/classes/APIError'
import { Contacts } from '@/api/Contacts'
import {
  ContactEmailInterface,
  ContactPhoneInterface
} from '@/api/Schemas/ContactInterface'
import Tasks from '@/api/Tasks'
import AppCardCommunicationQualityAssessment
  from '@/components/AppCardCommunicationQualityAssessment/AppCardCommunicationQualityAssessment.vue'
import AppStatus from '@/components/AppStatus/AppStatus.vue'
import lvovich from '@/mixins/lvovich'
import { ContactInterface as SCEContactInterface } from '@/snippets/SContactEditor/interfaces'
import SContactDialogEditor from '@/snippets/SContactEditor/SContactDialogEditor.vue'
import store from '@/store'
import { secondsToHmsDigital } from '@/utils/datetime'
import { RTCSession, IncomingEvent, OutgoingEvent } from 'jssip/lib/RTCSession'
import Vue from 'vue'
import { Location } from 'vue-router/types/router'
import { mapGetters } from 'vuex'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

interface Tab {
  name: string;
  icon: string;
  visible: boolean;
  to?: string | Location;
}

interface Data {
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
    console.log(to)
    next()
  },

  beforeRouteUpdate (to, from, next) {
    if (from.params.contact_id !== to.params.contact_id) {
      this.processLoadingContact = true
      this.$store
        .dispatch('contact_view/get_by_id', +to.params.contact_id)
        .catch((e: APIError) => {
          this.contactErrorCode = e.error_code
          this.contactErrorMessages = e.error_message
          this.contactError = true
        }).finally(() => {
          this.processLoadingContact = false
        })
    }

    next()
  },

  beforeRouteLeave (to, from, next) {
    let answer = true

    if (this.unsavedCallUnsaved) {
      answer = this.$confirm()
    }

    if (answer) {
      this.$accountMonitoring.end()
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
      saveAndNextLoading: false,
      clientTimeTick: 0,
      btnRateQualityAvailable: true,
      contactError: false,
      contactErrorCode: '',
      contactErrorMessages: '',
      loading: false
    }
  },

  computed: {
    ...mapGetters({
      settingsNavigationDrawerMini: 'settings/navigation_drawer_mini',

      settingsPcConfig: 'settings/pc_config',

      // Информация о контакте входящего вызова
      contactIncomingContactId: 'contact_incoming/id',

      // Текущий контакт, соответствует текущему маршруту
      contactViewContactId: 'contact_view/id',
      contactViewContactName: 'contact_view/contact_name',
      contactViewTags: 'contact_view/tags',
      contactViewPhones: 'contact_view/phones',
      contactViewEmails: 'contact_view/emails',
      contactViewCity: 'contact_view/city',
      contactViewRegion: 'contact_view/region',
      contactViewTz: 'contact_view/tz',
      contactViewCreatedAt: 'contact_view/created_at',
      contactViewOwner: 'contact_view/owner',
      contactViewProject: 'contact_view/project',
      contactViewNotes: 'contact_view/notes',
      contactViewDefaultPhone: 'contact_view/default_phone',

      incomingDialogVisible: 'incoming_dialog/visible',

      // Незавершенные действия с контактом
      unsavedCallUnsaved: 'unsaved_call/unsaved',
      unsavedCallUnsavedDataContactId: 'unsaved_call/data/contact_id',
      unsavedCallUnsavedDataContactHistoryId: 'unsaved_call/data/contact_history_id'
    }),

    /**
     * Текущие статусы контакта
     */
    contactViewStatuses () {
      return this.contactViewProject?.statuses || []
    },

    /**
     * Не сохранённый статус
     */
    unsavedCallUnsavedDataStatusId: {
      get () {
        return this.$store.getters['unsaved_call/data/status_id']
      },
      set (val: number) {
        return this.$store.commit('unsaved_call/data/status_id', val)
      }
    },

    /**
     * Не сохранённый комментарий
     */
    unsavedCallUnsavedDataContactComment: {
      get () {
        return this.$store.getters['unsaved_call/data/comment']
      },
      set (val: string) {
        return this.$store.commit('unsaved_call/data/comment', val)
      }
    },

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
     * Вернёт True если звонилка в процессе.
     */
    btnHangUpVisible () {
      return ['accepted', 'call', 'connecting', 'progress'].includes(this.$dialer.state)
    },

    /**
     * Делает кнопку позвонить недоступной, если не выполнены условия
     */
    btnCallDisable () {
      return !(this.$dialer.isConnected() && this.$dialer.isRegistered()) || this.unsavedCallUnsaved
    },

    leftColumnStyleComputed () {
      return {
        'border-right': '#3a70d4 solid',
        'padding-right': '8px'
      }
    },

    sessionStopwatch () {
      return this.$dialer.sessionStopwatch
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
        contact_id: this.contactViewContactId
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

    countryAvailable (): boolean {
      return Boolean(this.$store.getters['profile/country'])
    }
  },

  created () {
    this.$root.$on('dialer-session-connection', this.onSessionConnecting)
    this.$root.$on('dialer-session-progress', this.onSessionProgress)
    this.$root.$on('dialer-session-accepted', this.onSessionAccepted)
    this.$root.$on('dialer-session-ended', this.onSessionEnded)
    this.$root.$on('dialer-session-failed', this.onSessionFailed)
    this.$root.$on('dialer-session-finality', this.onSessionFinality)
  },

  mounted () {
    // Обновления времени
    setInterval(() => {
      this.clientTimeTick++
    }, 1000)

    this.fetchContact(+this.$route.params.contact_id)
  },

  beforeDestroy () {
    this.$root.$off('dialer-session-connection', this.onSessionConnecting)
    this.$root.$off('dialer-session-progress', this.onSessionProgress)
    this.$root.$off('dialer-session-accepted', this.onSessionAccepted)
    this.$root.$off('dialer-session-ended', this.onSessionEnded)
    this.$root.$off('dialer-session-failed', this.onSessionFailed)
    this.$root.$off('dialer-session-finality', this.onSessionFinality)
  },

  destroyed () {
    this.$accountMonitoring.end()
  },

  methods: {
    fetchContact (contact_id: number) {
      this.processLoadingContact = true
      this.loading = true
      this.$store
        .dispatch('contact_view/get_by_id', contact_id)
        .catch((e: APIError) => {
          this.contactErrorCode = e.error_code
          this.contactErrorMessages = e.error_message
          this.contactError = true
        }).finally(() => {
          this.processLoadingContact = false
          this.loading = false
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
          contact_id: this.contactViewContactId,
          type: data.type,
          planned_for: plannedFor.unix(),
          description: data.description
        }).then(() => {
          this.$toast.success(this.$t('planned_for', { date: plannedFor.format('DD.MM.YYYY HH:mm'), description: data.description }).toString())
        })
    },

    /**
     * @param target Номер телефона.
     */
    onBtnCallClick (target: string) {
      // Закрыть все открытые задачи контакта если есть таковые.
      new Contacts().closeAllTasks(+this.$route.params.contact_id)
      // Обязательно перейти на вкладку сценария!
      this.$router.push({ name: 'contacts_view_scenario', params: this.$route.params })
      const session = this.$dialer.call(target)

      session.data.contact_id = this.contactViewContactId
      session.data.contact_name = this.contactViewContactName
      session.data.target = target
    },

    onSessionConnecting (session: RTCSession, event) {
      // TODO: Handler
    },

    onSessionProgress (session: RTCSession, event: IncomingEvent | OutgoingEvent) {
      // TODO: Handler
    },

    /**
     * Срабатывает, когда звонок принят (2XX received/sent).
     *
     * @param session
     * @param event
     */
    onSessionAccepted (session: RTCSession, event) {
      // TODO: Handler
    },

    onSessionEnded (session: RTCSession, event) {
      // TODO: Handler
    },

    /**
     * Срабатывает, когда сеанс не может быть установлен.
     *
     * @param session
     * @param event
     */
    onSessionFailed (session: RTCSession, event) {
      // TODO: Handler
    },

    /**
     * Срабатывает в любом случае, не зависимо от исхода.
     * @param session
     * @param event
     */
    onSessionFinality (session: RTCSession, event) {
      // Заполняет карточку после завершения разговора.
      this.$accountMonitoring.begin('card_filling')

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
     */
    onSaveAndStayClick () {
      this.save()
    },

    /**
     * Сохранить статус
     *
     */
    onSaveClick () {
      this.save()
        .then(() => {
        // Вернуться откуда пришёл
          this.$store.dispatch('system/route/navigate')
        })
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
                contact_id: this.contactViewContactId,
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
      return new Promise<void>((resolve) => {
        if (!this.validate()) {
          throw new Error('Choose a status!')
        }

        this.$accountMonitoring.end() // Завершаю измерение активности
        window.onbeforeunload = null // Отменяю запрос подтверждения ухода
        this.saveAndNextLoading = true

        this.$store
          .dispatch('unsaved_call/save')
          .finally(() => {
            resolve()
            this.saveAndNextLoading = false
          })
      })
    },

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    },

    validate (): boolean {
      if (!this.unsavedCallUnsavedDataStatusId) {
        this.$toast.warning('Choose a status!')
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
