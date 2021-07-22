<template>
  <v-sheet>
    <v-row class="my-2">
      <!-- Проекты -->
      <v-col
        cols="12"
        md="3"
      >
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('Projects') }}
            </h3>
          </template>
        </app-tools>

        <v-divider />
        <div style="min-height: 500px; max-height: 100vh; overflow-y: auto">
          <template v-if="projectsLoading">
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                <app-loading />
              </div>
            </div>
          </template>
          <template v-else-if="projectsTotal > 0">
            <v-list>
              <v-list-item-group
                v-model="projectSelectedId"
                :value="projectSelectedId"
                mandatory
              >
                <template v-for="(item, key) in projects">
                  <v-list-item
                    :key="'v-list-item-' + key"
                    :value="item.id"
                    link
                    dense
                    @mouseenter="projectHoverId = item.id | 0"
                    @mouseleave="projectHoverId = 0"
                    @click.stop="onProjectListItemClick(item.id, $event)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider :key="'v-divider-' + key" />
                </template>
              </v-list-item-group>
            </v-list>
          </template>
          <template v-else>
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                {{ $tc('Empty') }}
              </div>
            </div>
          </template>
        </div>
      </v-col>
      <!-- Проекты -->

      <v-divider vertical />

      <!-- Участники проекта -->
      <v-col>
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('Project members') }}
            </h3>
          </template>
        </app-tools>

        <v-divider />

        <div class="py-2">
          <app-search-input
            v-model="integrationSearch"
            :label="$tc('Search for project participants')"
            @change="onSearchChange"
          />
        </div>

        <div style="min-height: 500px; max-height: 100vh; overflow-y: auto">
          <template v-if="integrationsLoading">
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                <app-loading />
              </div>
            </div>
          </template>
          <template v-else-if="integrationsTotal > 0">
            <v-list>
              <v-list-item-group
                v-model="integrationId"
                mandatory
              >
                <template v-for="(item, key) in integrations">
                  <v-list-item
                    :key="'v-list-item-' + key"
                    :value="item.id"
                    :disabled="item.user_is_deleted"
                    link
                    @mouseenter="integrationHoverId = item.id | 0"
                    @mouseleave="integrationHoverId = 0"
                    @mouseup="integrationId = item.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title
                        v-if="item.user_is_deleted"
                        style="text-decoration: line-through"
                      >
                        {{ item.user_name }}
                      </v-list-item-title>
                      <v-list-item-title v-else>
                        {{ item.user_name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.project_name }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action
                      style="margin: 0"
                      class="d-flex d-inline-flex"
                    >
                      <v-tooltip>
                        <template #activator="{ attrs, on}">
                          <v-switch
                            v-model="item.is_active"
                            v-bind="attrs"
                            :loading="switchChangeProcess && item.id === integrationHoverId"
                            dense
                            v-on="on"
                            @change="onSwitchChange(item.id, item.is_active)"
                          />
                        </template>
                        <span>
                          {{ $tc('Активность') }}
                        </span>
                      </v-tooltip>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="'v-divider-' + key" />
                </template>
              </v-list-item-group>
            </v-list>
          </template>
          <template v-else>
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                {{ $tc('Empty') }}
              </div>
            </div>
          </template>
        </div>
      </v-col>
      <!-- Участники проекта -->

      <v-divider vertical />

      <!-- Параметры -->
      <v-col
        cols="12"
        md="3"
      >
        <app-tools>
          <template #left>
            <h3 class="grey--text">
              {{ $tc('Parameters') }}
            </h3>
          </template>
        </app-tools>

        <v-divider />

        <div>
          <template v-if="integrationParams.length === 0">
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                {{ $tc('Data not available') }}
              </div>
            </div>
          </template>
          <template v-else>
            <v-list>
              <template v-for="(item, key) in integrationParams">
                <v-list-item
                  :key="'v-list-item-' + key"
                >
                  <v-list-item-content>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ item.value }}</v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action v-if="item.button">
                    <v-btn
                      v-bind="item.button.attrs"
                      text
                      tile
                      small
                      v-on="item.button.on"
                      v-text="item.button.text"
                    />
                  </v-list-item-action>

                  <v-list-item-action v-if="item.input">
                    <v-text-field
                      v-bind="item.input.attrs"
                      dense
                      hide-details
                      v-on="item.input.on"
                    />
                  </v-list-item-action>
                </v-list-item>

                <v-divider :key="'v-divider-' + key" />
              </template>
            </v-list>
          </template>
        </div>
      </v-col>
      <!-- Параметры -->
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import ContactsIntegrations from '@/api/ContactsIntegrations'
import Projects from '@/api/Projects'
import { UserInterface } from '@/api/Users'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppSearchInput from '@/components/AppSearchInput/AppSearchInput.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import Vue from 'vue'

