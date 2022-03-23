<template>
  <div class="contacts-view d-flex flex-nowrap">
    <app-block-resize
      :width.sync="settingsLeftWidth"
      :min-width="280"
      :max-width="500"
    >
      <div
        class="d-flex flex-column"
        style="height: 85px;"
      >
        <div
          class="d-flex justify-space-between align-center "
          style="padding: 0 0 4px 0;"
          @mouseenter="editContactNameButtonVisible = true"
          @mouseleave="editContactNameButtonVisible = false"
        >
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
          <app-contact-name-popup-editor
            :first-name="contactFirstName"
            :last-name="contactLastName"
            :middle-name="contactMiddleName"
            @click:btn:save="onAppContactNamePopupEditorSaveClick"
          >
            <template #activator="{ on }">
              <v-fade-transition>
                <v-btn
                  v-show="editContactNameButtonVisible"
                  icon
                  x-small
                  v-on="on"
                >
                  <v-icon small>
                    mdi-pencil
                  </v-icon>
                </v-btn>
              </v-fade-transition>
            </template>
          </app-contact-name-popup-editor>
        </div>

        <app-divider />

        <div
          class="d-flex align-center"
          style="padding: 5px 0px 5px 0;"
        >
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
                  :disabled="!allowDialing || !contactAllowCall"
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
          <span style="font-family: monospace, sans-serif;">
            {{ $dialer.sessionStopwatch }}
          </span>
        </div>
      </div>
      <v-divider />
      <div
        style="height: calc(100vh - 245px)"
        class="overflow-y-auto"
      >
        <template v-if="contactFetching && !contactName">
          <div class="d-flex justify-center align-start py-10">
            <app-loading />
          </div>
        </template>
        <template v-else>
          <v-list
            class="py-0"
            dense
            tile
          >
            <!-- Контактные данные -->
            <v-list-item
              v-for="(item, itemIndex) in contactDetails"
              :key="`v-list-item-${itemIndex}`"
              color="red"
              ripple
              link
              selectable
              @mouseenter="contactDetailsHoverId = item.id"
              @mouseleave="contactDetailsHoverId = null"
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
                    class="d-flex flex-row"
                  >
                    <app-contact-details-popup-menu-editor
                      :id="item.id"
                      :type="item.type"
                      :label="item.label"
                      :value="item.value"
                      @click:btn:save="onAppContactDetailsPopupMenuEditorSave"
                    >
                      <template #activator="{ on, attrs }">
                        <v-fade-transition>
                          <v-btn
                            v-show="contactDetailsHoverId === item.id"
                            :id="'contactDetailsBtnEdit' + item.id"
                            icon
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon small>
                              mdi-pencil
                            </v-icon>
                          </v-btn>
                        </v-fade-transition>
                        <app-tooltip :activator="'#contactDetailsBtnEdit' + item.id">
                          {{ $tc('Click to start editing') }}
                        </app-tooltip>
                      </template>
                    </app-contact-details-popup-menu-editor>

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
                            :disabled="!allowDialing || !contactAllowCall"
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
                <template v-else-if="item.type === 'email'">
                  <div
                    class="d-flex flex-row"
                  >
                    <app-contact-details-popup-menu-editor
                      :id="item.id"
                      :type="item.type"
                      :label="item.label"
                      :value="item.value"
                      @click:btn:save="onAppContactDetailsPopupMenuEditorSave"
                    >
                      <template #activator="{ on, attrs }">
                        <v-fade-transition>
                          <v-btn
                            v-show="contactDetailsHoverId === item.id"
                            :id="'contactDetailsBtnEdit' + item.id"
                            icon
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon small>
                              mdi-pencil
                            </v-icon>
                          </v-btn>
                        </v-fade-transition>
                        <app-tooltip :activator="'#contactDetailsBtnEdit' + item.id">
                          {{ $tc('Click to start editing') }}
                        </app-tooltip>
                      </template>
                    </app-contact-details-popup-menu-editor>
                  </div>
                </template>
                <template v-else>
                  <app-tooltip>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        :loading="channelSetProcess.includes(item.id)"
                        color="primary"
                        icon
                        small
                        v-on="on"
                        @click="onBtnContactDetailsItemClick(item)"
                      >
                        <v-icon small>
                          mdi-chat-outline
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>
                      {{ $tc('Click to write a message') }}
                    </span>
                  </app-tooltip>
                </template>
              </v-list-item-action>
            </v-list-item>
            <!-- Контактные данные -->

            <v-divider />

            <!-- Геолокация -->
            <v-list-item
              link
              @mouseenter="editContactLocationButtonVisible = true"
              @mouseleave="editContactLocationButtonVisible = false"
            >
              <v-list-item-avatar size="30">
                <v-icon color="primary">
                  mdi-map-marker
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>
                  {{ contactLocation.city }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ contactLocation.region }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <app-contact-location-popup-editor
                  :city="contactLocation.city"
                  :region="contactLocation.region"
                  @click:btn:save="onAppContactLocationPopupEditorSaveClick"
                >
                  <template #activator="{ on }">
                    <v-fade-transition>
                      <v-btn
                        v-show="editContactLocationButtonVisible"
                        icon
                        x-small
                        v-on="on"
                      >
                        <v-icon small>
                          mdi-pencil
                        </v-icon>
                      </v-btn>
                    </v-fade-transition>
                  </template>
                </app-contact-location-popup-editor>
              </v-list-item-action>
            </v-list-item>

            <!-- Текущее время контакта -->
            <v-list-item
              v-if="contactTZ"
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
            <v-list-item link>
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
            <v-list-item
              v-if="contactOwnerId"
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

            <!-- Проект -->
            <v-list-item
              :disabled="!contactProject"
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

            <!-- Проект -->
            <v-list-item
              v-if="contactLastStatus"
              :color="contactLastStatus.color"
              link
            >
              <v-list-item-avatar size="30">
                <v-icon :color="contactLastStatus.color">
                  mdi-state-machine
                </v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ contactLastStatus.name }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ $tc('Current result') }}
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
        </template>
      </div>
      <div
        class="d-flex align-center"
        style="height: 60px"
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
      </div>
    </app-block-resize>
    <div class="pl-2 flex-grow-1">
      <v-tabs
        :key="`v-tabs-${tick}`"
        v-model="tab"
        class="tabs"
        height="28"
        show-arrows
        optional
        hide-slider
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
              {{ $tc(`tabs.${tab.name}`) }}
              <v-spacer />
            </v-tab>
          </template>
          <v-divider
            :key="'v-divider-' + tabIndex"
            vertical
          />
        </template>
      </v-tabs>

      <app-divider class="mb-2" />

      <div
        class="overflow-auto"
        style="height: calc(100vh - 137px)"
      >
        <keep-alive>
          <router-view />
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import ContactDetail from '@/api/interfaces/ContactDetail'
import ContactTag from '@/api/interfaces/ContactTag'
import Location from '@/api/interfaces/Location'
import AppBase from '@/AppBase'
import AppBlockResize from '@/components/AppBlockResize/AppBlockResize.vue'
import AppDigitalNumber from '@/components/AppDigitalNumber/AppDigitalNumber.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import dayjs from '@/plugins/dayjs'
import $store from '@/store'
import parsePhoneNumber from 'libphonenumber-js'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

