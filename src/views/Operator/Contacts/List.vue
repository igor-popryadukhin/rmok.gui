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
                    :to="{ name: 'operator_contacts_new' }"
                    icon
                  >
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-toolbar>
              </template>

              <template slot="item" slot-scope="{ item }">
                <tr class="v-datatable-item">
                  <td class="text-no-wrap">{{ item.first_name || '' }} {{ item.last_name || '' }} {{ item.middle_name || '' }}</td>
<!--                  <td class="text-no-wrap">{{  item.project ? item.project.name : '—' }}</td>-->
                  <td class="text-no-wrap">{{ new Date(item.created_at * 1000).toLocaleString()  }}</td>
                  <td class="text-no-wrap text-right">
                    <v-btn
                      icon
                      small
                      :to="{ name: 'operator_contacts_edit', params: { contact_id: item.id } }"
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
          <v-footer absolute class="d-flex justify-md-space-between pa-4 mt-auto">
            <v-pagination
              v-model="dataTableContacts.page"
              :length="dataTableContacts.pages"
              total-visible="3"
              :disabled="dataTableContacts.pages === 0"
            ></v-pagination>
            <div class="d-flex align-center justify-center">
              {{ this.dataTableContacts.pageStart }}-{{ this.dataTableContacts.pageStop }} из {{ this.dataTableContacts.totalCount }}
            </div>
          </v-footer>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export default Vue.extend({
  data () {
    return {
      filter: {}, //
      dataTableContacts: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 100,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: this.$tc('Client'), align: 'start', sortable: true, value: 'client', width: '100%' },
          { text: this.$tc('Created at'), align: 'start', sortable: true, value: 'created_at', width: 'auto' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '1%' }
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
    }
  },

  mounted () {
    this.fetchContacts()
  },

  methods: {
    fetchContacts () {
      this.dataTableContacts.processLoading = true
      const offset = (this.dataTableContacts.itemsPerPage * this.dataTableContacts.page) - this.dataTableContacts.itemsPerPage
      new Contacts()
        .find<{count: number}, ContactInterface[]>({
          ...this.$route.query,
          offset,
          count: this.dataTableContacts.itemsPerPage
        })
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
