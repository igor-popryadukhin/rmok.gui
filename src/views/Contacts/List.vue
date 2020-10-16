<template>
  <div>
    <v-card
      flat
    >
      <v-card-text class="pa-0">
        <v-toolbar
          flat
          class="pl-3"
        >
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on }">
              <v-checkbox
                ref="checkboxSelectedAll"
                v-model="checkboxSelectedAll.checked"
                :indeterminate="checkboxSelectedAll.indeterminate"
                @click="onSelectedAllClick($refs.checkboxSelectedAll)"
                v-on="on"
              />
            </template>
            <span>{{ $tc('select_all_contacts') }}</span>
          </v-tooltip>
          <v-spacer />
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :to="{ name: 'contacts_new' }"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('add_new_contact') }}</span>
          </v-tooltip>
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                v-bind="attrs"
                :disabled="buttonImport.disabled"
              >
                <v-icon>mdi-import</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('import_contact') }}</span>
          </v-tooltip>
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="tooltipActivator">
              <v-menu offset-y>
                <template v-slot:activator="menuActivator">
                  <v-btn
                    icon
                    v-bind="menuActivator.attrs"
                    v-on="menuActivator.on"
                    :disabled="buttonExport.disabled"
                  >
                    <v-icon
                      v-on="tooltipActivator.on"
                      v-bind="tooltipActivator.attrs"
                    >mdi-export</v-icon>
                  </v-btn>
                </template>
                <v-list min-width="200">
                  <v-list-item
                    ripple
                    link
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ $tc('export_to_file') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-list-item
                    ripple
                    link
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ $tc('export_to_operator') }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <span>{{ $tc('export_contact') }}</span>
          </v-tooltip>
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :disabled="buttonDelete.disabled"
                @click="onSelectedDeleteClick"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('delete_selected_contacts') }}</span>
          </v-tooltip>
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :disabled="buttonBlacklist.disabled"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-block-helper</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('block_selected_contacts') }}</span>
          </v-tooltip>
        </v-toolbar>
      </v-card-text>
      <v-row class="ma-0">
        <v-col
          cols="12"
          md="8"
          lg="8"
        >
          <template v-if="contacts.length > 0">
            <template
              v-for="item in contacts"
            >
              <v-divider
                :key="`divider-${item.id}`"
              />
              <v-list-item
                :key="`list-item-${item.id}`"
                ripple
                selectable
                @click.stop="onContactItemClick(item)"
              >
                <v-list-item-action>
                  <v-checkbox
                    v-model="item.checked"
                    @click.stop="onCheckBoxItemClick(item)"
                  ></v-checkbox>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.first_name }} {{ item.last_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.phone_number_default">{{item.phone_number_default.type}}: {{ item.phone_number_default.value }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-else>Нет номера по умолчанию</v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-content>
                  <v-list-item-title
                    v-if="item.user"
                    class="text-right"
                  >{{ item.user.first_name }} {{ item.user.last_name }}
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    icon
                    large
                    :disabled="!item.phone_number_default"
                    @click.stop="onCall(item.id, item.phone_number_default.value)"
                  >
                    <v-icon>mdi-phone</v-icon>
                  </v-btn>
                </v-list-item-action>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        large
                        v-bind="attrs"
                        v-on.stop="on"
                      >
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        :to="{ name: 'contacts_edit', params: { id: item.id } }"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-square-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Редактировать</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        :to="{ name: 'contacts_history', params: { contact_id: item.id } }"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-history</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>История</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon>mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Удалить</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </template>
          <template v-else>
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('contact_list_empty') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
        </v-col>
        <v-col
          cols="12"
          md="4"
          lg="4"
        >
          <v-card
            flat
            outlined
          >
            <v-card-text class="">
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on }">
                  <v-combobox
                    v-model="select"
                    :items="items"
                    :label="$tc('responsible')"
                    small-chips
                    multiple
                    outlined
                    dense
                    v-on="on"
                    style="max-width: 400px"
                  ></v-combobox>
                </template>
                <span>{{ $tc('Фильтр') }}</span>
              </v-tooltip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

    <!-- Dialog -->
    <v-row justify="center">
      <v-dialog
        v-model="dialog"
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
              :disabled="['call', 'accepted'].includes(uaMachineCurrentState.value)"
              @click="dialog = false"
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
                    v-for="(phone, phoneIndex) in contact.phone_numbers"
                    :key="phoneIndex"
                    ripple
                    link
                    selectable
                  >
                    <v-list-item-avatar size="30">
                      <v-icon v-if="phoneIndex === 0">mdi-phone</v-icon>
                    </v-list-item-avatar>
                    <v-item-group>
                      <v-list-item-title>{{ $parsePhoneNumber(phone.value).formatNational() }}</v-list-item-title>
                      <v-list-item-subtitle>{{ phone.type }}</v-list-item-subtitle>
                    </v-item-group>
                    <v-spacer />
                    <v-item-group
                      v-if="['accepted'].includes(uaMachineCurrentState.value) && uaMachineCurrentState.context.session && uaMachineCurrentState.context.target === phone.value"
                    >
                      {{ secondsToHms(uaMachineCurrentState.context.seconds) }}
                    </v-item-group>
                    <v-list-item-action>
                      <v-btn
                        v-if="['call', 'accepted'].includes(uaMachineCurrentState.value) && uaMachineCurrentState.context.target === phone.value"
                        :key="phone.value"
                        icon
                        @click="onCancelCall()"
                      >
                        <v-icon color="red">mdi-phone-hangup</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        :disabled="['call', 'accepted'].includes(uaMachineCurrentState.value) && uaMachineCurrentState.context.target !== phone.value"
                        icon
                        :key="phone.value"
                        @click="onCall(contact.id, phone.value)"
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
                        <v-list-item-title>{{ $parsePhoneNumber(item.target).formatNational() }}</v-list-item-title>
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ContactResponseInterface, Contacts } from '@/api/Contacts'
import { ContactInterface, HistoryInterface } from '@/api/Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'
import { secondsToHms } from '@/utils/datetime'
import { POSITION } from 'vue-toastification'
import { filter } from '@/Utils'
import jsSIP from '@/mixins/jsSIP'

