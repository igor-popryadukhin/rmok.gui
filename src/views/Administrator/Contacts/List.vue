<template>
  <v-row>
    <v-col
      class="py-0"
      cols="12"
      md="9"
      lg="9"
    >
      <v-card
        flat
        tile
        outlined
      >
        <v-card-text>
          <v-toolbar
            class="v-toolbar-header"
            height="48"
            flat
          >
            <v-toolbar-title class="grey--text">
              {{ $tc('Contacts') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="dataTableContacts.processLoading"
              icon
              @click="onButtonRefreshClick"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              :to="{ name: 'administrator_contacts_new' }"
              icon
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-data-table
            dense
            :headers="dataTableContacts.headers"
            :items="dataTableContacts.items"
            :server-items-length="dataTableContacts.totalCount"
            :page.sync="dataTableContacts.page"
            :items-per-page="dataTableContacts.itemsPerPage"
            :loading="dataTableContacts.processLoading"
            item-key="id"
            item-class="v-datatable-item"
            :loading-text="$tc('Loading content...')"
            :no-data-text="$tc('No data available')"
            disable-sort
            fixed-header
            calculate-widths
            hide-default-footer
            :height="dataTableContactsHeight"
            @pagination="onPaginationChange"
          >
            <template
              slot="header.client"
              slot-scope="{ header }"
            >
              <span class="text-no-wrap">{{ $tc(header.text) }}</span>
            </template>

            <template
              slot="header.responsible"
              slot-scope="{ header }"
            >
              <span class="text-no-wrap">{{ $tc(header.text) }}</span>
            </template>

            <template
              slot="header.project"
              slot-scope="{ header }"
            >
              <span class="text-no-wrap">{{ $tc(header.text) }}</span>
            </template>

            <template
              slot="header.created_at"
              slot-scope="{ header }"
            >
              <span class="text-no-wrap">{{ $tc(header.text) }}</span>
            </template>

            <template slot="item" slot-scope="{ item }">
              <tr class="v-datatable-item">
                <td class="text-no-wrap">{{ item.first_name || '' }} {{ item.last_name || '' }} {{ item.middle_name || '' }}</td>
                <td class="text-no-wrap">{{ item.responsible ? `${item.responsible.first_name} ${item.responsible.last_name}` : '—' }}</td>
                <td class="text-no-wrap">{{ item.project ? item.project.name : '—' }}</td>
                <td class="text-no-wrap">{{ new Date(item.created_at * 1000).toLocaleString()  }}</td>
                <td class="text-no-wrap text-right">
                  <v-btn
                    icon
                    small
                    :to="{ name: 'administrator_contacts_history', params: { contact_id: item.id } }"
                  >
                    <v-icon>mdi-history</v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    :to="{ name: 'administrator_contacts_edit', params: { contact_id: item.id } }"
                  >
                    <v-icon>mdi-pencil-box-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
        <v-footer class="d-flex justify-md-space-between pa-4 mt-auto" color="white">
          <v-pagination
            v-model="dataTableContacts.page"
            :length="dataTableContacts.pages"
            total-visible="5"
            :disabled="dataTableContacts.pages === 0"
          ></v-pagination>
          <div class="d-flex align-center justify-center">
            {{ this.dataTableContacts.pageStart }}-{{ this.dataTableContacts.pageStop }} из {{ this.dataTableContacts.totalCount }}
          </div>
        </v-footer>
      </v-card>
    </v-col>
    <v-col
      class="py-0 pl-md-0 pl-lg-0 pl-xl-0"
      cols="12"
      md="3"
      lg="3"
    >
      <v-card
        class="fill-height"
        flat
        tile
        outlined
      >
        <v-toolbar flat>
          <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text>
          <s-projects-autocomplete
            ref="sProjectsAutocomplete"
            v-model="filter.project"
            :label="$tc('Project')"
            clearable
            outlined
            dense
          />
        </v-card-text>
        <v-card-text>
          <s-users
            ref="sUsersAutocomplete"
            v-model="filter.responsible"
            :label="$tc('Responsible')"
            :params="{ roles: 'r_operator' }"
            clearable
            outlined
            dense
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import { OrganizationInterface } from '@/api/Organizations'
import { ProjectInterface } from '@/api/Projects'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'
import SUsers from '@/snippets/SUsers/SUsers.vue'
import VInterface from '@/VInterface'

interface IRefs {
  sProjectsAutocomplete: any
  sUsersAutocomplete: any
  [key: string]: any;
}

interface IData {
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $refs: IRefs
  $data: IData
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: {
    SUsers,
    SProjectsAutocomplete
  },

  data (): IData {
    return {
      filter: {
        project: null,
        responsible: null
      },
      dataTableContacts: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 25,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: 'Client', align: 'start', sortable: true, value: 'client', width: '200px' },
          { text: 'Responsible', align: 'start', sortable: true, value: 'responsible' },
          { text: 'Project', align: 'start', sortable: true, value: 'project' },
          { text: 'Created at', align: 'start', sortable: true, value: 'created_at' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as ContactInterface[]
      }
    }
  },

  watch: {
    'dataTableContacts.page': {
      handler () {
        this.fetchContacts()
      }
    },

    'filter.responsible': {
      handler (val: OrganizationInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            responsible_id: val.id
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'responsible_id'
          ]).then(this.fetchContacts)
        }
      }
    },

    'filter.project': {
      handler (val: ProjectInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            project_id: val.id
          }).then(this.fetchContacts)
        } else {
          this.$routerQuery.removeQuery([
            'project_id'
          ]).then(this.fetchContacts)
        }
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableContactsHeight () {
      let h: number = this.$screenHeight - 250
      if (h < 640) { h = 640 }
      return h
    }
  },

  mounted () {
    this.fetchContacts()

    if (this.$refs.sProjectsAutocomplete) {
      this.$refs.sProjectsAutocomplete.fetchData()
    }

    if (this.$refs.sUsersAutocomplete) {
      this.$refs.sUsersAutocomplete.fetchData()
    }

    // Установка фильтров
    if (this.$routerQuery.hasQuery('project_id')) {
      this.$refs.sProjectsAutocomplete.setDefault(this.$routerQuery.getQuery('project_id', 0))
    }
    if (this.$routerQuery.hasQuery('responsible_id')) {
      this.$refs.sUsersAutocomplete.setDefault(this.$routerQuery.getQuery('responsible_id', 0))
    }
  },

  methods: {
    fetchContacts () {
      this.dataTableContacts.processLoading = true
      const offset = (this.dataTableContacts.itemsPerPage * this.dataTableContacts.page) - this.dataTableContacts.itemsPerPage

      const params: any = {
        offset,
        count: this.dataTableContacts.itemsPerPage
      }

      if (this.$routerQuery.hasQuery('project_id')) {
        params.project_id = this.$routerQuery.getQuery<number>('project_id')
      }

      if (this.$routerQuery.hasQuery('responsible_id')) {
        params.responsible_id = this.$routerQuery.getQuery<number>('responsible_id')
      }

      new Contacts()
        .find<{count: number}, ContactInterface[]>(params)
        .then((response) => {
          this.dataTableContacts.totalCount = response.meta.count
          this.dataTableContacts.pages = Math.ceil(response.meta.count / this.dataTableContacts.itemsPerPage)
          this.dataTableContacts.items = response.data
        }).finally(() => (this.dataTableContacts.processLoading = false))
    },

    onButtonRefreshClick () {
      this.fetchContacts()
    },

    onPaginationChange (data: any) {
      this.dataTableContacts.pageStart = data.pageStart + 1
      this.dataTableContacts.pageStop = data.pageStop
    }
  }
})
</script>

<style>

.v-toolbar-header div {
  padding: 0 !important;
}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>
