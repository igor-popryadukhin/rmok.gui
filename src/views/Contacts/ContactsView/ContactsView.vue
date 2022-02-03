<template>
  <v-sheet class="d-flex flex-nowrap">
    <app-block-resize
      :width.sync="settingsLeftWidth"
      :min-width="280"
      :max-width="500"
    >
      <v-sheet
        :height="heightThisPage - 60"
        class="overflow-y-auto fill-height"
      >
        <div class="mb-1">
          <v-tooltip
            open-delay="1300"
            bottom
          >
            <template #activator="{ on, attrs }">
              <span
                v-bind="attrs"
                class="text-truncate"
                style="font-weight: 500"
                v-on="on"
              >
                {{ contactName || '+0 000 000-00-00' }}
              </span>
            </template>
            <span>{{ contactName || '+0 000 000-00-00' }}</span>
          </v-tooltip>
        </div>

        <v-divider class="mb-2" />

        <div class="d-flex align-center mb-3">
          <app-task-dialog-edit
            v-model="taskDialogVisible"
            :dialog-title="$tc('Create a new task')"
            display-format-date="DD.MM.YYYY"
            :type.sync="taskDialog.type"
            :date-time.sync="taskDialog.dateTime"
            :description.sync="taskDialog.description"
            @action:ok:click="onBtnAddTaskClick"
          >
            <template #activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                color="primary"
                x-small
                text
                outlined
                tile
                v-on="on"
              >
                {{ $tc('Add task') }}
              </v-btn>
            </template>
          </app-task-dialog-edit>

          <v-spacer />

          <template v-if="['connecting', 'progress', 'accepted'].includes($dialer.state)">
            <app-tooltip>
              <template #activator="{ on, attrs }">
                <v-btn
                  class="mr-0"
                  color="error"
                  text
                  outlined
                  tile
                  x-small
                  v-bind="attrs"
                  @click="$dialer.hangUp()"
                  v-on="on"
                >
                  {{ $tc('Hang up') }}
                </v-btn>
              </template>
              <span>
                {{ $tc('Click to hang up') }}
              </span>
            </app-tooltip>
          </template>
          <template v-else>
            <app-tooltip>
              <template #activator="{ on, attrs }">
                <v-btn
                  :disabled="!allowDialing"
                  class="mr-0"
                  color="primary"
                  text
                  outlined
                  tile
                  x-small
                  v-bind="attrs"
                  @click="onBtnCallClick(contactDefault)"
                  v-on="on"
                >
                  {{ $tc('Call') }}
                </v-btn>
              </template>
              <span>
                {{ $tc('Click to make a call') }}
              </span>
            </app-tooltip>
          </template>
        </div>

        <div class="">
          <span>
            {{ $dialer.sessionStopwatch }}
          </span>
        </div>

        <v-divider />

        <v-list
          class="py-0"
          dense
          tile
        >
          <!-- Контактные данные -->
          <v-skeleton-loader
            v-if="contactFetching"
            type="list-item-avatar-two-line"
            max-height="61"
          />
          <template v-else>
            <v-list-item
              v-for="(item, itemIndex) in contactDetails"
              :key="`v-list-item-${itemIndex}`"
              color="red"
              ripple
              link
              selectable
            >
              <v-list-item-avatar>
                <v-icon
                  v-if="item.type === 'phone'"
                  color="primary"
                >
                  mdi-phone
                </v-icon>
                <v-icon
                  v-else-if="item.type === 'skype'"
                  color="primary"
                >
                  mdi-skype
                </v-icon>
                <v-icon
                  v-else-if="item.type === 'email'"
                  color="primary"
                >
                  mdi-email-outline
                </v-icon>
                <v-icon
                  v-else-if="item.type === 'whatsapp'"
                  color="primary"
                >
                  mdi-whatsapp
                </v-icon>
                <v-icon
                  v-else
                  color="primary"
                >
                  mdi-chat-outline
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-if="item.type === 'phone'">
                  <app-tooltip>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ formatPhoneNumber(item.value) }}</span>
                    </template>
                    <span>
                      {{ formatPhoneNumber(item.value) }}
                    </span>
                  </app-tooltip>
                </v-list-item-title>
                <v-list-item-title v-else>
                  <app-tooltip>
                    <template #activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ item.value }}</span>
                    </template>
                    <span>
                      {{ item.value }}
                    </span>
                  </app-tooltip>
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.label || $tc('No label') }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <template v-if="item.type === 'phone'">
                  <div
                    class="d-flex flex-row justify-space-between"
                    style="width: 60px;"
                  >
                    <app-tooltip>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="#ff9800"
                          icon
                          small
                          v-bind="attrs"
                          @click="onBtnPhoneNumberDefaultClick(item)"
                          v-on="on"
                        >
                          <v-icon
                            v-if="item.id === contactDefault.id"
                            small
                          >
                            mdi-star
                          </v-icon>
                          <v-icon
                            v-else
                            small
                          >
                            mdi-star-outline
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>
                        {{ $tc('Click to make default number') }}
                      </span>
                    </app-tooltip>
                    <template v-if="item.id !== callerID">
                      <app-tooltip>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            :disabled="!allowDialing"
                            color="primary"
                            icon
                            small
                            v-bind="attrs"
                            @click="onBtnCallClick(item)"
                            v-on="on"
                          >
                            <v-icon small>
                              mdi-phone-dial-outline
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>
                          {{ $tc('Click to make a call') }}
                        </span>
                      </app-tooltip>
                    </template>
                    <template v-else>
                      <app-tooltip>
                        <template #activator="{ on, attrs }">
                          <v-btn
                            color="red"
                            icon
                            small
                            v-bind="attrs"
                            @click="$dialer.hangUp()"
                            v-on="on"
                          >
                            <v-icon small>
                              mdi-phone-hangup-outline
                            </v-icon>
                          </v-btn>
                        </template>
                        <span>
                          {{ $tc('Click to hang up') }}
                        </span>
                      </app-tooltip>
                    </template>
                  </div>
                </template>
                <v-btn
                  v-else-if="item.type === 'email'"
                  color="green"
                  icon
                  small
                >
                  <v-icon small>
                    mdi-email-outline
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else
                  color="green"
                  icon
                  small
                >
                  <v-icon small>
                    mdi-chat-outline
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </template>
          <!-- Контактные данные -->

          <v-divider />

          <!-- Геолокация -->
          <v-skeleton-loader
            v-if="contactFetching"
            type="list-item-avatar-two-line"
            max-height="61"
          />
          <v-list-item
            v-else-if="contactCity || contactRegion"
            link
          >
            <v-list-item-avatar size="30">
              <v-icon color="primary">
                mdi-map-marker
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ contactCity }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ contactRegion }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Текущее время контакта -->
          <v-skeleton-loader
            v-if="contactFetching"
            type="list-item-avatar-two-line"
            max-height="61"
          />
          <v-list-item
            v-else-if="contactTZ"
            link
          >
            <v-list-item-avatar size="30">
              <v-icon color="primary">
                {{ contactTimeIcon }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title :key="contactTimeTick">
                {{ $dayjs().tz(contactTZ).format(`DD.MM.YYYY HH:mm:ss (Z)`) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $tc('Client\'s current time') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Дата создания контакта -->
          <v-skeleton-loader
            v-if="contactFetching"
            type="list-item-avatar-two-line"
            max-height="61"
          />
          <v-list-item
            v-else
            link
          >
            <v-list-item-avatar size="30">
              <v-icon color="primary">
                mdi-clock
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ $dayjs(contactCreatedAt).format('DD.MM.YYYY HH:mm') }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ $tc('Date the contact was created') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <!-- Владелец контакта -->
          <template v-if="contactOwnerId">
            <v-skeleton-loader
              v-if="contactFetching"
              type="list-item-avatar-two-line"
              max-height="61"
            />
            <v-list-item
              v-else
              link
            >
              <v-list-item-avatar size="30">
                <v-icon color="primary">
                  mdi-account
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ contactOwnerFullName }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('Responsible') }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>

          <!-- Проект -->
          <v-skeleton-loader
            v-if="contactFetching"
            type="list-item-avatar-two-line"
            max-height="61"
          />
          <v-list-item
            v-else-if="contactProjectId"
            link
          >
            <v-list-item-avatar size="30">
              <v-icon color="primary">
                mdi-projector-screen
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ contactProjectName }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ $tc('Project') }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <!-- Теги -->
        <template v-if="contactTags.length">
          <div class="pa-0">
            <v-divider />
          </div>
          <div class="px-0 ">
            <v-chip-group>
              <v-chip
                v-for="(item, key) in contactTags"
                :key="key"
                :color="item.color"
                label
                small
                outlined
              >
                {{ item.name }}
              </v-chip>
            </v-chip-group>
          </div>
        </template>
        <!-- Теги -->
      </v-sheet>
      <v-sheet
        height="60"
        class="d-flex align-center"
      >
        <v-btn
          color="primary"
          height="35"
          :loading="unsavedCallPersists"
          :disabled="!isUnsavedCall"
          outlined
          block
          text
          tile
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </v-sheet>
    </app-block-resize>
    <div
      class="pl-2 grow"
      :style="{ width: `${rightWidth}px` }"
    >
      <v-tabs
        :key="`v-tabs-${tick}`"
        v-model="tab"
        class="tabs"
        height="35"
        show-arrows
        optional
      >
        <template v-for="(tab, tabIndex) in tabs">
          <template v-if="tab.contextMenu && tab.contextMenu.length">
            <v-menu
              :key="`v-menu-${tabIndex}`"
              offset-y
            >
              <template #activator="{ on, attrs }">
                <v-tab
                  v-if="tab.visible"
                  :key="`tab-${tabIndex}`"
                  v-bind="attrs"
                  :to="tab.to"
                  :active-class="tab.active_class || ''"
                  :class="tab.class || ''"
                  class="tabs__tab"
                  exact-path
                  exact
                  @contextmenu="(e) => { e.preventDefault(); on.click(e) }"
                >
                  <v-icon left>
                    {{ tab.icon }}
                  </v-icon>
                  {{ $tc(`route.${tab.name}`) }}
                  <v-spacer />
                </v-tab>
              </template>
              <v-list dense>
                <v-list-item
                  v-for="(contextMenuItem, contextMenuItemIndex) in tab.contextMenu"
                  :key="`v-list-item-${contextMenuItemIndex}`"
                  link
                  v-bind="contextMenuItem.attrs"
                  v-on="contextMenuItem.on"
                >
                  <v-list-item-title>{{ contextMenuItem.title }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
          <template v-else>
            <v-tab
              v-if="tab.visible"
              :key="`tab-${tabIndex}`"
              :to="tab.to"
              :active-class="tab.active_class || ''"
              :class="tab.class || ''"
              class="tabs__tab"
              exact-path
              exact
            >
              <v-icon left>
                {{ tab.icon }}
              </v-icon>
              {{ $tc(`route.${tab.name}`) }}
              <v-spacer />
            </v-tab>
          </template>
          <v-divider
            :key="'v-divider-' + tabIndex"
            vertical
          />
        </template>
      </v-tabs>

      <v-divider class="mb-1" />

      <v-sheet
        class="overflow-auto"
        :height="heightThisPage - 40"
        style="width: inherit"
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </v-sheet>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import ContactDetail from '@/api/interfaces/ContactDetail'
import ContactTag from '@/api/interfaces/ContactTag'
import AppBase from '@/AppBase'
import AppBlockResize from '@/components/AppBlockResize/AppBlockResize.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTaskDialogEdit from '@/components/AppTaskDialogEdit/AppTaskDialogEdit.vue'
import dayjs from '@/plugins/dayjs'
import { Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import parsePhoneNumber from 'libphonenumber-js'

const dateTimeFormat = 'YYYY-MM-DDTHH:mm'

// eslint-disable-next-line no-use-before-define
@Component<ContactsView>({
  components: {
    AppTaskDialogEdit,
    AppBlockResize,
    AppLoading
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('contacts/view/fetch', to.params.id)
    })
  },
  beforeRouteUpdate (to, from, next) {
    this.tick++

    if (to.params.id !== from.params.id) {
      this.$store
        .dispatch('contacts/view/fetch', to.params.id)
        .then(() => (next()))
    } else {
      next()
    }
  },
  beforeRouteLeave (to, from, next) {
    let answer = true

    if (this.isUnsavedCall) {
      answer = this.$confirm()
    }

    if (answer) {
      this.$store.dispatch('contacts/view/unsaved_call/flush')
      next()
    } else {
      next(false)
    }
  }
})
export default class ContactsView extends AppBase {
  /** Идентификатор звонящего номера */
  callerID = 0
  tick = 0
  contactTimeTick = 0
  taskDialogVisible = false
  taskDialog = {
    type: 'call',
    // YYYY-MM-DDTHH:mm
    dateTime: dayjs().format(dateTimeFormat),
    description: ''
  }

