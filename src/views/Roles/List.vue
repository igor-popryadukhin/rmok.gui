<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Roles') }}
        </h3>
      </template>
      <template #right>
        <v-btn
          color="primary"
          tile
          text
          small
          @click="onBtnAddClick"
        >
          {{ $tc('Add') }}
        </v-btn>
      </template>
    </app-tools>
    <v-divider />

    <div style="min-height: 500px; max-height: 100vh; overflow-y: auto">
      <template v-if="rolesLoadProcess">
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            <app-loading />
          </div>
        </div>
      </template>
      <template v-else-if="roles.length === 0">
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            {{ $tc('Empty') }}
          </div>
        </div>
      </template>
      <template v-else>
        <v-list dense>
          <template v-for="item in roles">
            <v-list-item
              :key="`v-list-item-` + item.id"
              link
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action
                style="margin: 0"
              >
                <div class="d-flex d-inline">
                  <v-btn
                    :to="{ name: 'roles_edit', params: { role_id: item.id } }"
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
import Role from '@/api/interfaces/Role'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue, { VueConstructor } from 'vue'
import VInterface from '@/VInterface'
import Roles from '@/api/Roles'

interface Refs {
  [key: string]: any;
}

interface Data {
  roles: Role[];
  [key: string]: any;
}

interface VInnerInterface extends VInterface {
  $data: Data;
  $refs: Refs;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: { AppLoading },

  data (): Data {
    return {
      rolesLoadProcess: false,
      rolesTotalCount: 0,
      roles: [] as Role[]
    }
  },

  computed: {
    // Вычисляю высоту таблицы
    dataTableUsersHeight () {
      let h: number = this.$screenHeight - 170
      if (h < 640) { h = 640 }
      return h
    }
  },

  created () {
    this.fetchRoles()
  },

  methods: {
    fetchRoles () {
      this.rolesLoadProcess = true
      const offset = 0

      const params: any = {
        count: 50,
        offset
      }

      new Roles()
        .get(params)
        .then((response) => {
          this.roles = response.data || []
        }).finally(() => (this.rolesLoadProcess = false))
    },

    async onBtnAddClick () {
      // Показать диалог создания новой роли
      this.$dialog.prompt({
        title: this.$tc('Creating a new role'),
        text: this.$tc('Name'),
        actions: {
          false: {
            text: this.$tc('Cancel'),
            small: true,
            flat: true
          },
          true: {
            text: this.$tc('Create'),
            small: true,
            flat: true
          }
        }
      }).then((value?: string) => {
        if (value) {
          new Roles()
            .create({
              name: value
            }).then((id: number) => {
              this.$router.push({
                name: 'projects_edit',
                params: {
                  role_id: String(id)
                }
              })
            })
        }
      })
    },

    onButtonRefreshClick () {
      this.fetchRoles()
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
