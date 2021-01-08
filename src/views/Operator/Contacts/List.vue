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
                :to="{ name: 'operator_contacts_new' }"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('Add new contact') }}</span>
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
          <vuescroll :ops="vuescroll_options" :style="{ height: `${$screenHeight - 250}px` }" style="width: 100%">
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
                @click.stop="$router.push({ path: `/operator/contacts/${item.id}/script` })"
              >
                <v-list-item-action>
                  <v-checkbox
                    v-model="item.checked"
                      class="pa-0"
                    @click.stop="onCheckBoxItemClick(item)"
                  ></v-checkbox>
                </v-list-item-action>
                  <v-list-item-avatar class="mr-2">
                    <v-avatar color="primary">
                    <span style="color: white">
                      {{ item.first_name.charAt(0) + item.last_name.charAt(0) }}
                    </span>
                    </v-avatar>
                  </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.first_name }} {{ item.last_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.default_phone">{{ item.default_phone.label }}: {{ item.default_phone.value.international }}</v-list-item-subtitle>
                  <v-list-item-subtitle v-else>{{ $t('No default number') }}</v-list-item-subtitle>
                    <v-list-item-subtitle>{{ new Date(item.created_at * 1000).toLocaleDateString() }}</v-list-item-subtitle>
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
                {{ $tc('No contacts') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
          </vuescroll>
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
              <v-menu
                ref="filterDataRange"
                v-model="filter.dataRange.visible"
                :close-on-content-click="false"
                :return-value.sync="filter.dataRange.dates"
                transition="scale-transition"
                offset-y
                max-width="290px"
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateRangeText"
                    :label="$t('Date the contact was created')"
                    persistent-hint
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    clearable
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="filter.dataRange.dates"
                  no-title
                  :show-current="false"
                  :locale="$i18n.locale"
                  range
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="filter.dataRange.dates = []"
                    @mouseup="filter.dataRange.visible = false"
                  >
                    {{ $t('Clear') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="filter.dataRange.visible = false"
                  >
                    {{ $t('Cancel') }}
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.filterDataRange.save(filter.dataRange.dates)"
                  >
                    {{ $t('Ok') }}
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <div v-if="contactsCount > 0" class="text-center mb-3">
                <v-pagination
                  v-model="paginator.page"
                  :total-visible="5"
                  :length="paginator.pages"
                ></v-pagination>
              </div>
              <div class="text-left">
                {{ $tc('Not found | Found {n} contact | Found {n} contacts | Found {n} contacts', contactsCount) }} <br />
              </div>
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
import { filter } from '@/Utils'
import Projects, { ProjectInterface, ProjectResponseItemsInterface } from '@/api/Projects'
import { MainSearchMethod } from '@/Interfaces'
import vuescroll from 'vuescroll/dist/vuescroll-native'
import { UserInterface } from '@/api/Users'

interface Contact extends ContactInterface, CheckedInterface {}

export default Vue.extend({

  components: {
    vuescroll
  },

  data () {
    return {
      vuescroll_options: {
        bar: {
          background: '#c912c6'
        }
      },
      contactDialog: {
        visible: false,
        history: {
          loading: false
        }
      },
      paginator: {
        perPage: 10,
        pages: 0,
        page: 1
      },
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
        user: undefined,
        created_at: 0
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
      contacts: [] as Contact[],
      contactsCount: 0,
      filter: {
        project: {
          disabled: false,
          selected: undefined,
          items: [] as ProjectInterface[]
        },

        city: {
          disabled: true,
          selected: undefined,
          items: []
        },

        scenario: {
          disabled: true,
          selected: undefined,
          items: []
        },

        dataRange: {
          visible: false,
          disabled: true,
          dates: [],
        }
      }
    }
  },

  computed: {
    avatar () {
      const first: string = this.contact.first_name || ''
      const last: string = this.contact.last_name || ''
      return first.charAt(0) + last.charAt(0)
    },

    dateRangeText: {
      get () {
        return this.filter.dataRange.dates.join(' ~ ')
      },
      set () {
        this.filter.dataRange.dates = []
    }
  },
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
        this.paginator.page = 1
        if (Array.isArray(value)) {
          if (value.length > 0) {
            this.$routerQuery.setQuery({
              project_id: value.map((v: ProjectInterface) => v.id).join(',')
            }).then(this.loadContacts)
          } else {
            this.$routerQuery.removeQuery(['project_id']).then(this.loadContacts)
          }
        } else if (value) {
          this.$routerQuery.setQuery({
            project_id: value.id
          }).then(this.loadContacts)
        } else {
          this.$routerQuery.removeQuery(['project_id']).then(this.loadContacts)
        }
      }
    },

    // Filter by users
    'filter.user.selected': {
      handler (value?: UserInterface) {
        this.paginator.page = 1
        if (value) {
          this.$routerQuery.setQuery({
            user_id: value.id
          }).then(this.loadContacts)
        } else {
          this.$routerQuery.removeQuery(['user_id']).then(this.loadContacts)
        }
      }
    },

    // Filter by date range
    'filter.dataRange.dates': {
      handler (value?: string[]) {
        this.paginator.page = 1
        if (Array.isArray(value)) {
          if (value.length === 2) {
            this.$routerQuery.setQuery({
              dates: value.map((v: string) => {
                return Math.round(new Date(v).getTime() / 1000)
              }).join(',')
            }).then(this.loadContacts)
          } else if (value.length === 0) {
            this.$routerQuery.removeQuery(['dates']).then(this.loadContacts)
          }
        }
      }
    },

    // Paginator
    'paginator.page': {
      handler (value?: number) {
        if (value > 0) {
          const offset: number = Math.ceil(value * this.paginator.perPage - this.paginator.perPage)
          const count: number = this.paginator.perPage
          this.$routerQuery.setQuery({ offset, count }).then(this.loadContacts)
        }
      }
    }
  },

  mounted() {
    this.$root.$on('root-main-search', this.onRootMainSearch)
    this.$root.$on('root-main-search-selected', this.onRootMainSearchSelected)
  },

  created () {
    new Projects()
    .find()
    .then((response: ProjectResponseItemsInterface) => {
      this.filter.project.items = response.items
    }).finally(() => {
      const index: number = this.filter.project.items.findIndex((e: any) => +this.$route.query.project_id === e.id)
      if (index > -1) {
        this.filter.project.selected = this.filter.project.items[index]
      }
    })

    // todo: Restore filter
    // if (this.$route.query.dates) {
    //   console.log(new Date(+this.$route.query.dates[0] * 1000))
    //   this.filter.dataRange.dates = [
    //     new Date(+this.$route.query.dates[0] * 1000).toISOString().substr(0, 7),
    //     new Date(+this.$route.query.dates[1] * 1000).toISOString().substr(0, 7)
    //   ]
    // }
    this.loadContacts()
  },

  beforeDestroy() {
    this.$root.$off('root-main-search', this.onRootMainSearch)
    this.$root.$off('root-main-search-selected', this.onRootMainSearchSelected)
  },

  methods: {
    /* eslint-disable */

    onRootMainSearch (q: string, set: MainSearchMethod) {
      new Contacts()
        .search({
          q,
          offset: 0,
          count: 10
        }).then((response: ContactResponseInterface) => {
        set(response.items.map((e: ContactInterface) => {
          return {
            ...e,
            title: `${e.first_name} ${e.last_name}`,
            subtitle: e.city
          }
        }))
      })
    },

    onRootMainSearchSelected (data: ContactInterface) {
      this.$router.push({ path: `/contacts/${data.id}/script` })
    },

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
        project_id: this.$routerQuery.getQuery('project_id', 0),
        user_id: this.$routerQuery.getQuery('user_id', 0),
        dates: this.$routerQuery.getQuery('dates', false),
        offset: this.$routerQuery.getQuery('offset', 0),
        count: this.$routerQuery.getQuery('count', this.paginator.perPage)
      }

      if (!query.dates) {
        delete query.dates
      }

      if (query.project_id === 0) {
        delete query.project_id
      }

      if (query.user_id === 0) {
        delete query.user_id
      }

      this.contactsLoading = true
      new Contacts()
        .search(query)
        .then((contacts: ContactResponseInterface) => {
          this.contactsCount = contacts.count
          this.paginator.pages = Math.ceil(contacts.count / this.paginator.perPage)
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