export default Vue.extend({
  components: { AppSearchInput, AppLoading, AppTools },

  data () {
    return {
      switchChangeProcess: false,
      integrationId: -1,
      integrationHoverId: 0,
      integrationsLoading: false,
      integrationsTotal: 0,
      integrations: [] as any[],
      // Проекты
      projectHoverId: 0,
      projectsTotal: 0,
      projectsLoading: false,
      projects: [] as any[],

      userForJoin: null
    }
  },

  computed: {
    // Выбранный проект
    projectSelectedId: {
      set (val: number) {
        this.$routerQuery.setQuery({ project_id: val })
      },

      get () {
        return +this.$route.query?.project_id || -1
      }
    },

    integrationSearch: {
      set (val?: string) {
        if (typeof val === 'string') {
          this.$routerQuery.setQuery({ q: val })
        } else {
          this.$routerQuery.removeQuery(['q'])
        }
      },

      get () {
        return this.$route.query?.q || null
      }
    },

    integrationParams () {
      const params = []

      const integration = this.integrations.find(e => e.id === this.integrationId)

      if (this.assertObjectHasAttribute(integration, 'project_name')) {
        params.push({
          title: this.$tc('Project'),
          value: integration.project_name
        })
      }

      if (this.assertObjectHasAttribute(integration, 'user_name')) {
        params.push({
          title: this.$tc('Participant'),
          value: integration.user_name
        })
      }

      if (this.assertObjectHasAttribute(integration, 'limit')) {
        params.push({
          title: this.$tc('Limit'),
          value: integration.limit,
          input: {
            attrs: {
              type: 'number',
              value: integration.limit,
              style: {
                width: '100px'
              }
            },
            on: {
              change: (val: number) => {
                integration.limit = +val
                new ContactsIntegrations()
                  .edit(integration.id, {
                    limit: val
                  }).then(() => {
                    this.$toast.success(this.$tc('Changes accepted'))
                  })
              }
            }
          }
        })
      }

      if (this.assertObjectHasAttribute(integration, 'is_active')) {
        params.push({
          title: this.$tc('Status'),
          value: integration.is_active ? this.$tc('Active') : this.$tc('Not active')
        })
      }

      return params
    },

    paramsForUsers () {
      return {
        project_id: this.projectSelectedId
      }
    },
    count () {
      return this.$data.integrations?.length || 0
    }
  },

  watch: {
    //
    userForJoin (val?: UserInterface) {
      if (val?.id) {
        new ContactsIntegrations()
          .add(this.projectSelectedId, val?.id)
          .then(() => {
            this.$toast.success(this.$tc('Changes accepted'))
            this.fetchIntegrations(this.projectSelectedId)
          })
          .catch((e: APIError) => {
            switch (e.error_code) {
              case 'integration_already_exists': {
                this.$toast.warning(e.message)
                break
              }
              default: {
                this.$toast.error(e.message)
              }
            }
          }).finally(() => {
            this.$data.switchChangeProcess = false
          })

        // Очищаю предыдущий выбор
        setTimeout(() => {
          this.$data.userForJoin = null
        }, 300)
      }
    }
  },

  async mounted () {
    // Сначала загружаю проекты
    await this.fetchProjects()
    if (this.projectSelectedId > -1) {
      this.fetchIntegrations(this.projectSelectedId)
    }
  },

  methods: {
    /**
     * Загрузить с сервера доступные проекты
     */
    fetchProjects () {
      this.$data.projectsLoading = true
      return new Projects()
        .find()
        .then((response) => {
          this.$data.projectsTotal = response?.meta?.count || 0
          this.$data.projects = response.data
        }).finally(() => (this.$data.projectsLoading = false))
    },

    /**
     * Загрузить с сервера параметры интеграций
     */
    fetchIntegrations (project_id: number, params = {}) {
      this.$data.integrationsLoading = true
      new ContactsIntegrations()
        .find(Object.assign(params, { project_id }))
        .then((response) => {
          this.$data.integrationsTotal = response.meta?.count || 0
          this.$data.integrations = response.data
        }).finally(() => {
          this.$data.integrationsLoading = false
        })
    },

    /**
     * Событие, которое генерируется при вводе текста в строку поиска участников проекта.
     */
    onSearchChange (q?: string) {
      if (typeof q === 'string') {
        this.fetchIntegrations(this.projectSelectedId, { q })
      } else {
        this.fetchIntegrations(this.projectSelectedId)
      }
    },

    /**
     * Событие, которое генерируется при нажатии на элемент списка проектов.
     *
     * @param id
     * @param event
     */
    onProjectListItemClick (id: number, event: Event) {
      this.integrationSearch = ''
      this.fetchIntegrations(id)
    },

    /**
     * Событие, которое генерируется при изменении состояния активности интеграции.
     *
     * @param id
     * @param state
     */
    onSwitchChange (id: number, state: boolean) {
      this.$data.switchChangeProcess = true
      new ContactsIntegrations()
        .setActive(id, state)
        .then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        })
        .catch((e: Error) => {
          this.$toast.error(e.message)
        }).finally(() => {
          this.$data.switchChangeProcess = false
        })
    }
  }
})
</script>

<style scoped>

</style>
