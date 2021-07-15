<template>
  <v-sheet>
    <v-row class="my-1">
      <!-- Проекты -->
      <v-col
        cols="12"
      >
        <app-tools>
          <template v-slot:left>
            <h3 class="grey--text">
              {{ $tc('Integration settings') }}
            </h3>
          </template>
          <template v-slot:right>
            <v-btn
              :color="$vuetify.theme.currentTheme.primary"
              :to="{ name: 'administrator_itegrationset_new' }"
              text
              tile
              small
            >
              {{ $tc('Add') }}
            </v-btn>
          </template>
        </app-tools>

        <v-divider/>
        <div style="min-height: 500px; max-height: 100vh; overflow-y: auto">
          <template v-if="dataTableGroups.processLoading">
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                <app-loading />
              </div>
            </div>
          </template>
          <template v-else-if="dataTableGroups.totalCount > 0">
            <v-list>
              <v-list-item-group>
                <template v-for="(item, key) in dataTableGroups.items">
                  <v-list-item
                    :key="'v-list-item-' + key"
                    :value="item.id"
                    link
                    dense
                    @mouseenter="dataTableGroups.itemHoverId = item.id | 0"
                    @mouseleave="dataTableGroups.itemHoverId = 0"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.name }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action
                      class="d-flex d-inline-flex ma-0 mr-2"
                    >
                      <v-tooltip>
                        <template v-slot:activator="{ attrs, on}">
                          <v-switch
                            v-model="item.active"
                            v-bind="attrs"
                            v-on="on"
                            :loading="switchChangeProcess"
                            dense
                            :ripple="false"
                            @change="onSwitchChange(item.id, item.active)"
                          />
                        </template>
                        <span>
                  {{ $tc('Активность') }}
                </span>
                      </v-tooltip>
                    </v-list-item-action>
                    <v-list-item-action class="ma-0 mr-2">
                      <v-btn
                        :to="{ name: 'administrator_itegrationset_edit', params: { id: item.id } }"
                        small
                        icon
                      >
                        <v-icon>
                          mdi-pencil-box-outline
                        </v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                  <v-divider :key="'v-divider-' + key"/>
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
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppTools from '@/components/AppTools/AppTools.vue'
import Vue, { VueConstructor } from 'vue'
import ResponseInterface from '@/api/Schemas/ResponseInterface'
import VInterface from '@/VInterface'
import ProjectIntegrationSettings, {
  ProfileFindQueryInterface,
  ProfileInterface
} from '@/api/ProjectIntegrationSettings'
import ContactsIntegrations from '@/api/ContactsIntegrations'

export default (Vue as VueConstructor<VInterface>).extend({
  components: { AppLoading, AppTools },
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

  data () {
    return {
      switchChangeProcess: false,
      integrationHoverI: 0,
      buttonAdd: {
        disabled: false
      },
      dataTableGroups: {
        /** Когда над элементом находится курсор itemHoverId = {идентификатор записи} */
        itemHoverId: 0,
        items: [] as unknown[],
        itemsPerPage: 20,
        page: 1,
        pageStart: 0,
        pageStop: 0,
        pages: 1,
        processLoading: false,
        totalCount: 0
      },
      filter: {
        project: null
      },
      groupsProcessLoading: false,
      negativeScreenHeightSize: 220
    }
  },
  methods: {
    fetchGroups () {
      this.dataTableGroups.processLoading = true
      const offset = (this.dataTableGroups.itemsPerPage * this.dataTableGroups.page) - this.dataTableGroups.itemsPerPage

      const params: any = {
        count: this.dataTableGroups.itemsPerPage,
        offset
      }
      new ProjectIntegrationSettings()
        .find<{count: number}, ProfileFindQueryInterface[]>(params)
        .then((response: ResponseInterface<{ count: number }, ProfileInterface[]>) => {
          this.dataTableGroups.totalCount = response.meta.count
          this.dataTableGroups.pages = Math.ceil(response.meta.count / this.dataTableGroups.itemsPerPage)
          this.dataTableGroups.items = response.data
        }).finally(() => {
          this.dataTableGroups.processLoading = false
        })
    },

    onButtonRefreshClick () {
      this.fetchGroups()
    },
    /**
     * Событие, которое генерируется при изменении состояния активности интеграции.
     *
     * @param id
     * @param state
     */
    onSwitchChange (id: number, state: boolean) {
      this.$data.switchChangeProcess = true
      new ProjectIntegrationSettings()
        .setActive(id, state)
        .then(() => {
          this.$toast.success(this.$tc('Changes accepted'))
        })
        .catch((e: Error) => {
          this.$toast.error(e.message)
        }).finally(() => {
          this.$data.switchChangeProcess = false
        })
    },
    onDeleteItem (id: number) {
      this.$dialog.confirm({
        text: this.$tc('confirm_profile_deletion'),
        title: this.$tc('confirmation_request'),
        actions: {
          false: this.$tc('No'),
          true: {
            color: 'red',
            text: this.$tc('Yes'),
            handler: () => {
              new ProjectIntegrationSettings()
                .delete(id)
                .then(() => {
                  this.groups = this.groups.filter((e: ProfileInterface) => e.id !== id)
                  this.$toast.success(this.$t('profile_delete_successfully'), { icon: true })
                })
                .catch((e: APIError) => {
                  this.$toast.error(this.$t('profile_delete_error', { cause: e.message }), { icon: true })
                })
            }
          }
        }
      })
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
