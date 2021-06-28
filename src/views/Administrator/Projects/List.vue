<template>
  <v-sheet>
    <app-tools>
      <template v-slot:left>
        <v-tooltip
          :open-delay="$tooltip.openDelay"
          :color="$tooltip.color"
          right
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-on="on"
              v-bind="attrs"
              :to="{ name: 'administrator_projects_new' }"
              small
              tile
              text
            >
              {{ $tc('Add') }}
            </v-btn>
          </template>
          <span>{{ $tc('Add new project') }}</span>
        </v-tooltip>
      </template>
      <template v-slot:right>
        <app-pagination
          v-model="dataTableProjects.page"
         :length="dataTableProjects.pages"
        >
          <template v-slot:display>
            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  v-on="on"
                  tile
                  text
                  small
                >
                  <app-count-up
                    :end-val="dataTableProjects.pageStart"
                  />
                  <span class="mx-1">—</span>
                  <app-count-up
                    :end-val="dataTableProjects.pageStop"
                  />
                  <span class="mx-1">из</span>
                  <app-number-format
                    :value="dataTableProjects.totalCount"
                  />
                </v-btn>
              </template>
              <v-list
                :disabled="dataTableProjects.pages < 4"
                v-ripple="false"
                class="py-0"
                dense
                flat
              >
                <v-list-item
                  link
                  @click="dataTableProjects.page = 1"
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые новые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  @click="dataTableProjects.page = Math.floor(dataTableProjects.pages/2)"
                >
                  <v-list-item-content>
                    <v-list-item-title>Между новыми и старыми</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  @click="dataTableProjects.page = dataTableProjects.pages - 1"
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые старые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </app-pagination>
      </template>
    </app-tools>

    <v-list dense>
      <template v-for="item in dataTableProjects.items">

        <v-list-item
          :key="`v-list-item-` + item.id"
          link
          @mouseenter="projectHoverId = item.id | 0"
          @mouseleave="projectHoverId = 0"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ item.name }}
            </v-list-item-title>
          </v-list-item-content>

          <!-- Actions -->
          <v-list-item-action
            style="margin: 0"
          >
            <div class="d-flex d-inline">
              <div v-if="projectHoverId !== item.id">
                <span style="font-size: 12px; padding: 2px; margin-right: 10px">
                  {{ $moment.unix(item.created_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                </span>
              </div>
              <v-btn
                v-if="projectHoverId === item.id"
                :to="{ name: 'administrator_projects_edit', params: { project_id: item.id } }"
                small
                icon
              >
                <v-icon>
                  mdi-pencil-box-outline
                </v-icon>
              </v-btn>
            </div>
          </v-list-item-action>
        </v-list-item>

        <v-divider :key="`v-divider-` + item.id"/>
      </template>
    </v-list>
<!--    <v-row>-->
<!--      <v-col-->
<!--        class="py-0"-->
<!--        cols="12"-->
<!--        md="9"-->
<!--        lg="9"-->
<!--      >-->
<!--        <v-card-->
<!--          flat-->
<!--          tile-->
<!--          outlined-->
<!--        >-->
<!--          <v-card-text>-->
<!--            <v-toolbar-->
<!--              class="v-toolbar-header"-->
<!--              height="48"-->
<!--              flat-->
<!--            >-->
<!--              <v-toolbar-title class="grey&#45;&#45;text">{{ $tc('Projects') }}</v-toolbar-title>-->
<!--              <v-spacer></v-spacer>-->
<!--              <v-btn-->
<!--                color="primary"-->
<!--                :disabled="dataTableProjects.processLoading"-->
<!--                icon-->
<!--                @click="onButtonRefreshClick"-->
<!--              >-->
<!--                <v-icon>mdi-refresh</v-icon>-->
<!--              </v-btn>-->
<!--              <v-btn-->
<!--                color="primary"-->
<!--                :to="{ name: 'administrator_projects_new' }"-->
<!--                v-bind="buttonAdd"-->
<!--                icon-->
<!--              >-->
<!--                <v-icon>mdi-plus</v-icon>-->
<!--              </v-btn>-->
<!--            </v-toolbar>-->
<!--            <v-data-table-->
<!--              :headers="dataTableProjects.headers"-->
<!--              :items="dataTableProjects.items"-->
<!--              :server-items-length="dataTableProjects.totalCount"-->
<!--              :page.sync="dataTableProjects.page"-->
<!--              :items-per-page="dataTableProjects.itemsPerPage"-->
<!--              :loading="dataTableProjects.processLoading"-->
<!--              item-key="id"-->
<!--              item-class="v-datatable-item"-->
<!--              :height="dataTableProjectsHeight"-->
<!--              @pagination="onPaginationChange"-->
<!--              :loading-text="$tc('Loading content...')"-->
<!--              :no-data-text="$tc('No data available')"-->
<!--              disable-sort-->
<!--              fixed-header-->
<!--              calculate-widths-->
<!--              hide-default-footer-->
<!--              dense-->
<!--            >-->
<!--              <template slot="header.name" slot-scope="{ header }">-->
<!--                <span class="text-no-wrap">{{ $tc(header.text) }}</span>-->
<!--              </template>-->
<!--              <template slot="item" slot-scope="{ item }">-->
<!--                <tr class="v-datatable-item">-->
<!--                  <td class="text-no-wrap">{{ item.name }}</td>-->
<!--                  <td class="text-no-wrap text-right">-->
<!--                    <v-btn-->
<!--                      icon-->
<!--                      small-->
<!--                      :to="{ name: 'administrator_projects_edit', params: { project_id: item.id } }"-->
<!--                    >-->
<!--                      <v-icon>mdi-pencil-box-outline</v-icon>-->
<!--                    </v-btn>-->
<!--                  </td>-->
<!--                </tr>-->
<!--              </template>-->
<!--            </v-data-table>-->
<!--          </v-card-text>-->
<!--          <v-footer class="d-flex justify-md-space-between pa-4 mt-auto" color="white">-->
<!--            <v-pagination-->
<!--              v-model="dataTableProjects.page"-->
<!--              :length="dataTableProjects.pages"-->
<!--              total-visible="5"-->
<!--              :disabled="dataTableProjects.pages === 0"-->
<!--            ></v-pagination>-->
<!--            <div class="d-flex align-center justify-center">-->
<!--              {{ this.dataTableProjects.pageStart }}-{{ this.dataTableProjects.pageStop }} из {{ this.dataTableProjects.totalCount }}-->
<!--            </div>-->
<!--          </v-footer>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--      <v-col-->
<!--        class="py-0 pl-md-0 pl-lg-0 pl-xl-0"-->
<!--        cols="12"-->
<!--        md="3"-->
<!--        lg="3"-->
<!--      >-->
<!--        <v-card-->
<!--          class="fill-height"-->
<!--          flat-->
<!--          tile-->
<!--          outlined-->
<!--        >-->
<!--          <v-toolbar flat>-->
<!--            <v-toolbar-title class="grey&#45;&#45;text">{{ $tc('Filter') }}</v-toolbar-title>-->
<!--            <v-spacer></v-spacer>-->
<!--          </v-toolbar>-->
<!--          <v-card-text>-->
<!--            ****-->
<!--          </v-card-text>-->
<!--        </v-card>-->
<!--      </v-col>-->
<!--    </v-row>-->
  </v-sheet>
</template>

<script lang="ts">
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppNumberFormat from '@/components/AppNumberFormat/AppNumberFormat.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import Vue, { VueConstructor } from 'vue'
import Projects, { ProjectInterface } from '@/api/Projects'
import { OrganizationInterface } from '@/api/Organizations'
import VInterface from '@/VInterface'
import VDTPaginationEvent from '@/interface/VDTPaginationEvent'

export default (Vue as VueConstructor<VInterface>).extend({
  components: { AppNumberFormat, AppCountUp, AppPagination, AppTools },
  computed: {
    // Вычисляю высоту таблицы
    dataTableProjectsHeight () {
      let h: number = this.$screenHeight - 250
      if (h < 640) { h = 640 }
      return h
    }
  },

  data () {
    return {
      buttonAdd: {
        disabled: false
      },
      projectHoverId: 0,
      dataTableProjects: {
        headers: [
          { align: 'start', sortable: true, text: 'Project name', value: 'name', width: 'auto' },
          { align: 'end', sortable: true, text: '', value: 'actions', width: '100%' }
        ],
        items: [] as ProjectInterface[],
        itemsPerPage: 30,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        totalCount: 0 as unknown as number
      },
      filter: {
        organization: null
      }
    }
  },

  methods: {
    fetchProjects () {
      this.dataTableProjects.processLoading = true
      const offset = (this.dataTableProjects.itemsPerPage * this.dataTableProjects.page) - this.dataTableProjects.itemsPerPage

      const params: any = {
        count: this.dataTableProjects.itemsPerPage,
        offset
      }

      new Projects()
        .find<{ count: number }, ProjectInterface[]>(params)
        .then((response) => {
          this.dataTableProjects.totalCount = response.meta.count
          this.dataTableProjects.pages = Math.ceil(+response.meta.count / this.dataTableProjects.itemsPerPage)
          this.dataTableProjects.items = response.data
        }).finally(() => {
          this.dataTableProjects.processLoading = false
        })
    },

    onButtonRefreshClick () {
      this.fetchProjects()
    },

    onPaginationChange (data: VDTPaginationEvent) {
      this.dataTableProjects.pageStart = data.pageStart + 1
      this.dataTableProjects.pageStop = data.pageStop
    }
  },

  mounted () {
    this.fetchProjects()
  },

  watch: {
    'dataTableProjects.page': {
      handler (page: number) {
        if (page) {
          this.$routerQuery.setQuery({
            page
          }).then(this.fetchProjects)
        }
      }
    },

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
