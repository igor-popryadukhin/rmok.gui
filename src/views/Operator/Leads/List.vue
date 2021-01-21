<template>
  <div>
    <v-row class="ma-0">

      <!-- List -->
      <v-col
        order-sm="2"
        order-lg="1"
        order-md="1"
        cols="12"
        md="8"
        lg="8"
        class="pt-0"
      >
        <!-- Лиды -->
        <v-row class="mb-3">
          <v-col
            order="1"
            cols="12"
            class="pa-0 pr-lg-3 pr-md-3"
          >
            <v-card
              height="350"
              class="overflow-y-auto v-card"
              elevation="0"
              outlined
            >
              <v-card-title>Лиды</v-card-title>
              <v-card-subtitle>Всего: {{ leadsCount }}</v-card-subtitle>
              <v-card-text class="v-card__text">
                <template v-if="leads.length > 0">
                  <template
                    v-for="item in leads"
                  >
                    <v-divider
                      :key="`divider-${item.id}`"
                    />
                    <v-list-item
                      :key="`list-item-${item.id}`"
                      ripple
                      selectable
                      @click.stop="$router.push({ path: `/operator/leads/${item.id}/script` })"
                      style="min-height: 35px"
                    >
                      <v-list-item-content class="pa-0">
                        <v-list-item-title>
                          {{ item.first_name }} {{ item.last_name }}
                        </v-list-item-title>
                        <!--                  <v-list-item-subtitle>{{ new Date(item.created_at * 1000).toLocaleDateString() }}</v-list-item-subtitle>-->
                      </v-list-item-content>
                      <v-spacer />
                      <v-list-item-content class="pa-0">
                        <v-list-item-title
                          v-if="item.default_phone"
                          class="text-right"
                        >{{ item.default_phone.international }}
                        </v-list-item-title>
                        <v-list-item-title
                          v-else-if="item.phones.length > 0"
                          class="text-right"
                        >{{ item.phones[0].international }}
                        </v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                </template>
                <template v-else-if="leadsLoading && leads.length === 0">
                  <v-list-item class="text-center">
                    <v-spacer />
                    <span class="grey--text">{{ $tc('Loading content...') }}</span>
                    <v-spacer />
                  </v-list-item>
                </template>
                <template v-else>
                  <v-list-item class="text-center">
                    <v-spacer />
                    <span class="grey--text">
                      {{ $tc('You have no leads') }}
                    </span>
                    <v-spacer />
                  </v-list-item>
                </template>
              </v-card-text>
              <v-footer color="white">
              </v-footer>
            </v-card>
          </v-col>
        </v-row>

        <!-- Задачи -->
        <v-row class="mb-2">
          <v-col
            order="2"
            cols="12"
            class="pa-0 pr-lg-3 pr-md-3"
          >
            <v-card
              class="overflow-y-auto v-card"
              :height="$screenHeight - 500"
              flat
              outlined
              style="min-height: 400px !important;"
            >
              <v-card-title class="pl-0 pr-0">
                <v-toolbar dense flat>
                  <v-toolbar-title>
                    <h4>Задачи</h4>
                    <div class="toolbar-subtitle">
                      <small>Всего: {{ task.count }}</small>
                      <small>Просроченные: {{ 0 }}</small>
                    </div>
                  </v-toolbar-title>
                  <v-spacer />
                  <v-toolbar-items>
                    <v-btn text>
                      Показать просроченные
                    </v-btn>
                  </v-toolbar-items>
                </v-toolbar>
              </v-card-title>
              <v-card-text class="v-card__text">
                <v-list>
                  <template v-if="task.items.length > 0">
                    <template v-for="(task, taskIndex) in task.items">
                      <v-divider
                        :key="`v-divider-${taskIndex}`"
                      />
                      <v-list-item
                        :key="`v-list-item-${taskIndex}`"
                        link
                        three-line
                        exact
                        :style="task.done ? {'text-decoration': 'line-through'} : ''"
                      >
                        <v-list-item-avatar>
                          <v-avatar>
                            <v-icon v-if="task.type === 'call'">mdi-alpha-c-circle</v-icon>
                            <v-icon v-if="task.type === 'task'">mdi-alpha-t-circle</v-icon>
                            <v-icon v-if="task.type === 'meeting'">mdi-alpha-m-circle</v-icon>
                            <v-icon v-if="task.type === 'letter'">mdi-alpha-e-circle</v-icon>
                            <v-icon v-if="task.type === 'other'">mdi-alpha-o-circle</v-icon>
                          </v-avatar>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title v-if="task.type === 'call'">{{ $t('Call') }}</v-list-item-title>
                          <v-list-item-title v-if="task.type === 'task'">{{ $t('Task') }}</v-list-item-title>
                          <v-list-item-title v-if="task.type === 'meeting'">{{ $t('Meeting') }}</v-list-item-title>
                          <v-list-item-title v-if="task.type === 'letter'">{{ $t('Letter') }}</v-list-item-title>
                          <v-list-item-title v-if="task.type === 'other'">{{ $t('Other') }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ task.description }}
                          </v-list-item-subtitle>
                          <v-list-item-subtitle>
                            Выполнить до {{ new Date(task.planned_for * 1000).toLocaleString() }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-spacer />
                        <v-list-item-content>
                          <v-list-item-title>Автор</v-list-item-title>
                          <v-list-item-subtitle v-if="$store.getters['profile/id'] === task.author.id">Вы</v-list-item-subtitle>
                          <v-list-item-subtitle v-else>{{ task.author.first_name }} {{ task.author.last_name }}</v-list-item-subtitle>
                          <v-list-item-subtitle>{{ new Date(task.created_at * 1000).toLocaleString() }}</v-list-item-subtitle>
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
                                v-if="task.done"
                                link
                              >
                                <v-list-item-icon>
                                  <v-icon>mdi-check-bold</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  <v-list-item-title>Отменить выполнение</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                              <v-list-item
                                v-else
                                link
                              >
                                <v-list-item-icon>
                                  <v-icon>mdi-check-bold</v-icon>
                                </v-list-item-icon>
                                <v-list-item-content>
                                  <v-list-item-title>Выполнить</v-list-item-title>
                                </v-list-item-content>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-list-item-action>
                      </v-list-item>
                    </template>
                  </template>
                  <template v-else-if="task.items.length === 0 && task.loading  === true">
                    <v-list-item class="text-center">
                      <v-spacer />
                      <span class="grey--text">{{ $tc('Loading content...') }}</span>
                      <v-spacer />
                    </v-list-item>
                  </template>
                  <template v-else-if="task.items.length === 0 && task.loading === false">
                    <v-list-item class="text-center">
                      <v-spacer />
                      <span class="grey--text">У вас нет задач</span>
                      <v-spacer />
                    </v-list-item>
                  </template>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>

      <!-- Filter -->
      <v-col
        order-sm="1"
        order-lg="2"
        order-md="2"
        cols="12"
        md="4"
        lg="4"
        class="pt-0"
      >
        <v-row>
          <v-col
            order="1"
            cols="12"
            class="pa-0"
          >
            <v-card
              flat
              outlined
              disabled
            >
              <v-card-text class="pt-5">
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
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ContactResponseInterface, Contacts, ContactSearchQueryInterface } from '@/api/Contacts'
import { ContactInterface, ContactPhoneInterface, HistoryInterface } from '@/api/Schemas/ContactInterface'
import Projects, { ProjectInterface } from '@/api/Projects'
import { MainSearchMethod } from '@/Interfaces'
import { UserInterface } from '@/api/Users'
import Tasks, { TaskGetResponseInterface, TaskInterface } from '@/api/Tasks'
import Leads from '@/api/Leads'
import secondsToHms from '@/mixins/secondsToHms'
import ErrorInterface from '@/api/Schemas/ErrorInterface'

