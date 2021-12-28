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
      <template v-else-if="roleItems.length === 0">
        <div class="d-flex justify-center">
          <div class="pa-16 grey--text">
            {{ $tc('No data') }}
          </div>
        </div>
      </template>
      <template v-else>
        <v-list dense>
          <template v-for="item in roleItems">
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
                    :to="{ name: 'roles_edit', params: { id: item.id } }"
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
import Roles from '@/api/Roles'
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

@Component({
  components: { AppLoading }
})
export default class Index extends AppBase {
  rolesLoadProcess = true;

  get dataTableUsersHeight () {
    let h: number = this.screenHeight - 170
    if (h < 640) {
      h = 640
    }
    return h
  }

  get roleItems () {
    return this.$store.getters['roles/items']
  }

  mounted () {
    this.$store.dispatch('roles/fetch')
      .finally(() => (this.rolesLoadProcess = false))
  }

  async onBtnAddClick () {
    // Показать диалог создания новой роли
    this.$dialog.prompt({
      title: this.$tc('Creating a new role'),
      text: this.$tc('Name'),
      actions: {
        false: this.$tc('Cancel'),
        true: this.$tc('Cancel')
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
  }
}
</script>

<style>

.v-toolbar-header div {
  padding: 0 !important;
}

.v-toolbar-header div:last-child {
  margin-right: 10px;
}
</style>
