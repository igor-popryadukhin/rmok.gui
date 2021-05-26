<template>
  <v-row>

    <!-- Лиды и задачи -->
    <v-col
      cols="12"
    >
      <!-- Лиды -->
      <v-row>
        <v-col
          order="1"
          cols="12"
          class="pb-0"
        >
          <v-card
            :height="350"
            class="overflow-y-auto v-card"
            elevation="0"
            tile
          >
            <v-card-title class="px-0">{{ $tc('Leads not called') }}</v-card-title>
            <v-card-subtitle class="px-0">{{ $tc('Total') }}: <app-count-up :delay="1000" :end-val="leadsCount" /></v-card-subtitle>
            <v-card-text class="v-card__text px-0">
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
                    :to="{ name: 'operator_contacts_view', params: { contact_id: item.id } }"
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

      <v-row>
        <v-col class="px-5">
          <v-divider />
        </v-col>
      </v-row>

      <!-- Задачи -->
      <v-row>
        <v-col
          order="2"
          cols="12"
        >
          <s-task-list
            :params="taskListParams"
            filters-enabled
            tile
            flat
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
  </v-row>
</template>

<script lang="ts">
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import store from '@/store'
import Vue from 'vue'
import { Contacts, ContactSearchQueryInterface } from '@/api/Contacts'
import { ContactInterface, ContactPhoneInterface, ContactHistoryInterface } from '@/api/Schemas/ContactInterface'
import { ProjectInterface } from '@/api/Projects'
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
  loadLeads: () => void
}

interface IComputed {
  avatar: string;
  taskListParams: any;
  dateRangeText: any[];
}

export default Vue.extend<IData, IMethods, IComputed>({
  async beforeRouteEnter (to, from, next) {
    // Нужно загрузить задачи до того как страница будет отрисована
    await store.dispatch('tasks/reset_filter') // Очищаю фильтр
    store.dispatch('tasks/items', {
      planned_for: 'today',
      state: 'pending'
    }).finally(() => (next()))
  },
  components: { AppCountUp, STaskList },

  data (): IData {
    return {
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
      paginator: {
        pages: 0,
        perPage: 10,
        page: 1
      },
      vueScrollLeads: {
        offset: 0
      },
      vueScrollTasks: {
        offset: 0
      },
      taskCount: 0,
      contactHistory: [] as ContactHistoryInterface[],
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

  mixins: [
    secondsToHms
  ],

  computed: {
    avatar (): string {
      const first: string = this.contact.first_name || ''
      const last: string = this.contact.last_name || ''
      return first.charAt(0) + last.charAt(0)
    },

    taskListParams () {
      return {
        state: 'pending'
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
    this.$root.$on('root-load-leads', this.loadLeads)
    this.$root.$on('root-project-change', this.onRootProjectChange)
    this.loadLeads()
  },

  beforeDestroy() {
    this.$root.$off('root-load-leads', this.loadLeads)
    this.$root.$off('root-project-change', this.onRootProjectChange)
  },

  methods: {
    onTasksLoadedData (data: any) {
      this.$data.taskCount = data.meta.count
    },

    onRootProjectChange () {
      this.loadLeads()
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
          this.leadsCount = response?.meta?.count || 0
          this.leads = response?.data || []
        }).finally(() => {
        this.leadsLoading = false
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
