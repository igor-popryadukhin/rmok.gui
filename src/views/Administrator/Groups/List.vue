<template>
  <div>
    <v-row no-gutters>
      <v-col class="pa-0">
        <v-data-table
          :headers="dataTableGroups.headers"
          :items="dataTableGroups.items"
          :server-items-length="dataTableGroups.totalCount"
          :page.sync="dataTableGroups.page"
          :items-per-page="dataTableGroups.itemsPerPage"
          :loading="dataTableGroups.processLoading"
          item-key="id"
          item-class="v-datatable-item"
          :height="$screenHeight - negativeScreenHeightSize"
          :loading-text="$tc('Loading content...')"
          :no-data-text="$tc('No data available')"
          disable-sort
          fixed-header
          calculate-widths
          hide-default-footer
          dense
        >
          <template v-slot:top>
            <v-toolbar
              class="v-toolbar-header"
              height="48"
              flat
            >
              <v-toolbar-title class="grey--text">
                {{ $tc('Groups') }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="dataTableGroups.processLoading"
                icon
                @click="onButtonRefreshClick"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                :to="{ name: 'administrator_groups_new' }"
                v-bind="buttonAdd"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
          </template>
          <template slot="header.name" slot-scope="{ header }">
            <span class="text-no-wrap">{{ header.text }}</span>
          </template>
          <template slot="item" slot-scope="{ item }">
            <tr class="v-datatable-item">
              <td class="text-no-wrap">{{ item.name || $tc('No name') }}</td>
              <td class="text-no-wrap">{{ item.organization ? item.organization.name : '—' }}</td>
              <td class="text-no-wrap">{{ item.team_leader ? `${item.team_leader.first_name} ${item.team_leader.last_name}` : '—' }}</td>
              <td class="text-no-wrap text-right">
                <v-btn
                  icon
                  small
                  :to="{ name: 'administrator_groups_edit', params: { id: item.id } }"
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
      <v-col class="d-flex justify-md-space-between">
        <div>
          <v-pagination
            v-model="dataTableGroups.page"
            :length="dataTableGroups.pages"
            total-visible="6"
            :disabled="dataTableGroups.pages === 0"
          ></v-pagination>
        </div>
        <div class="d-flex align-center justify-center">
          {{ this.dataTableGroups.pageStart }}-{{ this.dataTableGroups.pageStop }} из {{ this.dataTableGroups.totalCount }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { GroupInterface, Groups } from '@/api/Groups'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

export default Vue.extend({
  data () {
    return {
      negativeScreenHeightSize: 205,
      buttonAdd: {
        disabled: false
      },
      dataTableGroups: {
        page: 1,
        pages: 1,
        totalCount: 0,
        itemsPerPage: 20,
        pageStart: 0,
        pageStop: 0,
        processLoading: false,
        headers: [
          { text: 'Имя', align: 'start', sortable: false, value: 'name', width: 'auto' },
          { text: 'Организация', align: 'start', sortable: false, value: 'organization' },
          { text: 'Ответственный', align: 'start', sortable: false, value: 'team_leader' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as GroupInterface[]
      },
      groupsProcessLoading: false
    }
  },

  created () {
    this.fetchGroups()
  },

  methods: {
    onDeleteItem (id: number) {
      this.$dialog.confirm({
        text: this.$tc('confirm_group_deletion'),
        title: this.$tc('confirmation_request'),
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            text: this.$tc('yes'),
            handle: () => {
              return new Promise((resolve) => {
                new Groups()
                  .delete(id)
                  .then(() => {
                    this.groups = this.groups.filter((e: GroupInterface) => e.id !== id)
                    this.$toast.success(this.$t('group_delete_successfully'), { icon: true })
                  }).catch((e: any) => {
                    const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                    this.$toast.error(this.$t('group_delete_error', { cause }), { icon: true })
                  }).finally()

                resolve()
              })
            }
          }
        }
      })
    },

    fetchGroups () {
      this.dataTableGroups.processLoading = true
      const offset = (this.dataTableGroups.itemsPerPage * this.dataTableGroups.page) - this.dataTableGroups.itemsPerPage
      new Groups()
        .find({
          offset,
          count: this.dataTableGroups.itemsPerPage
        })
        .then((response: ResponseInterface<{ count: number }, GroupInterface[]>) => {
          this.dataTableGroups.totalCount = response.meta.count
          this.dataTableGroups.pages = Math.ceil(response.meta.count / this.dataTableGroups.itemsPerPage)
          this.dataTableGroups.items = response.data
        }).finally(() => {
          this.dataTableGroups.processLoading = false
        })
    },

    onButtonRefreshClick () {
      this.fetchGroups()
    }
  }
})
</script>

<style scoped>

</style>
