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
            <v-data-table
              :headers="dataTableOrganizations.headers"
              :items="dataTableOrganizations.items"
              :server-items-length="dataTableOrganizations.totalCount"
              :page.sync="dataTableOrganizations.page"
              :items-per-page="dataTableOrganizations.itemsPerPage"
              :loading="dataTableOrganizations.processLoading"
              item-key="id"
              item-class="v-datatable-item"
              :height="dataTableOrganizationsHeight"
              @pagination="onPaginationChange"
              :loading-text="$tc('Loading content...')"
              :no-data-text="$tc('No data available')"
              disable-sort
              fixed-header
              calculate-widths
              hide-default-footer
              dense
            >
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
          </v-card-text>
          <v-footer color="white" class="d-flex justify-md-space-between pa-4 mt-auto" absolute>
            <v-pagination
              v-model="dataTableOrganizations.page"
              :length="dataTableOrganizations.pages"
              total-visible="3"
              :disabled="dataTableOrganizations.pages === 0"
            ></v-pagination>
            <div class="d-flex align-center justify-center">
              {{ this.dataTableOrganizations.pageStart }}-{{ this.dataTableOrganizations.pageStop }} из {{ this.dataTableOrganizations.totalCount }}
            </div>
          </v-footer>
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
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import Organizations, { OrganizationInterface } from '@/api/Organizations'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import VInterface from '@/VInterface'

export default (Vue as VueConstructor<VInterface>).extend({
  beforeRouteLeave (to, from, next) {
    this.buttonAdd.disabled = true
    next()
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableOrganizationsHeight () {
      let h: number = this.$screenHeight - 170
      if (h < 640) { h = 640 }
      return h
    }
  },

  created () {
    this.fetchOrganizations()
  },

  data () {
    return {
      buttonAdd: {
        disabled: false
      },
      dataTableOrganizations: {
        headers: [
          { align: 'start', sortable: true, text: this.$tc('Name'), value: 'name', width: 'auto' },
          { align: 'start', sortable: true, text: this.$tc('Email'), value: 'email', width: 'auto' },
          { align: 'start', sortable: true, text: this.$tc('ITN/TIN'), value: 'inn', width: 'auto' },
          { align: 'start', sortable: true, text: this.$tc('IEC'), value: 'cpp', width: 'auto' },
          { align: 'start', sortable: true, text: this.$tc('Site'), value: 'site', width: 'auto' },
          { align: 'start', sortable: true, text: this.$tc('City'), value: 'city', width: 'auto' },
          { align: 'start', sortable: true, text: this.$tc('Responsible'), value: 'responsible', width: 'auto' },
          { align: 'end', sortable: true, text: '', value: 'actions', width: '100%' }
        ],
        items: [] as OrganizationInterface[],
        itemsPerPage: 20,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        totalCount: 0
      },
      negativeScreenHeightSize: 205
    }
  },

  methods: {
    fetchOrganizations () {
      this.dataTableOrganizations.processLoading = true
      const offset = (this.dataTableOrganizations.itemsPerPage * this.dataTableOrganizations.page) - this.dataTableOrganizations.itemsPerPage
      new Organizations()
        .find({
          count: this.dataTableOrganizations.itemsPerPage,
          offset
        })
        .then((response: ResponseInterface<any, OrganizationInterface[]>) => {
          this.dataTableOrganizations.totalCount = response.meta.count
          this.dataTableOrganizations.pages = Math.ceil(response.meta.count / this.dataTableOrganizations.itemsPerPage)
          this.dataTableOrganizations.items = response.data
        }).finally(() => {
          this.dataTableOrganizations.processLoading = false
        })
    },

    onButtonRefreshClick () {
      this.fetchOrganizations()
    },

    onPaginationChange (data: any) {
      this.dataTableOrganizations.pageStart = data.pageStart + 1
      this.dataTableOrganizations.pageStop = data.pageStop
    }
  },

  watch: {
    'dataTableOrganizations.page': {
      handler () {
        this.fetchOrganizations()
      }
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
