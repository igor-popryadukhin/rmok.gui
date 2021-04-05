<template>
  <v-row>

    <!-- Лиды и задачи -->
    <v-col
      order-sm="2"
      order-lg="1"
      order-md="1"
      cols="12"
      md="8"
      lg="8"
    >
      <!-- Лиды -->
      <v-row>
        <v-col
          order="1"
          cols="12"
          class="pb-0 pr-lg-3 pr-md-3"
        >
          <v-card
            :height="350"
            class="overflow-y-auto v-card"
            elevation="0"
            outlined
            tile
          >
            <v-card-title>{{ $tc('Leads not called') }}</v-card-title>
            <v-card-subtitle>{{ $tc('Total') }}: {{ leadsCount }}</v-card-subtitle>
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
                    :to="{ name: 'operator_leads_script', params: { contact_id: item.id } }"
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
      <v-row>
        <v-col
          order="2"
          cols="12"
          class="pr-lg-3 pr-md-3"
        >
          <s-task-list
            :params="taskListParams"
            tile
            flat
            outlined
            @loaded-data="onTasksLoadedData"
          >
            <template v-slot:item="{ item }">
              <v-list-item-title
                v-if="item.type === 'call'"
                :style="{ color: item.expired ? 'red' : '' }"
              >
                {{ `Позвонить ${$moment.unix(item.planned_for).format('Do MMMM, dddd, hh:mm:ss a')}` }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="item.contact">
                {{ item.contact.last_name }} {{ item.contact.first_name }} {{ item.contact.middle_name }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                        <span
                          class="label mr-2"
                          :style="{'background-color': lastContactStatus(item.contact).color }"
                          :class="lastContactStatus(item.contact).class"
                        >
                            {{ lastContactStatus(item.contact).name }}
                          </span> {{ item.description || '—' }}
              </v-list-item-subtitle>
            </template>
          </s-task-list>
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
      class="px-0"
    >
      <v-card
        height="100%"
        flat
        tile
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
              :first-day-of-week="1"
              :show-current="false"
              :locale="$i18n.locale"
              no-title
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
</template>

<script lang="ts">
import Tasks, { TaskInterface } from '@/api/Tasks'
import Vue from 'vue'
import { ContactResponseInterface, Contacts, ContactSearchQueryInterface } from '@/api/Contacts'
import { ContactInterface, ContactPhoneInterface, HistoryInterface } from '@/api/Schemas/ContactInterface'
import Projects, { ProjectInterface } from '@/api/Projects'
import { MainSearchMethod } from '@/Interfaces'
import { UserInterface } from '@/api/Users'
import Leads from '@/api/Leads'
import secondsToHms from '@/mixins/secondsToHms'
import STaskList from '@/snippets/STaskList/STaskList.vue'

interface IData {
  filter: any;
  leads: ContactInterface[];
  contact: ContactInterface;
  leadsLoading: boolean;
  taskCount: number;
  vueScrollLeads: any;
  vueScrollTasks: any;
  paginator: any;
  leadsCount: number;
}

interface IMethods {
  onVueScrollTaskHandleComplete: (data: any) => void
  onVueScrollLeadsHandleComplete: (data: any) => void
  onRootMainSearch: (q: string, set: MainSearchMethod) => void
  onRootMainSearchSelected: (data: ContactInterface) => void
  onContactItemClick: (contact: ContactInterface) => void
  onItemDeleteClick: (id: number) => void
  onTasksLoadedData: (data: any) => void
  onTaskItemClick: (item: TaskInterface) => void
  loadLeads: () => void
}

interface IComputed {
  avatar: string;
  taskListParams: any;
  dateRangeText: any[];
}

export default Vue.extend<IData, IMethods, IComputed>({
  components: { STaskList },
  mixins: [
    secondsToHms
  ],

  data () {
    return {
      vueScrollLeads: {
        offset: 0
      },
      vueScrollTasks: {
        offset: 0
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
      },
      taskCount: 0,
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

    taskListParams () {
      return {
        state: 'pending',
        planned_for: 'today',
        contact_id: this.$route.params.contact_id
      }
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

  mounted () {
    this.$root.$on('root-main-search', this.onRootMainSearch)
    this.$root.$on('root-main-search-selected', this.onRootMainSearchSelected)
    this.$root.$on('root-load-leads', this.loadLeads)
    this.$root.$on('root-load-tasks', this.onRootLoadTasks)
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
  },

  beforeDestroy() {
    this.$root.$off('root-main-search', this.onRootMainSearch)
    this.$root.$off('root-main-search-selected', this.onRootMainSearchSelected)
    this.$root.$off('root-load-leads', this.loadLeads)
    this.$root.$off('root-load-tasks', this.onRootLoadTasks)
  },

  methods: {
    onTasksLoadedData (data: any) {
      this.$data.taskCount = data.meta.count
    },

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

    /**
     * Загружает список лидов
     */
    loadLeads () {
      const query: ContactSearchQueryInterface = {
        q: this.$routerQuery.getQuery('q'),
        user_id: +this.$routerQuery.getQuery('user_id'),
        dates: this.$routerQuery.getQuery('dates'),
        offset: this.vueScrollLeads.offset,
        count: 1000
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
          this.leads = response.data
        }).catch((e: Error) => {
          this.$toast.error(e.message)
        }).finally(() => {
          this.leadsLoading = false
        })
    },

    /**
     * Происходит когда нажали на элемент списка задачи.
     * @param item
     */
    onTaskItemClick (item: TaskInterface) {
      this.$store.commit('system/route_last_full_path', this.$route.fullPath)
      this.$router.push({
        name: 'operator_leads_script',
        params: { contact_id: String(item.contact?.id) }
      })
    },

    lastContactStatus (contact: ContactInterface) {
      if (contact) {
        if (contact.last_status) {
          return {
            name: contact.last_status.name,
            class: '',
            color: contact.last_status.color
          }
        }
      }
      return {
        name: this.$tc('Status not set'),
        class: 'label-outlined label-color-grey',
        color: ''
      }
    }
  }
})
</script>

<style lang="scss" scoped>
  .border {
    border-left: 2px #3A70D4 solid;
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
