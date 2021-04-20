<template>
  <v-row>
    <v-col
      class="px-0"
      cols="12"
      md="9"
      lg="9"
    >
      <v-card
        flat
        tile
      >
        <v-card-text>
          <v-data-table
            :headers="dataTableContacts.headers"
            :items="dataTableContacts.items"
            :server-items-length="dataTableContacts.totalCount"
            :page.sync="dataTableContacts.page"
            :items-per-page="dataTableContacts.itemsPerPage"
            :loading="dataTableContacts.processLoading"
            :loading-text="$tc('Loading content...')"
            :no-data-text="$tc('No data available')"
            :height="tabsHeight"
            item-key="id"
            item-class="v-datatable-item"
            disable-sort
            fixed-header
            calculate-widths
            hide-default-footer
            dense
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
                <td class="text-no-wrap">
                  <router-link :to="{ name: 'operator_contacts_view', params: { contact_id: String(item.id) } }">
                    {{ item.first_name }} {{ item.last_name }} {{ item.middle_name }}
                  </router-link>
                </td>
                <td class="text-no-wrap">{{ $moment.unix(item.created_at).format('LL') }}</td>
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

    <!-- Фильтр -->
    <v-col
      cols="12"
      md="3"
      lg="3"
      class="pl-md-0 pl-lg-0"
    >
      <v-card
        class="fill-height"
        flat
        tile
      >
        <v-toolbar flat>
          <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-footer
          class="d-flex justify-md-space-between pa-4 mt-auto"
          color="white"
          absolute
        >
          <v-pagination
            v-model="dataTableContacts.page"
            :length="dataTableContacts.pages"
            total-visible="4"
            :disabled="dataTableContacts.pages === 0"
          ></v-pagination>
          <div class="d-flex align-center justify-center">
            {{ this.dataTableContacts.pageStart }}-{{ this.dataTableContacts.pageStop }} из {{ this.dataTableContacts.totalCount }}
          </div>
        </v-footer>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import { Contacts } from '@/api/Contacts'
import { ContactInterface } from '@/api/Schemas/ContactInterface'

export default Vue.extend({
  computed: {
    tabsHeight () {
      let h: number = this.$screenHeight - 200
      if (h < 640) { h = 640 }
      return h
    }
  },

  data () {
    return {
      dataTableContacts: {
        headers: [
          { align: 'start', sortable: true, text: this.$tc('Client'), value: 'client', width: '100%' },
          { align: 'start', sortable: true, text: this.$tc('Created at'), value: 'created_at', width: 'auto' },
          { align: 'end', sortable: true, text: '', value: 'actions', width: '1%' }
        ],
        items: [] as ContactInterface[],
        itemsPerPage: 50,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        totalCount: 0
      },
      filter: {
        q: null
      }
    }
  },

  methods: {
    fetchContacts () {
      this.dataTableContacts.processLoading = true
      const offset = (this.dataTableContacts.itemsPerPage * this.dataTableContacts.page) - this.dataTableContacts.itemsPerPage
      new Contacts()
        .find<{count: number}, ContactInterface[]>({
          ...this.$route.query,
          count: this.dataTableContacts.itemsPerPage,
          offset
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

    onContactItemDblClick (item: ContactInterface) {
      this.$router.push({
        name: 'operator_contacts_view',
        params: {
          contact_id: String(item.id)
        }
      })
    },

    onPaginationChange (data: any) {
      this.dataTableContacts.pageStart = data.pageStart + 1
      this.dataTableContacts.pageStop = data.pageStop
    }
  },

  mounted () {
    this.fetchContacts()
  },

  watch: {
    'dataTableContacts.page': {
      handler () {
        this.fetchContacts()
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
