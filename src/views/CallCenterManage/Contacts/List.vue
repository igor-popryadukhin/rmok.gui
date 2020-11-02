<template>
  <div>
    <v-row>
      <v-col cols="12">
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
                :to="{ name: 'call_center_manager_users_new' }"
                v-on="on"
                v-bind="attrs"
                :disabled="buttonAdd.disabled"
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
      </v-col>
    </v-row>

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
                  @click.stop="$jsSIP.call(item.id, item.phone_number_default.value)"
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
                    <v-list-item
                      link
                      @click="onItemDeleteClick(item.id)"
                    >
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
        <template v-else-if="contacts.length === 0 && contactsLoading">
          <v-list-item class="text-center">
            <v-spacer />
            <span class="grey--text">
                {{ $tc('loading_data') }}
              </span>
            <v-spacer />
          </v-list-item>
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

    <s-contact-view-dialog />

  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ContactResponseInterface, Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'
import { POSITION } from 'vue-toastification'
import { filter } from '@/Utils'
import SContactViewDialog from '@/snippets/SContactViewDialog/SContactViewDialog.vue'

interface Contact extends ContactInterface, CheckedInterface {}

export default Vue.extend({
  components: {
    SContactViewDialog
  },
  data () {
    return {
      select: ['Vuetify', 'Programming'],
      items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify'
      ],
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
        disabled: true
      },
      buttonExport: {
        disabled: true
      },
      buttonAdd: {
        disabled: true
      },
      contactsLoading: false,
      contacts: [] as Contact[]
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

  created () {
    this.contactsLoading = true
    new Contacts()
      .search()
      .then((contacts: ContactResponseInterface) => {
        // eslint-disable-next-line
        (this as any).contacts = contacts.items
      }).finally(() => {
        this.contactsLoading = false
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
      this.$emit('contact-show', contact.id)
    },
    /* eslint-enable */

    onItemDeleteClick (id: number) {
      this.$dialog.confirm({
        text: this.$tc('contact_delete_selected_confirm'),
        title: this.$tc('caution'),
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            text: this.$tc('yes'),
            handle: () => {
              return new Promise((resolve) => {
                new Contacts().delete(id)
                  .then(() => {
                    this.contacts = this.contacts.filter((e) => e.id !== id)
                    this.$toast.success(this.$t('contact_delete_successfully'), { icon: true })
                  }).catch((e) => {
                    const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                    this.$toast.error(this.$t('contact_delete_error', { cause }), { icon: true })
                  })

                resolve()
                this.checkboxSelectedAll.checked = false
                this.checkboxSelectedAll.indeterminate = false
              })
            }
          }
        }
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
