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
          <v-btn
            v-if="['connecting', 'progress', 'accepted'].includes($dialer.state)"
            class="mr-0"
            color="error"
            text
            outlined
            tile
            x-small
            @click="$dialer.hangUp()"
          >
            {{ $tc('Hang up') }}
          </v-btn>
          <v-btn
            v-else
            :disabled="!$dialer.isConnected() && !$dialer.isRegistered() || contactFetching || isUnsavedCall"
            class="mr-0"
            color="primary"
            text
            outlined
            tile
            x-small
            @click="onBtnCallClick(contactDefaultPhoneNumber)"
          >
            {{ $tc('Call') }}
          </v-btn>
        </div>

        <div class="">
          <span>
            {{ $dialer.sessionStopwatch }}
          </span>
        </div>

        <v-divider class="mb-2" />

        <v-list
          dense
          tile
        >
          <!-- Контактные данные -->

          <v-list-item
            v-for="(item, itemIndex) in contactDetails"
            :key="`v-list-item-${itemIndex}`"
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
                {{ formatPhoneNumber(item.value) }}
              </v-list-item-title>
              <v-list-item-title v-else>
                {{ item.value }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.label || $tc('No label') }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                v-if="item.type === 'phone'"
                color="green"
                icon
                small
                @click="onBtnCallClick(item.value)"
              >
                <v-icon small>
                  mdi-phone
                </v-icon>
              </v-btn>
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

          <v-divider class="mt-5" />

          <!-- Геолокация -->
          <v-skeleton-loader
            v-if="contactFetching"
            type="list-item-avatar-two-line"
            max-height="61"
          />
          <v-list-item
            v-else-if="contactCity || contactRegion"
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
import ContactDetail from '@/api/interfaces/ContactDetail'
import ContactEmail from '@/api/interfaces/ContactEmail'
import ContactPhone from '@/api/interfaces/ContactPhone'
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
    next(vm => {
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
          name: 'contacts_view_chat',
          params: {
            chat_id: 1
          }
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
  get contactPhones (): ContactPhone[] { return this.$store.getters['contacts/view/contact_phones'] }
  get contactEmails (): ContactEmail[] { return this.$store.getters['contacts/view/contact_emails'] }
  get contactDefaultPhoneNumber (): string { return this.$store.getters['contacts/view/contact_default_phone_number'] }
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
  }

  /**
   * Совершает вызов.
   *
   * @param target
   * @private
   */
  private onBtnCallClick (target: string) {
    const session = this.$dialer.call(target)

    session.data.contact_id = this.$route.params.id
    session.data.contact_name = this.contactName
    session.data.target = target
  }

  private onBtnSaveClick () {
    if (this.isUnsavedCallStatusId > 0) { this.$store.dispatch('contacts/view/unsaved_call/save') } else {
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
    "delete_confirmation_1": "<b>Удалить {n} контакт?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_2": "<b>Удалить {n} контакта?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_3": "<b>Удалить {n} контактов?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation": "NaN | @:delete_confirmation_1 | @:delete_confirmation_2 | @:delete_confirmation_3",
    "selected_elements": " | Выбран {n} контакт |  Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>
