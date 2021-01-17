<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="9"
        lg="9"
      >
        <v-card
          flat
          outlined
        >
          <v-card-text>
            <v-data-table
              dense
              :headers="dataTableUsers.headers"
              :items="dataTableUsers.items"
              :server-items-length="dataTableUsers.totalCount"
              :page.sync="dataTableUsers.page"
              :items-per-page="dataTableUsers.itemsPerPage"
              :loading="dataTableUsers.processLoading"
              item-key="id"
              item-class="v-datatable-item"
              :loading-text="$tc('Loading content...')"
              :no-data-text="$tc('No data available')"
              disable-sort
              fixed-header
              calculate-widths
              hide-default-footer
              :height="$screenHeight - 270"
              @pagination="onPaginationChange"
            >
              <template v-slot:top>
                <v-toolbar
                  class="v-toolbar-header"
                  height="48"
                  flat
                >
                  <v-toolbar-title class="grey--text">
                    {{ $tc('System users') }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    :disabled="dataTableUsers.processLoading"
                    icon
                    @click="onButtonRefreshClick"
                  >
                    <v-icon>mdi-refresh</v-icon>
                  </v-btn>
                  <v-btn
                    color="primary"
                    :to="{ name: 'administrator_users_new' }"
                    icon
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-toolbar>
              </template>
              <template slot="header.email" slot-scope="{ header }">
                <span class="text-no-wrap">{{ header.text }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <tr class="v-datatable-item">
                  <td class="text-no-wrap">{{ item.first_name || $tc('No first name') }}</td>
                  <td class="text-no-wrap">{{ item.last_name || $tc('No last name') }}</td>
                  <td class="text-no-wrap">{{ item.middle_name || $tc('No middle name') }}</td>
                  <td class="text-no-wrap">{{ item.role ? item.role.name : '—' }}</td>
                  <td class="text-no-wrap">{{ item.project ? item.project.name : '—' }}</td>
                  <td class="text-no-wrap">{{ item.group ? item.group.name : '—' }}</td>
                  <td class="text-no-wrap">{{ item.organization ? item.organization.name : '—'}}</td>
                  <td class="text-no-wrap text-right">
                    <v-btn
                      icon
                      small
                      :to="{ name: 'administrator_users_edit', params: { id: item.id } }"
                    >
                      <v-icon>mdi-pencil-box-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        md="3"
        lg="3"
      >
        <v-card
          class="fill-height"
          flat
          outlined
        >
          <v-toolbar flat>
            <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-card-text>
            <s-organizations-autocomplete
              ref="sOrganizationsAutocomplete"
              v-model="filter.organization"
              :label="$tc('Organization')"
              clearable
              outlined
              dense
            />
          </v-card-text>
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
            <s-groups
              ref="sGroupsAutocomplete"
              v-model="filter.group"
              :label="$tc('Группа')"
              clearable
              outlined
              dense
            />
          </v-card-text>
          <v-footer absolute class="d-flex justify-md-space-between pa-4 mt-auto">
            <v-pagination
              v-model="dataTableUsers.page"
              :length="dataTableUsers.pages"
              total-visible="6"
              :disabled="dataTableUsers.pages === 0"
            ></v-pagination>
            <div class="d-flex align-center justify-center">
              {{ this.dataTableUsers.pageStart }}-{{ this.dataTableUsers.pageStop }} из {{ this.dataTableUsers.totalCount }}
            </div>
          </v-footer>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserInterface, Users } from '@/api/Users'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import { OrganizationInterface } from '@/api/Organizations'
import { ProjectInterface } from '@/api/Projects'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import { GroupInterface } from '@/api/Groups'

export default Vue.extend({
  components: {
    SGroups,
    SProjectsAutocomplete,
    SOrganizationsAutocomplete
  },
  data () {
    return {
      filter: {
        organization: null,
        project: null,
        group: null
      },
      dataTableUsers: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 20,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: 'Имя', align: 'start', sortable: true, value: 'first_name', width: 'auto' },
          { text: 'Фамилия', align: 'start', sortable: true, value: 'last_name' },
          { text: 'Отчество', align: 'start', sortable: true, value: 'middle_name' },
          { text: 'Роль', align: 'start', sortable: true, value: 'role' },
          { text: 'Проект', align: 'start', sortable: true, value: 'project' },
          { text: 'Группа', align: 'start', sortable: true, value: 'group' },
          { text: 'Организация', align: 'start', sortable: true, value: 'organization' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as UserInterface[]
      }
    }
  },

  watch: {
    'dataTableUsers.page': {
      handler () {
        this.fetchUsers()
      }
    },

    'filter.organization': {
      handler (val: OrganizationInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            organization_id: val.id
          }).then(this.fetchUsers)
        } else {
          this.$routerQuery.removeQuery([
            'organization_id'
          ]).then(this.fetchUsers)
        }
      }
    },

    'filter.project': {
      handler (val: ProjectInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            project_id: val.id
          }).then(this.fetchUsers)
        } else {
          this.$routerQuery.removeQuery([
            'project_id'
          ]).then(this.fetchUsers)
        }
      }
    },

    'filter.group': {
      handler (val: GroupInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            group_id: val.id
          }).then(this.fetchUsers)
        } else {
          this.$routerQuery.removeQuery([
            'group_id'
          ]).then(this.fetchUsers)
        }
      }
    }
  },

  mounted () {
    this.fetchUsers()
    this.$refs.sOrganizationsAutocomplete.fetchData()

    // Установка фильтров
    if (this.$routerQuery.hasQuery('organization_id')) {
      this.$refs.sOrganizationsAutocomplete.setDefault(this.$routerQuery.getQuery('organization_id', 0))
    }
    if (this.$routerQuery.hasQuery('project_id')) {
      this.$refs.sProjectsAutocomplete.setDefault(this.$routerQuery.getQuery('project_id', 0))
    }
    if (this.$routerQuery.hasQuery('group_id')) {
      this.$refs.sGroupsAutocomplete.setDefault(this.$routerQuery.getQuery('group_id', 0))
    }
  },

  methods: {
    fetchUsers () {
      this.dataTableUsers.processLoading = true
      const offset = (this.dataTableUsers.itemsPerPage * this.dataTableUsers.page) - this.dataTableUsers.itemsPerPage
      new Users()
        .find({
          ...this.$route.query,
          offset,
          count: this.dataTableUsers.itemsPerPage
        })
        .then((response: ResponseInterface<{count: number}, UserInterface[]>) => {
          this.dataTableUsers.totalCount = response.meta.count
          this.dataTableUsers.pages = Math.ceil(response.meta.count / this.dataTableUsers.itemsPerPage)
          this.dataTableUsers.items = response.data
        }).finally(() => (this.dataTableUsers.processLoading = false))
    },

    onButtonRefreshClick () {
      this.fetchUsers()
    },

    onPaginationChange (data: any) {
      this.dataTableUsers.pageStart = data.pageStart + 1
      this.dataTableUsers.pageStop = data.pageStop
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
