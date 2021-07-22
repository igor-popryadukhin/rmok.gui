<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <v-tooltip
          :open-delay="$tooltip.openDelay"
          :color="$tooltip.color"
          right
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              small
              tile
              text
              v-on="on"
              @click="onBtnCreateProject"
            >
              {{ $tc('Create') }}
            </v-btn>
          </template>
          <span>{{ $tc('Create new project') }}</span>
        </v-tooltip>
      </template>
      <template #right>
        <app-pagination
          v-model="projects.page"
          :length="projects.pages"
        >
          <template #display>
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  tile
                  text
                  small
                  v-on="on"
                >
                  <app-count-up
                    :end-val="projects.pageStart"
                  />
                  <span class="mx-1">—</span>
                  <app-count-up
                    :end-val="projects.pageStop"
                  />
                  <span class="mx-1">из</span>
                  <app-number-format
                    :value="projects.totalCount"
                  />
                </v-btn>
              </template>
              <v-list
                v-ripple="false"
                :disabled="projects.pages < 4"
                class="py-0"
                dense
                flat
              >
                <v-list-item
                  link
                  @click="projects.page = 1"
                >
                  <v-list-item-content>
                    <v-list-item-title>Самые новые</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  @click="projects.page = Math.floor(projects.pages/2)"
                >
                  <v-list-item-content>
                    <v-list-item-title>Между новыми и старыми</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  link
                  @click="projects.page = projects.pages - 1"
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
    <v-divider class="mb-2" />

    <div style="min-height: 500px; max-height: 100vh; overflow-y: auto">
      <template v-if="projects.processLoading">
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            <app-loading />
          </div>
        </div>
      </template>
      <template v-else-if="projects.totalCount === 0">
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            {{ $tc('Empty') }}
          </div>
        </div>
      </template>
      <template v-else>
        <v-list dense>
          <template v-for="item in projects.items">
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
                    :to="{ name: 'projects_edit', params: { project_id: item.id } }"
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

            <v-divider :key="`v-divider-` + item.id" />
          </template>
        </v-list>
      </template>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppNumberFormat from '@/components/AppNumberFormat/AppNumberFormat.vue'
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import Vue, { VueConstructor } from 'vue'
import Projects, { ProjectInterface } from '@/api/Projects'
import VInterface from '@/VInterface'
import VDTPaginationEvent from '@/interfaces/VDTPaginationEvent'

export default (Vue as VueConstructor<VInterface>).extend({
  components: { AppLoading, AppNumberFormat, AppCountUp, AppPagination, AppTools },

  data () {
    return {
      buttonAdd: {
        disabled: false
      },
      projectHoverId: 0,
      projects: {
        headers: [
          { align: 'start', sortable: true, text: 'Project name', value: 'name', width: 'auto' },
          { align: 'end', sortable: true, text: '', value: 'actions', width: '100%' }
        ],
        items: [] as unknown[] as ProjectInterface[],
        itemsPerPage: 30,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 0,
        processLoading: false,
        totalCount: 0 as unknown as number
      }
    }
  },

  watch: {
    'projects.page': {
      handler (page: number) {
        if (page) {
          this.$routerQuery.setQuery({
            page
          }).then(this.fetchProjects)
        }
      }
    }
  },

  mounted () {
    this.fetchProjects()
  },

  methods: {
    fetchProjects () {
      this.projects.processLoading = true
      const offset = (this.projects.itemsPerPage * this.projects.page) - this.projects.itemsPerPage

      const params: any = {
        count: this.projects.itemsPerPage,
        offset
      }

      new Projects()
        .find<{ count: number }, ProjectInterface[]>(params)
        .then((response) => {
          this.projects.totalCount = response?.meta?.count || 0
          this.projects.pages = Math.ceil(response?.meta?.count || 0 / this.projects.itemsPerPage)
          this.projects.items = response.data
        }).finally(() => {
          this.projects.processLoading = false
        })
    },

    onBtnCreateProject () {
      this.$dialog.prompt({
        title: this.$tc('Creating a new project'),
        text: this.$tc('Name of the new project'),
        actions: {
          false: {
            text: this.$tc('Cancel')
          },
          true: {
            text: this.$tc('Create')
          }
        }
      }).then((value?: string) => {
        if (value) {
          new Projects()
            .create({
              name: value
            }).then(({ id }) => {
              this.$router.push({
                name: 'projects_edit',
                params: {
                  project_id: id
                }
              })
            })
        }
      })
    },

    onButtonRefreshClick () {
      this.fetchProjects()
    },

    onPaginationChange (data: VDTPaginationEvent) {
      this.projects.pageStart = data.pageStart + 1
      this.projects.pageStop = data.pageStop
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
