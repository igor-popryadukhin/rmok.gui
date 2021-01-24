<template>
  <div>
    <v-row>
      <v-col>
        <v-card
          tile
          flat
          outlined
        >
          <v-card-text>
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
              :height="dataTableUsersHeight"
              @pagination="onPaginationChange"
            >
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
            ***
          </v-card-text>
          <v-footer absolute class="d-flex justify-md-space-between pa-4 mt-auto">
            <v-pagination
              v-model="dataTableUsers.page"
              :length="dataTableUsers.pages"
              total-visible="3"
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

export default Vue.extend({
  data () {
    return {
      dataTableUsers: {
        page: 1,
        pages: 1,
        totalCount: 0 as number,
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

  computed: {
    // Вычисляю высоту таблицы
    dataTableUsersHeight () {
      let h: number = this.$screenHeight - 210
      if (h < 640) { h = 640 }
      return h
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
          this.dataTableUsers.totalCount = response.meta.count
          this.dataTableUsers.pages = Math.ceil(response.meta.count / this.dataTableUsers.itemsPerPage)
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