interface Contact extends ContactInterface, CheckedInterface {}

export default Vue.extend({
  mixins: [jsSIP],
  data () {
    return {
      select: ['Vuetify', 'Programming'],
      dialog: false,
      items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify'
      ],
      contact: {} as ContactInterface,
      contactHistory: [] as HistoryInterface[],
      checkboxSelectedAll: {
        checked: false,
        indeterminate: false
      },
      buttonDelete: {
        disabled: true
      },
      buttonBlacklist: {
        disabled: true
      },
      buttonImport: {
        disabled: false
      },
      buttonExport: {
        disabled: true
      },
      contacts: [] as Contact[]
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
    contacts: {
      handler () {
        // todo: implementation
      },
      deep: true
    }
  },

  beforeCreate () {
    new Contacts()
      .search()
      .then((contacts: ContactResponseInterface) => {
        // eslint-disable-next-line
        (this as any).contacts = contacts.items
      })
  },

  methods: {
    /* eslint-disable */
    /**
     *  Happens when checkbox click
     */
    onSelectedAllClick (sender: any) {
      const contacts: ContactInterface[] = (this as any).contacts
      contacts.forEach((e: ContactInterface) => {
        e.checked = sender.isActive
      })
      this.operation()
    },
    /* eslint-enable */

    /* eslint-disable */
    onCheckBoxItemClick (item: ContactInterface) {
      this.operation()
    },
    /* eslint-enable */

    /* eslint-disable */
    operation () {
      const contacts: ContactInterface[] = (this as any).contacts
      const contactsCount = contacts.length
      let contactsCheckedCount = 0

      contacts.forEach((e: ContactInterface) => {
        if (e.checked) {
          contactsCheckedCount++
        }
      })

      // Do not delve into it, I ask very strongly, you still will not understand
      if (contactsCheckedCount < contactsCount && Math.sign(contactsCheckedCount) === 1) {
        this.checkboxSelectedAll.checked = false
        this.checkboxSelectedAll.indeterminate = true
        this.buttonDelete.disabled = false
        this.buttonBlacklist.disabled = false
        this.buttonExport.disabled = false
      } else if (contactsCheckedCount === contactsCount && Math.sign(contactsCheckedCount) === 1) {
        this.checkboxSelectedAll.indeterminate = false
        this.checkboxSelectedAll.checked = true
        this.buttonDelete.disabled = false
        this.buttonBlacklist.disabled = false
        this.buttonExport.disabled = false
      } else if (contactsCheckedCount === 0) {
        this.buttonDelete.disabled = true
        this.buttonBlacklist.disabled = true
        this.buttonExport.disabled = true
        this.checkboxSelectedAll.indeterminate = false
        this.checkboxSelectedAll.checked = false
      }
    },
    /* eslint-enable */

    /* eslint-disable */
    onSelectedDeleteClick () {
      this.$dialog.confirm({
        text: this.$tc('contact_delete_selected_confirm'),
        title: this.$tc('caution'),
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            text: this.$tc('yes'),
            handle: () => {
              return new Promise(async (resolve) => {
                const contacts: ContactInterface[] = (this as any).contacts
                const contactsApi: Contacts = new Contacts()

                this.contacts = await filter(contacts, async (contact: Contact) => {
                  if (contact.checked) {
                    let isDelete: boolean = false
                    await contactsApi.delete(contact.id)
                      .then(() => {
                        isDelete = true
                        this.$toast.success(this.$t('contact_delete_successfully'), {
                          position: POSITION.TOP_RIGHT,
                          timeout: 3000,
                          closeOnClick: true,
                          draggable: true,
                          draggablePercent: 0.6,
                          showCloseButtonOnHover: true,
                          hideProgressBar: true,
                          closeButton: 'button',
                          icon: true
                        })
                      }).catch((e) => {
                        const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                        this.$toast.error(this.$t('contact_delete_error', { cause }), {
                          position: POSITION.TOP_RIGHT,
                          timeout: 3000,
                          closeOnClick: true,
                          draggable: true,
                          draggablePercent: 0.6,
                          showCloseButtonOnHover: true,
                          hideProgressBar: true,
                          closeButton: 'button',
                          icon: true
                        })
                      })
                    return !isDelete
                  }
                  return true
                })

                resolve()
                this.checkboxSelectedAll.checked = false
                this.checkboxSelectedAll.indeterminate = false
              })
            }
          }
        }
      })
    },
    /* eslint-enable */

    /* eslint-disable */
    /**
     * Occurs when a contact list item is clicked
     * @param contact
     *
     */
    onContactItemClick (contact: any) {
      const id: number = contact.id
      const contacts: Contacts = new Contacts()

      // Load contact history
      contacts.getById(id)
        .then((contact) => {
          this.dialog = true
          this.contact = contact as any

          // Changing the response scheme
          if ('phone_numbers' in this.contact) {
            if (Array.isArray(this.contact.phone_numbers)) {
              this.contact.phone_numbers = this.contact.phone_numbers.map((e) => {
                e.connecting = false
                return e
              })
            }
          }
          contacts.getHistory(id)
            .then((history: any) => {
              this.contactHistory = history.items
            })
        })
    },
    /* eslint-enable */

    secondsToHms (s: number) {
      return secondsToHms(s)
    }
  }
})
</script>

<style lang="scss" scoped>
  .border {
    border-left: 2px #b729b1 solid;
    margin-left: 5px;
  }
</style>
