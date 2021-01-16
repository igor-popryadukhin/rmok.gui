<template>
  <div>
    <v-row no-gutters>
      <v-col class="pa-0">
        <v-data-table
          :headers="dataTableOrganizations.headers"
          :items="dataTableOrganizations.items"
          :server-items-length="dataTableOrganizations.totalCount"
          :page.sync="dataTableOrganizations.page"
          :items-per-page="dataTableOrganizations.itemsPerPage"
          :loading="dataTableOrganizations.processLoading"
          item-key="id"
          item-class="v-datatable-item"
          :height="$screenHeight - negativeScreenHeightSize"
          @pagination="onPaginationChange"
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
                {{ $tc('Organizations') }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="dataTableOrganizations.processLoading"
                icon
                @click="onButtonRefreshClick"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                :to="{ name: 'administrator_organizations_new' }"
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
              <td class="text-no-wrap">{{ item.email || '—' }}</td>
              <td class="text-no-wrap">{{ item.inn || '—' }}</td>
              <td class="text-no-wrap">{{ item.cpp || '—' }}</td>
              <td class="text-no-wrap">{{ item.site || '—' }}</td>
              <td class="text-no-wrap">{{ item.city || '—' }}</td>
              <td class="text-no-wrap">{{ item.responsible ? `${item.responsible.first_name} ${item.responsible.last_name}` : '—' }}</td>
              <td class="text-no-wrap text-right">
                <v-btn
                  icon
                  small
                  :to="{ name: 'administrator_organizations_edit', params: { id: item.id } }"
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
            v-model="dataTableOrganizations.page"
            :length="dataTableOrganizations.pages"
            total-visible="6"
            :disabled="dataTableOrganizations.pages === 0"
          ></v-pagination>
        </div>
        <div class="d-flex align-center justify-center">
          {{ this.dataTableOrganizations.pageStart }}-{{ this.dataTableOrganizations.pageStop }} из {{ this.dataTableOrganizations.totalCount }}
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Organizations, { OrganizationInterface } from '@/api/Organizations'
import ResponseInterface from '@/api/Schemas/ResponseInterface'

export default Vue.extend({
  beforeRouteLeave (to, from, next) {
    this.buttonAdd.disabled = true
    next()
  },
  data () {
    return {
      buttonAdd: {
        disabled: false
      },
      negativeScreenHeightSize: 205,
      dataTableOrganizations: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 20,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: this.$tc('Name'), align: 'start', sortable: true, value: 'name', width: 'auto' },
          { text: this.$tc('Email'), align: 'start', sortable: true, value: 'email', width: 'auto' },
          { text: this.$tc('ITN/TIN'), align: 'start', sortable: true, value: 'inn', width: 'auto' },
          { text: this.$tc('IEC'), align: 'start', sortable: true, value: 'cpp', width: 'auto' },
          { text: this.$tc('Site'), align: 'start', sortable: true, value: 'site', width: 'auto' },
          { text: this.$tc('City'), align: 'start', sortable: true, value: 'city', width: 'auto' },
          { text: this.$tc('Responsible'), align: 'start', sortable: true, value: 'responsible', width: 'auto' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as OrganizationInterface[]
      }
    }
  },

  watch: {
    'dataTableOrganizations.page': {
      handler () {
        this.fetchOrganizations()
      }
    }
  },

  created () {
    this.fetchOrganizations()
  },

  methods: {
    fetchOrganizations () {
      this.dataTableOrganizations.processLoading = true
      const offset = (this.dataTableOrganizations.itemsPerPage * this.dataTableOrganizations.page) - this.dataTableOrganizations.itemsPerPage
      new Organizations()
        .find({
          offset,
          count: this.dataTableOrganizations.itemsPerPage
        })
        .then((response: ResponseInterface<any, OrganizationInterface[]>) => {
          this.dataTableOrganizations.totalCount = response.meta.count
          this.dataTableOrganizations.pages = Math.ceil(response.meta.count / this.dataTableOrganizations.itemsPerPage)
          this.dataTableOrganizations.items = response.data
        }).finally(() => {
          this.dataTableOrganizations.processLoading = false
        })
    },

    onPaginationChange (data: any) {
      this.dataTableOrganizations.pageStart = data.pageStart + 1
      this.dataTableOrganizations.pageStop = data.pageStop
    },

    onButtonRefreshClick () {
      this.fetchOrganizations()
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
