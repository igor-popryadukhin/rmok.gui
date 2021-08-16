<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3>{{ $tc('Changing the parameters of a role') }}</h3>
      </template>
      <template #right>
        <v-btn
          :loading="processSaveData"
          color="primary"
          small
          tile
          text
          @click="onBtnSaveClick"
        >
          {{ $tc('Save') }}
        </v-btn>
      </template>
    </app-tools>
    <v-divider />

    <v-row class="my-2">
      <!-- Проекты -->
      <v-col
        class="py-0"
        cols="12"
        md="3"
      >
        <div>
          <template v-if="processLoadingData">
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                <app-loading />
              </div>
            </div>
          </template>
          <template v-else-if="permissions.length > 0">
            <v-list
              class="py-0"
              style="min-height: 450px; max-height: calc(100vh - 185px); overflow-y: auto"
            >
              <v-list-item-group
                v-model="permissionKey"
                mandatory
              >
                <template v-for="(item, key) in permissions">
                  <v-list-item
                    :key="'v-list-item-' + key"
                    :value="key"
                    :input-value="key"
                    link
                    dense
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.title }}
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

      <!-- Разрешения -->
      <v-col class="py-0">
        <div>
          <template v-if="processLoadingData">
            <div class="d-flex justify-center">
              <div class="pa-16 grey--text">
                <app-loading />
              </div>
            </div>
          </template>
          <template v-else-if="permissionKey > -1">
            <v-list
              class="py-0"
              dense
            >
              <v-list-item
                class="primary accent-4 none-user-select"
                dark
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ $tc('Action') }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action
                  style="margin: 0"
                  class="d-flex d-inline-flex"
                >
                  {{ $tc('Permission') }}
                </v-list-item-action>
              </v-list-item>
              <v-list-item-group style="min-height: 450px; max-height: calc(100vh - 185px); overflow-y: auto">
                <template v-for="(item, key) in permissions[permissionKey].attributes">
                  <v-list-item
                    :key="'v-list-item-' + key"
                    :value="item.id"
                  >
                    <v-list-item-content>
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item.name }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action
                      style="margin: 0"
                      class="d-flex d-inline-flex"
                    >
                      <v-switch
                        v-model="item.granted"
                        :ripple="false"
                        hide-details
                        dense
                      />
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
      <!-- Разрешения -->
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError'
import { PermissionGroupInterface, PermissionInterface } from '@/api/Permissions'
import Roles from '@/api/Roles'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import rules from '@/mixins/rules'
import VInterface from '@/VInterface'
import Vue, { VueConstructor } from 'vue'

interface Refs {
  [key: string]: any;
}

interface Data {
  name: string;
  permissions: any[];
  [key: string]: any
}

interface VInnerInterface extends VInterface {
  $data: Data;
  $refs: Refs;
}

export default (Vue as VueConstructor<VInnerInterface>).extend({
  components: { AppLoading },
  mixins: [rules],

  beforeRouteLeave (to, from, next) {
    if (this.dataChanged) {
      const answer = window.confirm(this.$tc('Do you want to leave? You have unsaved changes!'))
      if (answer) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  },

  data (): Data {
    return {
      processSaveData: false,
      processLoadingData: false,
      name: '',
      permissions: [],
      permissionKey: -1,
      attributes: []
    }
  },

  computed: {
    roleId (): number {
      return +this.$route.params.role_id
    }
  },

  mounted () {
    this.processLoadingData = true
    new Roles()
      .getById(this.roleId)
      .then((response) => {
        this.$data.name = response.name
        this.$data.permissions = response.permissions
      }).finally(() => (this.processLoadingData = false))
  },

  methods: {

    onBtnDeleteClick () {
      this.$dialog.confirm({
        actions: {
          false: {
            color: 'black',
            text: this.$tc('No')
          },
          true: {
            color: 'red',
            handler: () => {
              new Roles()
                .delete(+this.$route.params.role_id)
                .then(() => {
                  this.$toast.success(this.$tc('Role successfully deleted'))
                  this.$router.replace({ name: 'roles' })
                }).catch((e: APIError) => {
                  this.$toast.error(e.message)
                }).finally(() => {
                  this.buttonSave.loading = false
                })
            },
            text: this.$tc('Yes')
          }
        },
        text: this.$tc('All information about the role and information associated with it will be deleted permanently.'),
        title: this.$tc('Confirmation request')
      })
    },

    onBtnSaveClick () {
      const request = {
        name: this.name,
        attributes: [] as string[]
      }

      for (let i = 0; i < this.permissions.length; i++) {
        const pg: PermissionGroupInterface = this.permissions[i]
        for (let j = 0; j < pg.attributes.length; j++) {
          const p: PermissionInterface = pg.attributes[j]

          if (p.granted) {
            request.attributes.push(p.name)
          }
        }
      }

      this.processSaveData = true
      new Roles()
        .edit(+this.$route.params.role_id, request)
        .then(() => {
          this.$store.dispatch('profile/load')
          this.$toast.success(this.$tc('Role successfully updated'))
        }).catch((e: APIError) => {
          if (Array.isArray(e.errors)) {
            e.errors.map((e: any) => {
              this.$toast.warning(e.message)
            })
          }
          this.$toast.error(e.message)
        }).finally(() => {
          this.processSaveData = false
        })
    }
  }
})
</script>

<style scoped>

</style>

<i18n>
{
  "ru": {
    "Changing the parameters of a role": "Изменение параметров роли"
  }
}
</i18n>
