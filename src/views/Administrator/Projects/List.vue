<template>
  <div>
    <v-row class="ma-0">
      <v-toolbar
        flat
        class="pl-3"
      >
        <v-spacer />
        <!-- Add new project -->
        <v-tooltip bottom max-width="400">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              :to="{ name: 'administrator_projects_new' }"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('add_new_project') }}</span>
        </v-tooltip>
      </v-toolbar>
    </v-row>
    <v-row class="ma-0">
      <v-col
        cols="12"
      >
        <v-list>
          <template v-if="projects.length > 0">
            <template v-for="item in projects">
              <v-divider
                :key="`project-item-divider-${item.id}`"
              ></v-divider>
              <v-list-item
                :key="`project-item-${item.id}`"
                link
                ripple
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle v-if="item.owner">{{ item.owner.first_name }} {{ item.owner.last_name }}</v-list-item-subtitle>
                </v-list-item-content>
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
          <template v-else-if="projectsProcessLoading">
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('Loading content...') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
          <template v-else>
            <v-list-item class="text-center">
              <v-spacer />
              <span class="grey--text">
                {{ $tc('empty') }}
              </span>
              <v-spacer />
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProjectInterface, ProjectResponseItemsInterface, Projects } from '@/api/Projects'

export default Vue.extend({
  data () {
    return {
      projectsProcessLoading: false,
      projects: [] as ProjectInterface[]
    }
  },

  created () {
    this.projectsProcessLoading = true
    new Projects()
      .find()
      .then((response: ProjectResponseItemsInterface) => {
        this.projects = response.items
      }).finally(() => {
        this.projectsProcessLoading = false
      })
  }
})
</script>

<style lang="scss" scoped>

</style>
