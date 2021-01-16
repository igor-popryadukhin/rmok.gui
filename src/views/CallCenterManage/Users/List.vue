<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col>
        <v-data-table
          dense
          :headers="dataTableUsers.headers"
          :items="dataTableUsers.items"
          :server-items-length="dataTableUsers.totalCount"
          :page.sync="dataTableUsers.page"
          :items-per-page="dataTableUsers.itemsPerPage"
          :loading="usersProcessLoading"
          item-key="id"
          item-class="v-datatable-item"
          disable-sort
          fixed-header
          calculate-widths
          hide-default-footer
          :height="$screenHeight - 270"
          @pagination="onPaginationChange"
        >
          <template v-slot:top>
            <v-toolbar
              dense
              flat
            >
              <v-toolbar-title class="grey--text">
                Пользователи системы
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :to="{ name: 'call_center_manager_users_new' }"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
          <template slot="item" slot-scope="{ item }">
            <tr class="v-datatable-item">
              <td>{{ item.first_name }}</td>
              <td>{{ item.last_name }}</td>
              <td>{{ item.middle_name }}</td>
              <td class="text-no-wrap">{{ item.role ? item.role.name : '-' }}</td>
              <td>{{ item.email }}</td>
<!--              <td class="text-no-wrap">{{ item.organization ? item.organization.name : '-'}}</td>-->
              <td class="text-no-wrap text-right">
                <v-btn icon small>
                  <v-icon>mdi-pencil-box-outline</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-md-space-between">
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
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserInterface, Users } from '@/api/Users'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

export default Vue.extend({
  data () {
    return {
      dataTableUsers: {
        page: 1,
        pages: 1,
        totalCount: 0,
        itemsPerPage: 20,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: 'Имя', align: 'start', sortable: true, value: 'first_name', width: 'auto' },
          { text: 'Фамилия', align: 'start', sortable: true, value: 'last_name' },
          { text: 'Отчество', align: 'start', sortable: true, value: 'middle_name' },
          { text: 'Роль', align: 'start', sortable: true, value: 'role' },
          { text: 'E-Mail', align: 'start', sortable: true, value: 'email' },
          // { text: 'Организация', align: 'start', sortable: true, value: 'organization' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as UserInterface[]
      },
      usersProcessLoading: false
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
      this.usersProcessLoading = true
      const offset = (this.dataTableUsers.itemsPerPage * this.dataTableUsers.page) - this.dataTableUsers.itemsPerPage
      new Users()
        .find({
          offset,
          count: this.dataTableUsers.itemsPerPage
        })
        .then((response: ResponseInterface<{ count: number }, UserInterface[]>) => {
          this.dataTableUsers.totalCount = response.count
          this.dataTableUsers.pages = Math.ceil(response.count / this.dataTableUsers.itemsPerPage)
          this.dataTableUsers.items = response.data
        }).finally(() => {
          this.usersProcessLoading = false
        })
    },
    onPaginationChange (data: any) {
      this.dataTableUsers.pageStart = data.pageStart + 1
      this.dataTableUsers.pageStop = data.pageStop
    }
  }
})
</script>

<style scoped>

</style>