  get tab () { return this.$route.path }
  set tab (value: string) { this.$appDebug('Tab: %s', value) }

  get tabs () {
    return [
      {
        name: 'contacts_view_status',
        icon: 'mdi-list-status',
        visible: this.isUnsavedCall,
        active_class: 'red--text',
        class: 'red--text',
        to: {
          name: 'contacts_view_status'
        },
        contextMenu: [
          {
            title: 'Закрыть',
            on: {
              click: () => {
                this.$store.dispatch('contacts/view/unsaved_call/flush')
              }
            }
          }
        ]
      },
      {
        name: 'contacts_view_scenario',
        icon: 'mdi-script-text',
        visible: true,
        to: {
          name: 'contacts_view_scenario'
        }
      },
      {
        name: 'contacts_view_history',
        icon: 'mdi-history',
        visible: true,
        to: {
          name: 'contacts_view_history'
        }
      },
      {
        name: 'contacts_view_tasks',
        icon: 'mdi-clipboard-list',
        visible: true,
        to: {
          name: 'contacts_view_tasks'
        }
      },
      {
        name: 'contacts_view_chat',
        icon: 'mdi-facebook-messenger',
        visible: false,
        to: {
          name: 'contacts_view_chat'
        }
      }
    ]
  }

  get heightThisPage () {
    return this.screenHeight - 75
  }

