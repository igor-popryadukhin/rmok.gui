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
                :to="{ name: 'team_leader_users_new' }"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
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
              :height="dataTableUsersHeight"
              @pagination="onPaginationChange"
            >
              <template slot="header.email" slot-scope="{ header }">
                <span class="text-no-wrap">{{ header.text }}</span>
              </template>
              <template slot="item" slot-scope="{ item }">
                <tr class="v-datatable-item">
                  <td class="text-no-wrap">{{ item.first_name || $tc('—') }}</td>
                  <td class="text-no-wrap">{{ item.last_name || $tc('—') }}</td>
                  <td class="text-no-wrap">{{ item.middle_name || $tc('—') }}</td>
                  <td class="text-no-wrap">
                    {{ item.role ? item.role.name : '—' }}
                    <template v-if="item.role.id === 'r_operator'">
                      <v-icon
                        v-if="item.status === 'available'"
                        size="18"
                        color="green"
                      >
                        mdi-check-circle-outline
                      </v-icon>
                      <v-icon
                        v-if="item.status === 'do_not_disturb'"
                        size="18"
                        color="red"
                      >
                        mdi-do-not-disturb
                      </v-icon>
                      <v-icon
                        v-if="item.status === 'coffee_break'"
                        size="18"
                        color="blue"
                      >
                        mdi-pause-circle-outline
                      </v-icon>
                    </template>
                  </td>
                  <td class="text-no-wrap">{{ item.project ? item.project.name : '—' }}</td>
                  <td class="text-no-wrap text-right">
                    <v-btn
                      icon
                      small
                      :to="{ name: 'team_leader_users_edit', params: { id: item.id } }"
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
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import { ProjectInterface } from '@/api/Projects'

export default Vue.extend({
  components: {
    SProjectsAutocomplete
  },

  data () {
    return {
      filter: {
        project: null
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
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableUsersHeight () {
      let h: number = this.$screenHeight - 210
      if (h < 640) { h = 640 }
      return h
    }
  },

  mounted () {
    this.fetchUsers()

    // Установка фильтров
    if (this.$routerQuery.hasQuery('project_id')) {
      this.$refs.sProjectsAutocomplete.setDefault(this.$routerQuery.getQuery('project_id', 0))
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