const dateTimeFormat = 'YYYY-MM-DDTHH:mm'

// eslint-disable-next-line no-use-before-define
@Component<ContactsView>({
  components: {
    AppDigitalNumber,
    AppBlockResize,
    AppLoading,
    AppContactLocationPopupEditor: () => import(
      /* webpackChunkName: "components-app-contact-location-popup-editor" */
      '@/components/AppContactLocationPopupEditor/AppContactLocationPopupEditor.vue'
      ),
    AppContactNamePopupEditor: () => import(
      /* webpackChunkName: "components-app-contact-name-popup-editor" */
      '@/components/AppContactNamePopupEditor/AppContactNamePopupEditor.vue'
      ),
    AppPopupMenu: () => import(
      /* webpackChunkName: "components-app-popup-menu" */
      '@/components/AppPopupMenu/AppPopupMenu.vue'
      ),
    AppContactDetailsPopupMenuEditor: () => import(
      /* webpackChunkName: "components-app-contact-details-popup-menu-editor" */
      '@/components/AppContactDetailsPopupMenuEditor/AppContactDetailsPopupMenuEditor.vue'
      ),
    AppTaskDialogEdit: () => import(
      /* webpackChunkName: "components-app-task-dialog-edit" */
      '@/components/AppTaskDialogEdit/AppTaskDialogEdit.vue'
      )
  },
  beforeRouteEnter (to, from, next) {
    $store
      .dispatch('contacts/view/fetch', to.params.id)
      .then(() => {
        next((vm) => {
          vm.route_from_full_path = from.fullPath
        })
      }).catch((reason: Error) => {
        if (reason instanceof APIError && reason.error_code === 'not_found') {
          // Контакт не удалось найти по причине его отсутствия
          next({ name: 'contacts_view_not_found', params: {  id: to.params.id} })
        } else {
          // Другие причины
          next({ name: 'contacts_view_error', params: {  id: to.params.id} })
        }
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
  async beforeRouteLeave (to, from, next) {
    let answer = true

    if (this.isUnsavedCall) {
      answer = this.$confirm()
    }

    if (answer) {
      this.userStatusUpdate(this.$profile.status)
      setTimeout(() => {
        this.$store.dispatch('contacts/view/unsaved_call/flush')
        this.$store.dispatch('contacts/view/history/flush')
        this.$store.dispatch('contacts/view/tasks/flush')
        this.$store.dispatch('contacts/view/messages/flush')
      }, 0)
      await next()
    } else {
      next(false)
    }
  }
})
export default class ContactsView extends AppBase {

  /** Откуда пришёл */
  route_from_full_path = null
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
  eventSource: EventSource | null = null
  channelSetProcess = []
  contactDetailsHoverId: number | null = null
  editContactNameButtonVisible = false
  editContactLocationButtonVisible = false

  get tab () {
    return this.$route.path
  }

  set tab (value: string) {
    this.$appDebug('Tab: %s', value)
  }

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
        name: 'contacts_view_messages',
        icon: 'mdi-chat-outline',
        visible: this.messengerAvailable,
        props: {
          disabled: true
        },
        to: {
          name: 'contacts_view_messages'
        }
      }
    ].filter((e) => e.visible)
  }

  get heightThisPage () {
    return this.screenHeight - 75
  }

  get settingsLeftWidth (): number {
    return this.$store.getters['contacts/view/settings/left_width']
  }

  set settingsLeftWidth (val: number) {
    if (val > 279) {
      this.$store.commit('contacts/view/settings/left_width', val)
    }
  }

  get rightWidth (): number {
    return this.containerWidth - this.settingsLeftWidth - 35
  }

  get settingsRightWidth (): number {
    return this.$store.getters['contacts/view/settings/right_width']
  }

  set settingsRightWidth (val: number) {
    this.$store.commit('contacts/view/settings/right_width', val)
  }

  get contactFetching (): boolean {
    return this.$store.getters['contacts/view/fetching']
  }

  get contactName () {
    return this.$store.getters['contacts/view/contact_name']
  }

  get contactFirstName () {
    return this.$store.getters['contacts/view/contact_first_name']
  }

  get contactLastName () {
    return this.$store.getters['contacts/view/contact_last_name']
  }

  get contactMiddleName () {
    return this.$store.getters['contacts/view/contact_middle_name']
  }

  get contactTags (): ContactTag[] {
    return this.$store.getters['contacts/view/contact_tags']
  }

  get contactOwnerId (): number {
    return this.$store.getters['contacts/view/contact_owner_id']
  }

  get contactOwnerFullName (): string {
    return this.$store.getters['contacts/view/contact_owner_full_name']
  }

  get contactProject () {
    return this.$store.getters['contacts/view/contact_project']
  }

  get contactProjectName (): string {
    return this.$store.getters['contacts/view/contact_project_name'] || 'Проект не установлен'
  }

  get contactDetails (): ContactDetail[] {
    return this.$store.getters['contacts/view/contact_details']
  }

  get contactDefault (): ContactDetail | null {
    return this.$store.getters['contacts/view/contact_details_default']
  }

  get contactTZ (): string {
    return this.$store.getters['contacts/view/contact_tz']
  }

  get contactCreatedAt (): string {
    return this.$store.getters['contacts/view/contact_created_at']
  }

  get contactLocation (): Location {
    return this.$store.getters['contacts/view/contact_location']
  }

  get contactAllowCall (): boolean {
    return this.$store.getters['contacts/view/contact_allow_call']
  }

  get contactTimeIcon (): string {
    return 'mdi-clock-time-nine-outline'
  }

  get unsavedCallPersists (): boolean {
    return this.$store.getters['contacts/view/unsaved_call/persists']
  }

  get isUnsavedCall (): boolean {
    return this.$store.getters['contacts/view/unsaved_call/unsaved']
  }

  get isUnsavedCallStatusId (): number {
    return this.$store.getters['contacts/view/unsaved_call/data_status_id']
  }

  get contactLastStatus(): null|Record<'id', number> & Record<'name', string> & Record<'color', string> {
    return this.$store.getters['contacts/view/contact_last_status']
  }

  /** Состояние активности кнопки вызова */
  get allowDialing (): boolean {
    return this.$dialer.isConnected() &&
      this.$dialer.isRegistered() &&
      !this.contactFetching &&
      !this.isUnsavedCall
  }

  get messengerAvailable (): boolean {
    return this.$store.getters['contacts/view/messenger_available']
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

    this.$root.$on('sse:contact:updated', this.onSSEContactUpdated)
    this.$root.$on('dialer:session:accepted', this.onDialerSessionAccepted)
    this.$root.$on('dialer:session:finality', this.onDialerSessionFinality)
  }

  public mounted () {
    this.sseOpen()
  }

  public beforeDestroy () {
    this.$root.$off('sse:contact:updated', this.onSSEContactUpdated)
    this.$root.$off('dialer:session:accepted', this.onDialerSessionAccepted)
    this.$root.$off('dialer:session:finality', this.onDialerSessionFinality)
    this.sseClose()
  }

  private onSSEContactUpdated () {
    this.$store.dispatch('contacts/view/fetch', this.$route.params.id)
  }

  private onDialerSessionAccepted () {
    // TODO: s
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

    if (!this.contactProject) {
      return this.$toast.warning('Запрещено совершать вызов ко')
    }

    // Если вкладка не сценарий, то переходим
    if (this.$route.name !== 'contacts_view_scenario') {
      this.$router.push({
        name: 'contacts_view_scenario'
      })
    }

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

      this.userStatusUpdate(this.$profile.status)

      // Оператор сможет принимать вызовы.
      this.$axios.put('/account/dnd/false')

      this.$store.dispatch('contacts/view/unsaved_call/persist')
        .finally(() => {
          setTimeout(() => {
            if (this.route_from_full_path) {
              this.$router.push(this.route_from_full_path)
              this.route_from_full_path = null
            }
          }, 2000)
        })
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
   * @param item
   * @private
   */
  private onBtnContactDetailsItemClick (item: ContactDetail) {
    switch (item.type) {
      case 'telegram':
      case 'whatsapp': {
        this.channelSetProcess.push(item.id)
        this.$axios.get(`/contacts/channels/${item.id}`)
          .then((response) => {
            if ([200, 204].includes(response.status)) {
              this.$toast.success('Канал установлен')
              this.$store.dispatch('contacts/view/fetch', this.$route.params.id)

              if (this.$route.name !== 'contacts_view_messages') {
                this.$router.push({
                  name: 'contacts_view_messages'
                })
              }
            }
          }).finally(() => {
          const index = this.channelSetProcess.findIndex((value) => value === item.id)
          if (index > -1) {
            this.channelSetProcess.splice(index, 1)
          }
        })
        break
      }
    }
  }

  /**
   * Срабатывает при нажатии на кнопку сохранить в app-contact-details-popup-menu-editor
   *
   * @param data
   * @private
   */
  private onAppContactDetailsPopupMenuEditorSave (data: Record<'type' | 'label' | 'value', string> & Record<'id', number>) {
    this.$axios.patch(`/contacts/contact-details/${data.id}`, {
      label: data.label,
      type: data.type,
      value: data.value
    }).then((response) => {
      if (![200, 204].includes(response.status)) {
        throw new APIError(response.data)
      }
      this.$toast.success('Changes accepted')
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
    })
  }

  /**
   * Срабатывает при нажатии на кнопку сохранить в app-contact-name-popup-editor
   *
   * @param data
   * @private
   */
  private onAppContactNamePopupEditorSaveClick (data: Record<'first_name' | 'last_name' | 'middle_name', string>) {
    this.$axios.patch(`/contacts/${this.$route.params.id}`, {
      first_name: data.first_name,
      last_name: data.last_name,
      middle_name: data.middle_name
    }).then((response) => {
      if (![200, 204].includes(response.status)) {
        throw new APIError(response.data)
      }
      this.$toast.success('Changes accepted')
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
    })
  }

  /**
   * Срабатывает при нажатии на кнопку сохранить в app-contact-location-popup-editor
   *
   * @param data
   * @private
   */
  private onAppContactLocationPopupEditorSaveClick (data: Record<'city' | 'region', string>) {
    this.$axios.patch(`/contacts/${this.$route.params.id}`, {
      city: data.city,
      region: data.region
    }).then((response) => {
      if (![200, 204].includes(response.status)) {
        throw new APIError(response.data)
      }
      this.$toast.success('Changes accepted')
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
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

  /**
   * Открывает соединение SSE.
   * @private
   */
  private sseOpen () {
    if ('VUE_APP_SSE_ENDPOINT' in process.env) {
      const url = new URL('/.well-known/mercure', process.env.VUE_APP_SSE_ENDPOINT)

      // Темы для подписок
      url.searchParams.append('topic', `contacts/${this.$route.params.id}/messages`)

      this.eventSource = new EventSource(url, {
        withCredentials: true
      })

      this.eventSource.addEventListener('messenger:message', this.onSSENewMessage)
    }
  }

  /**
   * Закрывает соединение SSE.
   *
   * @private
   */
  private sseClose () {
    if (this.eventSource instanceof EventSource) {
      this.eventSource.removeEventListener('messenger:message', this.onSSENewMessage)
      this.eventSource.close()
    }
  }

  private onSSENewMessage (event: MessageEvent<string> | Event) {
    if (event instanceof MessageEvent) {
      this.$root.$emit('messenger:message', JSON.parse(event.data))
    }
  }
}

</script>

<style lang="scss" scoped>
.contacts-view {
  height: calc(100vh - 110px);
}

.tabs {
}

.tabs__tab {
}

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
    "tabs": {
      "contacts_view_status": "Статусы",
      "contacts_view_scenario": "Сценарий",
      "contacts_view_history": "История",
      "contacts_view_tasks": "Задачи",
      "contacts_view_messages": "Сообщения"
    },
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