  get contactFetching (): boolean {
    return this.$store.getters['contacts/view/fetching']
  }

  get settingsLeftWidth (): number { return this.$store.getters['contacts/view/settings/left_width'] }
  set settingsLeftWidth (val: number) {
    if (val > 279) { this.$store.commit('contacts/view/settings/left_width', val) }
  }

  get rightWidth (): number { return this.containerWidth - this.settingsLeftWidth - 35 }

  get settingsRightWidth (): number { return this.$store.getters['contacts/view/settings/right_width'] }
  set settingsRightWidth (val: number) { this.$store.commit('contacts/view/settings/right_width', val) }

  get contactName () { return this.$store.getters['contacts/view/contact_name'] }
  get contactTags (): ContactTag[] { return this.$store.getters['contacts/view/contact_tags'] }
  get contactOwnerId (): number { return this.$store.getters['contacts/view/contact_owner_id'] }
  get contactOwnerFullName (): string { return this.$store.getters['contacts/view/contact_owner_full_name'] }
  get contactProjectId (): number { return this.$store.getters['contacts/view/contact_project_id'] }
  get contactProjectName (): string { return this.$store.getters['contacts/view/contact_project_name'] }
  get contactDetails (): ContactDetail[] { return this.$store.getters['contacts/view/contact_details'] }
  get contactDefault (): ContactDetail|null { return this.$store.getters['contacts/view/contact_details_default'] }
  get contactTZ (): string { return this.$store.getters['contacts/view/contact_tz'] }
  get contactCreatedAt (): string { return this.$store.getters['contacts/view/contact_created_at'] }
  get contactCity (): string { return this.$store.getters['contacts/view/contact_city'] }
  get contactRegion (): string { return this.$store.getters['contacts/view/contact_region'] }
  get contactTimeIcon (): string {
    return 'mdi-clock-time-nine-outline'
  }

