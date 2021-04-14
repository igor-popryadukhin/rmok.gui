<template>
  <v-row>
    <v-col
      class="py-0 pb-md-0 pb-lg-0 pb-xl-0"
      cols="12"
      md="9"
      lg="9"
      xl="9"
      order-lg="1"
      order-md="1"
      order-sm="2"
      order-xl="2"
    >
      <v-card
        flat
        tile
        outlined
      >
        <v-card-text>
          <v-data-table
            :headers="dataTableGroups.headers"
            :items="dataTableGroups.items"
            :server-items-length="dataTableGroups.totalCount"
            :page.sync="dataTableGroups.page"
            :items-per-page="dataTableGroups.itemsPerPage"
            :loading="dataTableGroups.processLoading"
            item-key="id"
            item-class="v-datatable-item"
            :loading-text="$tc('Loading content...')"
            :no-data-text="$tc('No data available')"
            :height="dataTableGroupsHeight"
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
                <td class="text-no-wrap">{{ item.responsible ? `${item.responsible.first_name} ${item.responsible.last_name}` : '—' }}</td>
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
        </v-card-text>
        <v-footer class="d-flex justify-md-space-between pa-4 mt-auto" color="white">
          <v-pagination
            v-model="dataTableGroups.page"
            :length="dataTableGroups.pages"
            total-visible="6"
            :disabled="dataTableGroups.pages === 0"
          ></v-pagination>
          <div class="d-flex align-center justify-center">
            {{ this.dataTableGroups.pageStart }}-{{ this.dataTableGroups.pageStop }} из {{ this.dataTableGroups.totalCount }}
          </div>
        </v-footer>
      </v-card>
    </v-col>
    <v-col
      class="py-0 pt-md pl-md-0 pl-lg-0 pl-xl-0"
      cols="12"
      md="3"
      lg="3"
      xl="3"
      order-lg="2"
      order-md="2"
      order-sm="1"
      order-xl="1"
    >
      <v-card
        class="fill-height"
        tile
        outlined
      >
        <v-toolbar flat>
          <v-toolbar-title class="grey--text">{{ $tc('Filter') }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <!-- FILTERS -->
        <v-card-text>
          <s-projects-autocomplete
            ref="sProjectsAutocomplete"
            v-model="filter.project"
            :label="$tc('Project')"
            clearable
            dense
          />
        </v-card-text>
        <!-- FILTERS -->
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue'
import { GroupInterface, Groups } from '@/api/Groups'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import { ProjectInterface } from '@/api/Projects'
import SOrganizationsAutocomplete from '@/snippets/SOrganizations/SOrganizationsAutocomplete.vue'
import SProjectsAutocomplete from '@/snippets/SProjects/SProjectsAutocomplete.vue'
import SGroups from '@/snippets/SGroups/SGroups.vue'
import VInterface from '@/VInterface'

export default (Vue as VueConstructor<VInterface>).extend({
  components: { SProjectsAutocomplete },
  data () {
    return {
      negativeScreenHeightSize: 220,
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
          { text: 'Ответственный', align: 'start', sortable: false, value: 'responsible' },
          { text: '', align: 'end', sortable: true, value: 'actions', width: '100%' }
        ],
        items: [] as GroupInterface[]
      },
      groupsProcessLoading: false,
      filter: {
        project: null
      }
    }
  },

  watch: {
    'filter.project': {
      handler (val: ProjectInterface) {
        if (val) {
          this.$routerQuery.setQuery({
            project_id: val.id
          }).then(this.fetchUsers)
        } else {
          this.$routerQuery.removeQuery([
            'project_id'
          ]).then(this.fetchUsers)
        }
      }
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableGroupsHeight () {
      let h: number = this.$screenHeight - 250
      if (h < 640) { h = 640 }
      return h
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

<style>

.v-toolbar-header div {
  padding: 0 !important;
}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>
