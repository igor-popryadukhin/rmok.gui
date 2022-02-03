<template>
  <v-sheet
    class="roles-page"
    style="background-color: #bebebe"
  >
    <v-sheet
      class="roles-page__tools d-flex align-center"
    >
      <v-btn
        disabled
        tile
        text
        small
        @click="onBtnAddClick"
      >
        {{ $tc('Add') }}
      </v-btn>
    </v-sheet>

    <app-divider />

    <v-sheet class="roles-page__items">
      <div
        v-if="itemsFetching && items.length === 0"
        class="d-flex align-center justify-center fill-height"
      >
        <app-loading />
      </div>

      <div
        v-else-if="items.length === 0"
        class="d-flex justify-center fill-height"
      >
        <div class="pa-16 grey--text">
          {{ $tc('No data') }}
        </div>
      </div>

      <template v-else>
        <v-list dense>
          <template v-for="item in items">
            <v-list-item
              :key="`v-list-item-` + item.id"
              link
            >
              <v-list-item-content>
                <v-list-item-title>
                  {{ item.name }}
                </v-list-item-title>
              </v-list-item-content>

              <v-list-item-action>
                <v-menu
                  min-width="250"
                  offset-y
                >
                  <template #activator="{ on, attrs }">
                    <v-btn
                      icon
                      tile
                      ripple
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item :to="{ name: 'roles_view', params: { id: item.id } }">
                      <v-list-item-title>{{ $tc('Role settings') }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <div class="d-flex d-inline" />
              </v-list-item-action>
            </v-list-item>

            <v-divider :key="`v-divider-` + item.id" />
          </template>
        </v-list>
      </template>
    </v-sheet>
  </v-sheet>
</template>

<script lang="ts">
import Roles from '@/api/Roles'
import AppBase from '@/AppBase'
import Component from 'vue-class-component'
import AppLoading from '@/components/AppLoading/AppLoading.vue'

@Component({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('roles/fetch')
    })
  }
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

  get itemsFetching (): boolean { return this.$store.getters['roles/items_fetching'] }
  get items () { return this.$store.getters['roles/items'] }

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

<style lang="scss" scoped>
.roles-page {
  height: 100%;
}

.roles-page__tools {
  height: 35px;
}

.roles-page__items {
  height: calc(100% - 35px);
  height: -moz-calc(100% - 35px);
  height: -webkit-calc(100% - 35px);

  overflow: auto;
}
</style>
