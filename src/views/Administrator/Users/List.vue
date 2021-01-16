<template>
  <div>
    <v-row no-gutters>
      <v-col class="pa-0">
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
              <td class="text-no-wrap">{{ item.group ? item.group.name : '—' }}</td>
              <td class="text-no-wrap">{{ item.email || '—' }}</td>
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
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col class="d-flex justify-md-space-between pa-0">
        <div>
          <v-pagination
            v-model="dataTableUsers.page"
            :length="dataTableUsers.pages"
            total-visible="6"
          ></v-pagination>
        </div>
        <div class="d-flex align-center justify-center">
          {{ this.dataTableUsers.pageStart }}-{{ this.dataTableUsers.pageStop }} из {{ this.dataTableUsers.totalCount }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserInterface, Users } from '@/api/Users'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

export default Vue.extend({
  data () {
    return {
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
          { text: 'Группа', align: 'start', sortable: true, value: 'group' },
          { text: 'E-Mail', align: 'start', sortable: true, value: 'email', class: 'text-no-warp' },
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
    }
  },

  created () {
    this.fetchUsers()
  },

  methods: {
    fetchUsers () {
      this.dataTableUsers.processLoading = true
      const offset = (this.dataTableUsers.itemsPerPage * this.dataTableUsers.page) - this.dataTableUsers.itemsPerPage
      new Users()
        .find({
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
