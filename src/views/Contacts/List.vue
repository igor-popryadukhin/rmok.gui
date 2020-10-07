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
                  color="green"
                  @click.stop="() => {}"
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
        max-width="800"
      >
        <v-card class="overflow-hidden">
          <v-app-bar
            absolute
            color="white"
            height="80"
            elevate-on-scroll
            scroll-target="#scrolling-techniques-7"
          >
            <v-app-bar-nav-icon class="ml-3" style="background-color: #8d3eb1; color: white">
              {{ avatar }}
            </v-app-bar-nav-icon>
            <v-toolbar-title>
              {{ contact.first_name }} {{ contact.last_name }}
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon>
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-app-bar>
          <v-sheet
            id="scrolling-techniques-7"
            class="overflow-y-auto"
            max-height="600"
          >
            <v-container class="pl-5 pr-5" style="margin-top: 80px">
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
                  :key="`phone-${phoneIndex}`"
                  ripple
                  link
                  selectable
                >
                  <v-list-item-avatar size="30">
                    <v-icon v-if="phoneIndex === 0">mdi-phone</v-icon>
                  </v-list-item-avatar>
                  <v-item-group>
                    <v-list-item-title>{{ phone.value }}</v-list-item-title>
                    <v-list-item-subtitle>{{ phone.type }}</v-list-item-subtitle>
                  </v-item-group>
                  <v-spacer />
                  <v-list-item-action>
                    <v-btn
                      icon
                      small
                      color="green"
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
                <!-- Emails -->
                <v-list-item
                  v-for="(i, emailIndex) in 35"
                  :key="`email-${emailIndex}`"
                  ripple
                  link
                  selectable
                  dense
                >
                  <v-item-group>
                    <v-list-item-title>History {{ i }}</v-list-item-title>
                    <v-list-item-subtitle>subtitle{{ i }}</v-list-item-subtitle>
                  </v-item-group>
                </v-list-item>
              </v-list>
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
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'

interface Contact extends ContactInterface, CheckedInterface {}

export default Vue.extend({
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
    onSelectedAllClick (sender: any) {
      const contacts: ContactInterface[] = (this as any).contacts
      contacts.forEach((e: ContactInterface) => {
        e.checked = sender.isActive
      })
      this.operation()
    },

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
      const contacts: ContactInterface[] = (this as any).contacts

      const contactsApi: Contacts = new Contacts()
      contacts.forEach((e) => {
        contactsApi.delete(e.id)
      })
    },
    /* eslint-enable */

    onContactItemClick (contact: any) {
      new Contacts()
        .getById(contact.id)
        .then((contact) => {
          /* eslint-disable */
          (this as any).contact = contact
          /* eslint-enable */
        }).finally(() => {
          this.dialog = true
        })
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
