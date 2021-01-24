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
              <v-toolbar-title class="grey--text">{{ $tc('Projects') }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                :disabled="dataTableProjects.processLoading"
                icon
                @click="onButtonRefreshClick"
              >
                <v-icon>mdi-refresh</v-icon>
              </v-btn>
              <v-btn
                color="primary"
                :to="{ name: 'administrator_projects_new' }"
                v-bind="buttonAdd"
                icon
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </v-toolbar>
            <v-data-table
              :headers="dataTableProjects.headers"
              :items="dataTableProjects.items"
              :server-items-length="dataTableProjects.totalCount"
              :page.sync="dataTableProjects.page"
              :items-per-page="dataTableProjects.itemsPerPage"
              :loading="dataTableProjects.processLoading"
              item-key="id"
              item-class="v-datatable-item"
              :height="dataTableProjectsHeight"
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
               {{ $tc(header.text) }}
              </template>
              <template slot="header.organization" slot-scope="{ header }">
                {{ $tc(header.text) }}
              </template>
              <template slot="item" slot-scope="{ item }">
                <tr class="v-datatable-item">
                  <td class="text-no-wrap">{{ item.name }}</td>
                  <td class="text-no-wrap">{{ item.organization ? item.organization.name : '—' }}</td>
                  <td class="text-no-wrap text-right">
                    <v-btn
                      icon
                      small
                      :to="{ name: 'administrator_projects_edit', params: { project_id: item.id } }"
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
            <s-organizations-autocomplete
              ref="sOrganizationsAutocomplete"
              v-model="filter.organization"
              :label="$tc('Organization')"
              outlined
              dense
            />
          </v-card-text>
          <v-footer absolute class="d-flex justify-md-space-between pa-4 mt-auto">
            <v-pagination
              v-model="dataTableProjects.page"
              :length="dataTableProjects.pages"
              total-visible="3"
              :disabled="dataTableProjects.pages === 0"
            ></v-pagination>
            <div class="d-flex align-center justify-center">
              {{ this.dataTableProjects.pageStart }}-{{ this.dataTableProjects.pageStop }} из {{ this.dataTableProjects.totalCount }}
            </div>
          </v-footer>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Projects, { ProjectInterface } from '@/api/Projects'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import { OrganizationInterface } from '@/api/Organizations'

export default Vue.extend({
  components: {
    SOrganizationsAutocomplete
  },

  data () {
    return {
      buttonAdd: {
        disabled: false
      },
      filter: {
        organization: null
      },
      dataTableProjects: {
        processLoading: false,
        page: 1,
        pages: 0,
        totalCount: 0,
        itemsPerPage: 30,
        pageStart: 0,
        pageStop: 0,
        headers: [
          { text: 'Name', align: 'start', sortable: true, value: 'name', width: 'auto' },
          { text: 'Organization', align: 'start', sortable: true, value: 'organization', width: 'auto' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as ProjectInterface[]
      }
    }
  },

  watch: {
    'filter.organization': {
      handler (val: OrganizationInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            organization_id: val.id
          }).then(this.fetchProjects)
        } else {
          this.$routerQuery.removeQuery([
            'organization_id'
          ]).then(this.fetchProjects)
        }
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableProjectsHeight () {
      let h: number = this.$screenHeight - 210
      if (h < 640) { h = 640 }
      return h
    }
  },

  mounted () {
    this.fetchProjects()
    this.$refs.sOrganizationsAutocomplete.fetchData()

    // Установка фильтров
    if (this.$routerQuery.hasQuery('organization_id')) {
      this.$refs.sOrganizationsAutocomplete.setDefault(this.$routerQuery.getQuery('organization_id', 0))
    }
  },

  methods: {
    fetchProjects () {
      this.dataTableProjects.processLoading = true
      const offset = (this.dataTableProjects.itemsPerPage * this.dataTableProjects.page) - this.dataTableProjects.itemsPerPage

      new Projects()
        .find<{ count: number }, ProjectInterface[]>({
          ...this.$route.query,
          offset,
          count: this.dataTableProjects.itemsPerPage
        }).then((response) => {
          this.dataTableProjects.totalCount = response.meta.count
          this.dataTableProjects.pages = Math.ceil(response.meta.count / this.dataTableProjects.itemsPerPage)
          this.dataTableProjects.items = response.data
        }).finally(() => {
          this.dataTableProjects.processLoading = false
        })
    },

    onPaginationChange (data: any) {
      this.dataTableProjects.pageStart = data.pageStart + 1
      this.dataTableProjects.pageStop = data.pageStop
    },

    onButtonRefreshClick () {
      this.fetchProjects()
    }
  }
})
</script>

<style lang="scss">
.v-toolbar-header div {
  padding: 0 !important;
}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>