  get unsavedCallPersists (): boolean { return this.$store.getters['contacts/view/unsaved_call/persists'] }
  get isUnsavedCall (): boolean { return this.$store.getters['contacts/view/unsaved_call/unsaved'] }
  get isUnsavedCallStatusId (): number { return this.$store.getters['contacts/view/unsaved_call/data_status_id'] }

  /** Состояние активности кнопки вызова */
  get allowDialing (): boolean {
    return this.$dialer.isConnected() &&
      this.$dialer.isRegistered() &&
      !this.contactFetching &&
      !this.isUnsavedCall
  }

  @Watch('isUnsavedCall')
  isUnsavedCallWatchHandler (val: boolean) {
    if (val) {
      this.$router.push({
        name: 'contacts_view_status',
        params: { id: String(this.$route.params.id) }
      })
    } else {
      this.$router.push({
        name: 'contacts_view_history',
        params: { id: String(this.$route.params.id) }
      })
    }
  }

  public created () {
    setInterval(() => (this.contactTimeTick++), 1000)

    this.$root.$on('dialer-session-finality', this.onDialerSessionFinality)
  }

  public beforeDestroy () {
    this.$root.$off('dialer-session-finality', this.onDialerSessionFinality)
  }

  private onDialerSessionFinality () {
    this.callerID = 0
  }

