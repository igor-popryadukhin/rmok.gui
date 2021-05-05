<template>
  <v-row>
    <v-col
      :style="leftColumnStyleComputed"
      cols="12"
      md="4"
      lg="3"
    >
      <v-card
        class="fill-height"
        :style="leftColumnStyleComputed"
        flat
        tile
      >
        <v-card-title class="mb-2 py-2 px-0">
          {{ contact.last_name }} {{ contact.first_name }} {{ contact.middle_name }}
        </v-card-title>
        <v-card-subtitle
          v-if="assertObjectHasAttribute(contact.default_phone, 'international')"
          class="px-0"
        >
          {{ contact.default_phone.international }}
        </v-card-subtitle>
        <v-card-text class="py-0 px-0 d-flex justify-end">
          <v-btn
            color="primary"
            class="mr-2"
            text
            outlined
            small
            tile
            @click="onTaskAddClick"
          >
            {{ $tc('Add task') }}
          </v-btn>
          <v-btn
            v-if="['accepted', 'call', 'connecting', 'progress'].includes($jsSIP.state)"
            text
            outlined
            small
            tile
            color="red"
            @click="$jsSIP.cancel()"
          >
            {{ $tc('To complete') }}
          </v-btn>
          <v-btn
            v-else
            :disabled="callBtnIsDisabled"
            color="primary"
            text
            outlined
            small
            tile
            @click="onCall(contact.default_phone.raw, contact.id)"
          >
            {{ $tc('Call') }}
          </v-btn>
        </v-card-text>
        <v-card-text class="d-flex align-center justify-end pb-0 px-0">
          <span>{{ $jsSIP.sessionStopwatch }}</span>
        </v-card-text>
        <v-divider class="mt-4"/>
        <v-card-text
          class="px-0"
        >
          <v-list
            :style="leftColumnStyleComputed"
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
                  <v-list-item-subtitle v-if="['idle'].includes($jsSIP.state)">
                    {{ phone.label }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ $jsSIP.sessionStopwatch }}
                  </v-list-item-subtitle>
                </v-item-group>
                <v-spacer/>
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
                    :disabled="callBtnIsDisabled"
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
                <v-spacer/>
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

            <v-divider class="mt-5"/>

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
                <v-list-item-title :key="clientTimeTick">{{ $moment().tz(contact.tz).format('DD.MM.YYYY hh:mm:ss (Z)') }}
                </v-list-item-title>
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

            <!-- Владелец -->
            <v-skeleton-loader
              v-if="dataLoading"
              type="list-item-avatar-two-line"
              max-height="61"
            />
            <v-list-item
              v-else
            >
              <v-list-item-avatar size="30">
                <v-icon color="primary">mdi-account</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ contact.responsible.first_name }} {{ contact.responsible.last_name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('Responsible') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
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
            {{ $tc('Редактировать контакт') }}
          </v-btn>
        </v-card-text>
      </v-card>
    </v-col>

    <!-- Tabs -->
    <v-col
      cols="12"
      md="8"
      lg="9"
      class="pl-md-0 pl-lg-0"
    >
      <v-card
        :height="tabsHeight"
        class="d-flex flex-column"
        flat
        tile
      >
        <v-card-actions class="px-4">
          <v-tabs
            v-model="currentTabIndex"
            height="35"
          >
            <v-tab
              v-for="(tab, tabIndex) in tabs"
              :key="`tab-${tabIndex}`"
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
          <v-divider/>
        </v-card-text>

        <v-card-text class="py-1 flex-grow-1 overflow-y-auto">
          <component
            :ref="tabs[currentTabIndex].ref"
            :is="tabs[currentTabIndex].component"
          />
        </v-card-text>

        <!-- Статусы -->

        <v-fade-transition mode="in-out">
          <v-card-text v-show="status.visible" class="py-0">
            <s-contact-statuses
              v-model="status.status_id"
              min-height="200"
              @on-close="status.visible = false"
            />

            <v-divider/>

            <v-textarea
              v-model="status.comment"
              :placeholder="$t('Comment')"
              rows="4"
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
          </v-card-text>
        </v-fade-transition>

        <v-footer color="white" class="pa-4">
          <v-spacer/>
          <v-btn-toggle
            color="primary"
            dense
            tile
          >
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-on="on"
                  v-bind="attrs"
                  :loading="saveAndNextLoading"
                  :disabled="!status.visible"
                  color="primary"
                  text
                  @click="onSaveClick(status)"
                >
                  {{ $t('Save') }}
                </v-btn>
              </template>
              <span>{{ $t('Save and continue') }}</span>
            </v-tooltip>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  v-bind="attrs"
                  v-on="on"
                  :disabled="!status.visible"
                  text
                  icon
                >
                  <v-icon color="primary">mdi-arrow-down-drop-circle-outline</v-icon>
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
        </v-footer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { ContactResponseInterface, Contacts } from '@/api/Contacts'
import Leads from '@/api/Leads'
import { ContactEmailInterface, ContactInterface, ContactPhoneInterface } from '@/api/Schemas/ContactInterface'
import { PhoneNumberInterface } from '@/api/Schemas/PhoneNumberInterface'
import Tasks, { TaskInterface } from '@/api/Tasks'
import JSSIPPayloadInterface from '@/interface/JSSIPPayloadInterface'
import { REJssipSessionEndedInterface } from '@/interface/REJssipSessionEndedInterface'
import { MainSearchMethod } from '@/Interfaces'
import lvovich from '@/mixins/lvovich'
import '@/plugins/libphonenumber-js'
import { ContactInterface as SCEContactInterface } from '@/snippets/SContactEditor/interfaces'
import SContactDialogEditor from '@/snippets/SContactEditor/SContactDialogEditor.vue'
import SContactStatuses from '@/snippets/SContactStatuses/SContactStatuses.vue'
import STaskDialogEditor from '@/snippets/STaskList/STaskDialogEditor.vue'
import store from '@/store'
import { secondsToHmsDigital } from '@/utils/datetime'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'
import { Route } from 'vue-router'

interface TabInterface {
  name: string;
  icon: string;
  disabled: boolean;
  to?: string | Route;
  ref: string;
  component?: any;
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

export default (Vue as VueConstructor<VInterface>).extend({
  beforeDestroy () {
    this.$root.$off('root-main-search', this.onRootMainSearch)
    this.$root.$off('root-main-search-selected', this.onRootMainSearchSelected)
    this.$root.$off('root-jssip-session-ended', this.onRootJssipSessionEnded)
  },

  beforeRouteEnter (to, from, next) {
    // Сохраняю маршрут, откуда пришёл
    store.commit('system/route_last_full_path', from.fullPath)
    new Contacts()
      .getById(+to.params.contact_id)
      .then((response: ContactInterface) => {
        // TODO: Фамилия имя отчество в хлебных крошках
        // from.meta.route_breadcrumb_name = `${response.first_name} ${response.last_name} ${response.middle_name}`
        next((vm: VInterface) => {
          vm.$activity.begin({
            type: 'card_filling'
          })
          vm.contact = response
        })
      }).catch(() => {
        next({ name: 'not_found' })
      })
  },

  beforeRouteLeave (to, from, next) {
    this.$activity.end()
    next()
  },

  beforeRouteUpdate (to, from, next) {
    if (from.params.contact_id !== to.params.contact_id) {
      const contacts: Contacts = new Contacts()
      this.$activity.end()
      this.dataLoading = true
      contacts
        .getById(+to.params.contact_id)
        .then((contact: ContactInterface) => {
          this.$activity.begin({
            type: 'card_filling'
          })
          this.contact = contact
        }).finally(() => {
          this.tabPageUpdate()
          this.dataLoading = false
        })
    }
    next()
  },

  components: { SContactStatuses },

  computed: {
    avatar () {
      const first: string = this.contact.first_name || ''
      const last: string = this.contact.last_name || ''
      return first.charAt(0) + last.charAt(0)
    },

    /**
     * Делает кнопку позвонить недоступной, если не выполнены условия
     **/
    callBtnIsDisabled () {
      return !this.$jsSIP.isConnected || !this.assertObjectHasAttribute(this.contact.default_phone, 'raw') || !this.$libPhoneNumberJs.validate(this.contact.default_phone.raw) || this.status.visible
    },

    leftColumnStyleComputed () {
      return {}
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
    }
  },

  created () {
    if (this.assertObjectHasAttribute(this.$route.query, 'current_tab_index')) {
      this.currentTabIndex = Number(this.$route.query.current_tab_index)
    }

    this.$root.$on('root-jssip-session-ended', this.onRootJssipSessionEnded)
    this.$store.dispatch('database/statuses', {
      contact_id: this.$route.params.contact_id
    })
  },

  data () {
    return {
      /* eslint-disable */
      statuses: {
        historyId: 0,
        visible: false
      },
      currentTabIndex: 0,
      tabs: [
        {
          name: 'operator_contacts_view_script',
          icon: 'mdi-script-text',
          disabled: false,
          to: {
            name: 'operator_contacts_view_script'
          },
          ref: 'script',
          component: () => import('./Script.vue')
        },
        {
          name: 'operator_contacts_view_history',
          icon: 'mdi-history',
          disabled: false,
          to: {
            name: 'operator_contacts_view_history'
          },
          ref: 'history',
          component: () => import('./History.vue')
        },
        {
          name: 'operator_contacts_view_tasks',
          icon: 'mdi-clipboard-list',
          disabled: false,
          to: {
            name: 'operator_contacts_view_tasks'
          },
          ref: 'task',
          component: () => import('./Task.vue')
        }
      ] as TabInterface[],
      saveAndNextLoading: false,
      dataLoading: false,
      status: {
        status_id: 0,
        contact_id: 0,
        contact_history_id: 0,
        visible: false,
        comment: ''
      } as IStatus,
      contact: {
        city: '',
        default_phone: undefined,
        emails: [],
        first_name: '',
        id: 0,
        last_name: '',
        middle_name: '',
        owner: null,
        phones: [] as ContactPhoneInterface[],
        user: undefined,
        created_at: 0,
        last_status: null,
        tz: 'Europe/Moscow'
      },
      clientTimeTick: 0
      /* eslint-enable */
    }
  },

  destroyed () {
    this.$activity.end()
  },

  methods: {

    /**
     * Перейти к следующему контакту
     * Передайте действительный идентификатор контакта, для того что бы загрузить очередной контакт
     *
     * @param current_contact_id
     */
    nextContact (current_contact_id: number) {
      new Leads()
        .next(current_contact_id)
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
          this.$router.push({
            name: 'operator_leads'
          })
        }).finally(() => {
          this.saveAndNextLoading = false
        })
    },

    onCall (target: string, contactId: number) {
      /* eslint-disable */
      this.$jsSIP.call<JSSIPPayloadInterface>(target, {
        contact_id: contactId,
        target
      })

      // Формируем объект с параметрами, для поиска задача статуса pending
      const contactParams = {
        contact_id: String(this.contact.id),
        planned_for: 'all',
        state: 'pending'
      }

      new Tasks()
        .find<any, TaskInterface[]>(contactParams)
        .then(response => response.data)
        .then(data => {
          if (data.length) {
            data.map(t => {
              new Tasks().setState(t.id, 'done')
            })
          } else {
            this.$toast.success(this.$tc('Is tasks status pending'))
          }
        }).catch(e => console.log(e))
      /* eslint-enable */
    },

    /**
     *
     **/
    onContactEditClick (contact_id: number) {
      new Contacts()
        .getById(contact_id)
        .then(async (response: ContactInterface) => {
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
                  }).then(() => {
                    this.$toast.success(this.$tc('Contact updated'))
                  }).finally(() => (instance.close()))
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

    onDefaultPhoneSet (value?: PhoneNumberInterface) {
      /* eslint-disable */
      if (value) {
        this.contact.default_phone = value
        new Contacts().setDefaultPhoneNumber(this.contact.id, value?.id)
      }
      /* eslint-enable */
    },

    onRootJssipSessionEnded (event: REJssipSessionEndedInterface) {
      this.showStatuses()
      this.status.contact_id = event.contact_id
      this.status.contact_history_id = event.contact_history_id
    },

    onRootMainSearch (q: string, set: MainSearchMethod) {
      new Contacts()
        .find({
          count: 10,
          offset: 0,
          q
        }).then((response: ContactResponseInterface) => {
          set(response.items.map((e: ContactInterface) => {
            return {
              ...e,
              subtitle: e.city,
              title: `${e.first_name} ${e.last_name}`
            }
          }))
        })
    },

    onRootMainSearchSelected (data: ContactInterface) {
      this.$router.push({ path: `/contacts/${data.id}/script` })
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
     * @param status
     **/
    async onSaveClick (status: IStatus) {
      await this.save(status)

      // Переход на страницу откуда пришел
      if (this.$store.getters['system/route_last_full_path']) {
        this.$router.push(this.$store.getters['system/route_last_full_path'])
      }

      // // Если оператор, то открываем страницу со следующим контактом, если таковой имеется.
      // if (this.$store.getters['profile/role_use'] === 'for_calls') {
      //   this.nextContact(+this.$route.params.contact_id)
      // }
    },

    onTaskAddClick () {
      this.$dialog.show(STaskDialogEditor, {
        onSave: (data: any) => {
          const taskData: any = {
            contact_id: +this.$route.params.contact_id,
            description: data.description,
            performer_id: data.performer_id,
            planned_for: data.planned_for,
            type: data.type
          }

          new Tasks()
            .add<number>(taskData)
            .then(() => {
              this.$toast.success(this.$tc('Task successfully created'))
            }).catch((e: APIError) => {
              let text = ''
              if (this.assertObjectHasAttribute(e, 'errors')) {
                text = e.errors.map(e => e.message).join('\n')
              }
              this.$toast.error(`${e.message}\n${text}`)
            }).finally(() => {
              this.tabPageUpdate()
            })
        },
        performerId: this.$store.getters['profile/id'],
        persistent: true,
        responsibleDisabled: true,
        waitForResult: true,
        width: ['xs', 'sm'].includes(this.$vuetify.breakpoint.name) ? '100%' : '45%'
      })
    },

    async save (status: IStatus) {
      if (!this.validate()) {
        return
      }

      this.saveAndNextLoading = true
      return new Promise<void>((resolve) => {
        new Contacts()
          .updateHistory(status.contact_history_id, {
            // Идентификатор статуса для истории
            comment: status.comment,
            status_id: status.status_id // Комментарий для истории.
          }).then(() => {
          // Через секунду обновляю текущую страницу в Tab
            setTimeout(() => {
              this.tabPageUpdate()
            }, 500)

            // Очистить предыдущий результат выбранного
            status.contact_id = 0
            status.contact_history_id = 0
            status.status_id = 0
            status.visible = false
            status.comment = ''

            resolve()
          }).finally(() => (this.saveAndNextLoading = false))
      })
    },

    secondsToHmsDigital (s: number) {
      return secondsToHmsDigital(s)
    },

    /**
     * Показать статусы
     */
    showStatuses () {
      this.status.visible = true
    },

    /**
     * Обновит текущую страницу во вкладке
     **/
    tabPageUpdate () {
      // Незамысловатый механизм доступа к методам компонента
      setTimeout(() => {
        if (typeof this.$refs[this.tabs[this.currentTabIndex].ref].update === 'function') {
          this.$refs[this.tabs[this.currentTabIndex].ref].update()
        }
      }, 1000)
    },

    validate (): boolean {
      if (this.status.status_id <= 0) {
        this.$toast.warning('Выберите статус!')
        return false
      }

      return true
    }
  },

  mixins: [lvovich],

  mounted () {
    this.$root.$on('root-main-search', this.onRootMainSearch)
    this.$root.$on('root-main-search-selected', this.onRootMainSearchSelected)
    // Prevent booting or closing a tab!!!
    // window.onbeforeunload = () => {
    //   return true
    // }

    setInterval(() => {
      this.clientTimeTick++
    }, 1000)
  },

  watch: {
    currentTabIndex (val: number) {
      this.$routerQuery.setQuery({
        current_tab_index: val
      })
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
}
</style>
