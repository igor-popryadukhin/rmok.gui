<template>
  <div>
    <v-card
      flat
    >
      <v-card-text class="pa-0">
        <v-toolbar
          flat
          class="pl-3"
        >
          <v-spacer />
          <!-- Add new user -->
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :to="{ name: 'administrator_users_new' }"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('add_new_user') }}</span>
          </v-tooltip>
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('delete_selected_contacts') }}</span>
          </v-tooltip>
        </v-toolbar>
      </v-card-text>
      <v-row class="ma-0">
        <v-col
          cols="12"
        >
          <template v-if="users.length > 0">
            <template
              v-for="item in users"
            >
              <v-divider
                :key="`divider-${item.id}`"
              />
              <v-list-item
                :key="`list-item-${item.id}`"
                ripple
                selectable
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.first_name }} {{ item.last_name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.role">
                    {{ item.role.name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    Без роли
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-group v-if="item.project">
                  <v-list-item-title>
                    {{ item.project.name }}
                  </v-list-item-title>
                </v-list-item-group>
                <v-list-item-action>
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon
                        large
                        v-bind="attrs"
                        v-on.stop="on"
                      >
                        <v-icon>mdi-dots-horizontal</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        :to="{ name: 'administrator_users_edit', params: { id: item.id } }"
                        link
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-square-edit-outline</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Редактировать</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        link
                      >
                        <v-list-item-icon>
                          <v-icon>mdi-delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Удалить</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </template>
          </template>
          <template v-else-if="organizationsProcessLoading">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('loading_data') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('users_list_empty') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Users } from '@/api/Users'

export default Vue.extend({
  data () {
    return {
      users: [],
      organizationsProcessLoading: false
    }
  },

  created () {
    this.organizationsProcessLoading = true
    new Users()
      .find()
      .then((users: any) => {
        this.users = users.items
      }).finally(() => {
        this.organizationsProcessLoading = false
      })
  }
})
</script>

<style scoped>

</style>