  /**
   * Совершает вызов.
   *
   * @param phone
   */
  private onBtnCallClick (phone: ContactDetail) {
    this.$audio.play('/sounds/tick.mp3')

    if (phone.type !== 'phone') {
      return this.$toast.error('Not a phone number!')
    }

    const session = this.$dialer.call(phone.value)

    session.data.contact_id = this.$route.params.id
    session.data.contact_name = this.contactName
    session.data.target = phone.value

    this.callerID = phone.id
  }

  private onBtnPhoneNumberDefaultClick (item: ContactDetail) {
    if (item.type === 'phone' && item.id !== this.contactDefault.id) {
      this.$store.commit('contacts/view/contact_details_default', item)
      this.$axios.patch(`/contacts/${this.$route.params.id}`, {
        default_phone_id: item.id
      }).then((response) => {
        if (![200, 204].includes(response.status)) {
          throw new APIError(response.data)
        }
        this.$toast.success('Changes accepted')
      }).catch((reason: Error) => {
        this.$toast.error(reason.message)
      })
    }
  }

  private onBtnSaveClick () {
    if (this.isUnsavedCallStatusId > 0) {
      // Оператор сможет принимать вызовы.
      this.$axios.put('/account/dnd/false')

      this.$store.dispatch('contacts/view/unsaved_call/persist')
    } else {
      this.$toast.warning('Пожалуйста, выберите статус')
      this.$router.push({
        name: 'contacts_view_status',
        params: { id: String(this.$route.params.id) }
      })
    }
  }

  /**
   * Создаёт новую задачу.
   *
   * @private
   */
  private async onBtnAddTaskClick () {
    this.$axios.post('/tasks', {
      type: this.taskDialog.type,
      description: this.taskDialog.description,
      planned_for: this.$dayjs(this.taskDialog.dateTime, dateTimeFormat).toISOString(),
      contact_id: this.$route.params.id
    }).then((response) => {
      if (response.status === 201) {
        this.$toast.success('Task created')
        this.taskDialog.description = ''
      }
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
.tabs {}
.tabs__tab {}
.tab-color--red {
  color: #f57474;
}
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<i18n>
{
  "ru": {
    "Click to make a call": "Нажмите, чтобы позвонить",
    "Click to hang up": "Нажмите, чтобы повесить трубку",
    "Click to make default number": "Нажмите, чтобы сделать номером по умолчанию",
    "delete_confirmation_1": "<b>Удалить {n} контакт?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_2": "<b>Удалить {n} контакта?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_3": "<b>Удалить {n} контактов?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation": "NaN | @:delete_confirmation_1 | @:delete_confirmation_2 | @:delete_confirmation_3",
    "selected_elements": " | Выбран {n} контакт |  Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>
