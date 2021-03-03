<template>
  <v-row>
    <v-col
      class="py-0"
      cols="12"
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
              {{ $tc('Roles') }}
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="dataTableRoles.processLoading"
              icon
              @click="onButtonRefreshClick"
            >
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              :disabled="!$permission.isGranted('role.create')"
              icon
              @click="onAddClick"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-toolbar>
          <v-data-table
            :headers="dataTableRoles.headers"
            :items="dataTableRoles.items"
            :server-items-length="dataTableRoles.totalCount"
            :page.sync="dataTableRoles.page"
            :items-per-page="dataTableRoles.itemsPerPage"
            :loading="dataTableRoles.processLoading"
            item-key="id"
            item-class="v-datatable-item"
            :loading-text="$tc('Loading content...')"
            :no-data-text="$tc('No data available')"
            disable-sort
            fixed-header
            calculate-widths
            hide-default-footer
            dense
            :height="dataTableUsersHeight"
          >
            <template slot="header.name" slot-scope="{ header }">
              <span class="text-no-wrap">{{ $tc(header.text) }}</span>
            </template>
            <template slot="item" slot-scope="{ item }">
              <tr class="v-datatable-item">
                <td class="text-no-wrap">{{ item.name }}</td>
                <td class="text-no-wrap text-right">
                  <v-btn
                    :to="{ name: 'administrator_roles_edit', params: { id: item.id } }"
                    icon
                    small
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
  </v-row>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import Vue, { VueConstructor } from 'vue'
import VInterface from '@/VInterface'
import Roles, { RoleInterface } from '@/api/Roles'

interface IRefs {
  [key: string]: any;
}

interface IData {
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: IData;
  $refs: IRefs;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({

  data (): IData {
    return {
      filter: {
        organization: null,
        project: null,
        group: null
      },
      dataTableRoles: {
        processLoading: false,
        headers: [
          { text: 'Role name', align: 'start', sortable: true, value: 'name', width: 'auto' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as RoleInterface[]
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableUsersHeight () {
      let h: number = this.$screenHeight - 170
      if (h < 640) { h = 640 }
      return h
    }
  },

  created () {
    this.fetchRoles()
  },

  methods: {
    fetchRoles () {
      this.dataTableRoles.processLoading = true
      const offset = (this.dataTableRoles.itemsPerPage * this.dataTableRoles.page) - this.dataTableRoles.itemsPerPage

      const params: any = {
        offset,
        count: this.dataTableRoles.itemsPerPage
      }

      if (this.assertObjectHasAttribute(this.$route.query, 'organization_id')) {
        params.organization_id = this.$route.query.organization_id
      }

      new Roles()
        .get(params)
        .then((response) => {
          this.dataTableRoles.items = response
        }).finally(() => (this.dataTableRoles.processLoading = false))
    },

    onButtonRefreshClick () {
      this.fetchRoles()
    },

    onAddClick () {
      this.$dialog.prompt({
        title: this.$tc('Creating a new role'),
        text: this.$tc('New role name'),
        actions: [
          {
            text: this.$tc('Cancel'),
            color: 'red'
          },
          {
            text: this.$tc('Save')
          }
        ]
      }).then((name: string) => {
        if (name) {
          new Roles()
            .add({
              name
            }).then((id: number) => {
              this.$toast.success(this.$tc('Role successfully created'))
              this.$router.push({
                name: 'administrator_roles_edit',
                params: { id }
              })
            }).catch((e: APIError) => {
              if (Array.isArray(e.errors)) {
                e.errors.map((e: any) => {
                  this.$toast.warning(e.message)
                })
              }
              this.$toast.error(e.message)
            })
        }
      })
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