interface DataInterface {
  filter: any;
  leads: ContactInterface[];
  contact: ContactInterface;
  leadsLoading: boolean;
  task: any;
  vueScrollLeads: any;
  vueScrollTasks: any;
  paginator: any;
  leadsCount: number;
}

interface MethodsInterface {
  onVueScrollTaskHandleComplete: (data: any) => void
  onVueScrollLeadsHandleComplete: (data: any) => void
  onRootMainSearch: (q: string, set: MainSearchMethod) => void
  onRootMainSearchSelected: (data: ContactInterface) => void
  onContactItemClick: (contact: ContactInterface) => void
  onItemDeleteClick: (id: number) => void
  loadLeads: () => void
  loadTasks: () => void
}

interface ComputedInterface {
  avatar: string;
  dateRangeText: any[];
}

export default Vue.extend<DataInterface, MethodsInterface, ComputedInterface>({

  mixins: [
    secondsToHms
  ],

  data () {
    return {
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
      task: {
        loading: false,
        count: 0,
        items: [] as TaskInterface[],
      },
      contactHistory: [] as HistoryInterface[],
      leadsLoading: false,
      leads: [] as ContactInterface[],
      leadsCount: 0,
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
    avatar (): string {
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
    }
  },

  watch: {

    // Filter by projects
    'filter.project.selected': {
      handler (value?: ProjectInterface | ProjectInterface[] | null) {
        this.paginator.page = 1
        if (Array.isArray(value)) {
          if (value.length > 0) {
            this.$routerQuery.setQuery({
              project_id: value.map((v: ProjectInterface) => v.id).join(',')
            }).then(this.loadLeads)
          } else {
            this.$routerQuery.removeQuery(['project_id']).then(this.loadLeads)
          }
        } else if (value) {
          this.$routerQuery.setQuery({
            project_id: value.id
          }).then(this.loadLeads)
        } else {
          this.$routerQuery.removeQuery(['project_id']).then(this.loadLeads)
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
          }).then(this.loadLeads)
        } else {
          this.$routerQuery.removeQuery(['user_id']).then(this.loadLeads)
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
            }).then(this.loadLeads)
          } else if (value.length === 0) {
            this.$routerQuery.removeQuery(['dates']).then(this.loadLeads)
          }
        }
      }
    },

    // Paginator
    'paginator.page': {
      handler (value: number) {
        if (value > 0) {
          const offset: number = Math.ceil(value * this.paginator.perPage - this.paginator.perPage)
          const count: number = this.paginator.perPage
          this.$routerQuery.setQuery({ offset, count }).then(this.loadLeads)
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
    .find<{count: number}, ProjectInterface[]>()
    .then((response) => {
      this.filter.project.items = response.data
    }).finally(() => {
      const index: number = this.filter.project.items.findIndex((e: any) => +this.$route.query.project_id === e.id)
      if (index > -1) {
        this.filter.project.selected = this.filter.project.items[index]
      }
    })

    this.loadLeads()
    this.loadTasks()
  },

  beforeDestroy() {
    this.$root.$off('root-main-search', this.onRootMainSearch)
    this.$root.$off('root-main-search-selected', this.onRootMainSearchSelected)
  },

  methods: {
    /* eslint-disable */

    /**
     * Происходит, когда полоса прокрутки списка задач завершил прокрутку
     **/
    onVueScrollLeadsHandleComplete (data: any) {
      if (data.process === 1) {
        if (this.vueScrollLeads.offset < this.leadsCount) {
          this.vueScrollLeads.offset = this.vueScrollLeads.offset + 10
          this.loadLeads()
        }
      }
    },

    /**
     * Происходит, когда полоса прокрутки списка задач завершил прокрутку
     **/
    onVueScrollTaskHandleComplete (data: any) {
      if (data.process === 1) {
        if (this.vueScrollTasks.offset < this.task.count) {
          this.vueScrollTasks.offset = this.vueScrollTasks.offset + 10
          this.loadTasks()
        }
      }
    },

    onRootMainSearch (q: string, set: MainSearchMethod) {
      new Contacts()
        .find({
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
      this.$router.push({
        name: 'operator_leads_script',
        params: {
          contact_id: String(data.id)
        }
      })
    },

    /* eslint-disable */
    /**
     * Occurs when a contact list item is clicked
     * @param contact
     *
     */
    onContactItemClick (contact: ContactInterface) {
      const id: number = contact.id
      const leads: Contacts = new Contacts()

      // Load contact history
      leads.getById(id)
        .then((contact) => {
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

          // this.contactDialog.history.loading = true
          // leads.getHistory(id)
          //   .then((history: any) => {
          //     this.contactHistory = history.items
          //   }).finally(() => {
          //   this.contactDialog.history.loading = false
          // })
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
                    this.leads = this.leads.filter((e) => e.id !== id)
                    this.$toast.success(this.$t('contact_delete_successfully'), { icon: true })
                  }).catch((e) => {
                    const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                    this.$toast.error(this.$t('contact_delete_error', { cause }), { icon: true })
                  })

                resolve()
              })
            }
          }
        }
      })
    },

    loadLeads () {
      const query: ContactSearchQueryInterface = {
        q: this.$routerQuery.getQuery('q', ''),
        user_id: +this.$routerQuery.getQuery('user_id', '0'),
        dates: this.$routerQuery.getQuery('dates', ''),
        offset: this.vueScrollLeads.offset,
        count: 10
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

      this.leadsLoading = true
      new Leads()
        .get<{ count: number }, ContactInterface[]>(query)
        .then((response) => {
          this.leadsCount = response.meta.count
          response.data.forEach<ContactInterface>((contact) => {
            if (this.leads.findIndex<ContactInterface>((c) => c.id === contact.id) === -1) {
              this.leads.push(contact)
            }
          })
        }).catch((e: ErrorInterface | any) => {
          if (e.error_code) {
            switch (e.error_code) {
              case 'no_project': {
                this.$toast.warning(e.error_message)
                break
              }
              default: {
                this.$toast.error(e.error_message)
              }
            }
          } else {
            this.$toast.error(e.statusText || 'undefined')
          }
        }).finally(() => {
          this.leadsLoading = false
        })
    },

    loadTasks () {
      this.task.loading = true
      new Tasks()
        .get({
          offset: this.vueScrollTasks.offset
        }).then((response: TaskGetResponseInterface) => {
          this.task.count = response.count
          response.items.forEach((task: TaskInterface) => {
            if (this.task.items.findIndex((t: TaskInterface) => t.id === task.id) === -1) {
              this.task.items.push(task)
            }
          })
        }).finally(() => {
          this.task.loading = false
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

  .toolbar {
    &-subtitle {
      display: flex;
      flex-flow: column;
    }

    &-subtitle small {
      font-size: 12px;
      color: #848484;
    }
  }

  .v-card {
    display: flex !important;
    flex-direction: column;
  }

  .v-card__text {
    flex-grow: 1;
    overflow: auto;
  }
</style>
