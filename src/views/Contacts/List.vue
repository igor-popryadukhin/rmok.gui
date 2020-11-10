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

        <!-- List -->
        <v-col
          order-sm="2"
          order-lg="1"
          order-md="1"
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
                @click.stop="$router.push({ name: 'contacts_view', params: { contact_id: item.id } })"
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
                  <v-list-item-subtitle v-if="item.default_phone">{{ item.default_phone.label }}: {{ item.default_phone.value.international }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-else>{{ $t('No default number') }}</v-list-item-subtitle>
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
                        :to="{ name: 'contacts_history', params: { contact_id: item.id } }"
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-history</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>История</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </template>
          <template v-else-if="contactsLoading && contacts.length === 0">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('Loading content...') }}
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

        <!-- Filter -->
        <v-col
          order-sm="1"
          order-lg="2"
          order-md="2"
          cols="12"
          md="4"
          lg="4"
        >
          <v-card
            flat
            outlined
          >
            <v-card-text class="pt-5">
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on }">
                  <v-combobox
                    v-model="filter.project.selected"
                    :items="filter.project.items"
                    :disabled="filter.project.disabled || filter.project.items.length === 0"
                    :label="$tc('Project')"
                    item-value="id"
                    item-text="name"
                    small-chips
                    multiple
                    outlined
                    dense
                    v-on="on"
                  ></v-combobox>
                </template>
                <span>{{ $tc('Filter by projects') }}</span>
              </v-tooltip>
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on }">
                  <v-combobox
                    v-model="filter.city.selected"
                    :items="filter.city.items"
                    :disabled="filter.city.disabled || filter.city.items.length === 0"
                    :label="$tc('City')"
                    item-value="id"
                    item-text="name"
                    small-chips
                    multiple
                    outlined
                    dense
                    v-on="on"
                  ></v-combobox>
                </template>
                <span>{{ $tc('Filter by city') }}</span>
              </v-tooltip>
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on }">
                  <v-combobox
                    v-model="filter.scenario.selected"
                    :items="filter.scenario.items"
                    :disabled="filter.scenario.disabled || filter.scenario.length === 0"
                    :label="$tc('Scenario')"
                    item-value="id"
                    item-text="name"
                    small-chips
                    multiple
                    outlined
                    dense
                    v-on="on"
                  ></v-combobox>
                </template>
                <span>{{ $tc('Filter by scenario') }}</span>
              </v-tooltip>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ContactResponseInterface, Contacts, ContactSearchQueryInterface } from '@/api/Contacts'
import { ContactInterface, ContactPhoneInterface, HistoryInterface } from '@/api/Schemas/ContactInterface'
import { CheckedInterface } from '@/api/Schemas/СheckedInteface'
import { secondsToHms } from '@/utils/datetime'
import { POSITION } from 'vue-toastification'
import { filter, isEmpty } from '@/Utils'
import { ProjectInterface, ProjectResponseItemsInterface, Projects } from '@/api/Projects'

interface Contact extends ContactInterface, CheckedInterface {}

export default Vue.extend({
  data () {
    return {
      select: ['Vuetify', 'Programming'],
      contactDialog: {
        visible: false,
        history: {
          loading: false
        }
      },
      items: [
        'Programming',
        'Design',
        'Vue',
        'Vuetify'
      ],
      contact: {
        /* eslint-disable */
        city: '',
        default_phone: undefined,
        emails: [],
        first_name: '',
        id: 0,
        last_name: '',
        middle_name: '',
        phones: [] as ContactPhoneInterface[],
        user: undefined
        /* eslint-enabled */
      } as ContactInterface,
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
      contactsLoading: false,
      contacts: [] as Contact[] & { checked: boolean }[],
      filter: {
        project: {
          disabled: true,
          selected: null,
          items: [] as ProjectInterface[]
        },

        city: {
          disabled: true,
          selected: null,
          items: []
        },

        scenario: {
          disabled: true,
          selected: null,
          items: []
        }
      }
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
    },

    // Filter by projects
    'filter.project.selected': {
      handler (value?: ProjectInterface | ProjectInterface[] | null) {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            this.$routerQuery.setQuery({
              filter_project: value.map((v: ProjectInterface) => v.id).join(',')
            }).then(this.loadContacts)
          } else {
            this.$routerQuery.removeQuery(['filter_project']).then(this.loadContacts)
          }
        }
      }
    }
  },

  created () {
    new Projects()
    .find()
    .then((response: ProjectResponseItemsInterface) => {
      this.filter.project.items = response.items
    })
    this.loadContacts()
  },

  methods: {
    /* eslint-disable */

    /**
     *  Happens when checkbox click
     */
    onSelectedAllClick (sender: any) {
      const contacts: ContactInterface[] = (this as any).contacts
      contacts.forEach((e: any) => {
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

      contacts.forEach((e: any) => {
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
          this.contactDialog.visible = true
          this.contact = contact as any

          // Changing the response scheme
          if ('phones' in this.contact) {
            if (Array.isArray(this.contact.phones)) {
              this.contact.phones = this.contact.phones.map((e: any) => {
                e.connecting = false
                return e
              })
            }
          }

          this.contactDialog.history.loading = true
          contacts.getHistory(id)
            .then((history: any) => {
              this.contactHistory = history.items
            }).finally(() => {
            this.contactDialog.history.loading = false
          })
        })
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
    },

    secondsToHms (s: number) {
      return secondsToHms(s)
    },

    onCall (target: string, contactId: number) {
      /* eslint-disable */
      this.$jsSIP.call(target, { contact_id: contactId, target })
      /* eslint-enable */
    },

    loadContacts () {
      const query: ContactSearchQueryInterface = {
        q: this.$routerQuery.getQuery('q', ''),
        projects: this.$routerQuery.getQuery('filter_project', ''),
        offset: this.$routerQuery.getQuery('offset', 0),
        count: this.$routerQuery.getQuery('count', 100)
      }

      if (isEmpty(query.projects)) {
        delete query.projects
      }

      this.contactsLoading = true
      new Contacts()
        .search(query)
        .then((contacts: ContactResponseInterface) => {
          this.contacts = contacts.items.map((contact: ContactInterface) => ({ ...contact, checked: false }))
        }).catch((e) => {
          this.$toast.error(e.statusText || e.error_message || e || 'undefined')
        }).finally(() => {
          this.contactsLoading = false
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
