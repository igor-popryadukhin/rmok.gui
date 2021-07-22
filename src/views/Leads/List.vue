<template>
  <v-sheet>
    <!-- Лиды и задачи -->
    <app-tools>
      <template #left>
        <div class="d-flex flex-column">
          <h3 class="grey--text">
            {{ $tc('Новые') }}
          </h3>
          <small
            class="grey--text"
            style="line-height: 3px;"
          >
            {{ $tc('Quantity') }}:
            <app-count-up :end-val="leadsCount" />
          </small>
        </div>
      </template>
      <template #right>
        <div class="align-self-end">
          <v-btn
            small
            tile
            text
            @click="onBtnRefreshClick"
          >
            {{ $tc('Refresh') }}
          </v-btn>
        </div>
      </template>
    </app-tools>
    <v-divider class="mb-2" />

    <template v-if="leads.length > 0">
      <template
        v-for="(item, itemIndex) in leads"
      >
        <v-divider
          v-if="itemIndex > 0"
          :key="`divider-${item.id}`"
        />

        <v-list-item
          :key="`list-item-${item.id}`"
          ripple
          selectable
          :to="{ name: 'contacts_view', params: { contact_id: item.id } }"
          style="min-height: 35px"
        >
          <v-list-item-content class="pa-0">
            <v-list-item-title>
              {{ item.contact_name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </template>
    <template v-else-if="leadsLoading && leads.length === 0">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          {{ $tc('Empty') }}
        </div>
      </div>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import { Contacts } from '@/api/Contacts'
import Contact from '@/api/interfaces/Contact'
import { ProjectInterface } from '@/api/Projects'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import { UserInterface } from '@/api/Users'
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'

interface Data {
  [key: string]: any
}

interface Methods {
  [key: string]: any
}

interface Computed {
  [key: string]: any
}

export default Vue.extend<Data, Methods, Computed>({
  components: { AppLoading, AppCountUp },

  data (): Data {
    return {
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
      leadsLoading: false,
      leads: [] as Contact[],
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
          dates: []
        }
      }
    }
  },

  computed: {
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

  activated () {
    this.loadLeads()
  },

  methods: {

    /**
     * Происходит, когда полоса прокрутки списка задач завершил прокрутку
     */
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
        })
    },

    /**
     * Загружает список лидов
     */
    loadLeads () {
      this.leadsLoading = true

      // only_new = 1 Только новые
      new Contacts()
        .find({ only_new: 1 })
        .then((response) => {
          this.leadsCount = response?.meta?.count || 0
          this.leads = response?.data || []
        }).finally(() => {
          this.leadsLoading = false
        })
    },

    /**
     * Происходит, когда кликнули на кнопку "Обновить"
     */
    onBtnRefreshClick () {
      this.loadLeads()
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
