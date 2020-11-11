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
          <!-- Add new group -->
          <v-tooltip bottom max-width="400">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                icon
                :to="{ name: 'administrator_groups_new' }"
                v-on="on"
                v-bind="attrs"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>{{ $tc('add_group') }}</span>
          </v-tooltip>
        </v-toolbar>
      </v-card-text>
      <v-row class="ma-0">
        <v-col
          cols="12"
        >
          <template v-if="groups.length > 0">
            <template
              v-for="item in groups"
            >
              <v-divider
                :key="`divider-${item.id}`"
              />
              <v-list-item
                :key="`list-item-${item.id}`"
                ripple
                selectable
                link
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ item.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle v-if="item.team_leader">
                    {{ item.team_leader.first_name }} {{ item.team_leader.last_name }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-content>
                  <v-list-item-title v-if="item.organization">
                    {{ item.organization.name }}
                  </v-list-item-title>
                  <v-list-item-title v-else>
                    &mdash;
                  </v-list-item-title>
                </v-list-item-content>
                <!-- list-item-action -->
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
                        :to="{ name: 'administrator_groups_edit', params: { id: item.id } }"
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
                        @click.stop="onDeleteItem(item.id)"
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
          <template v-else-if="groupsProcessLoading">
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
                {{ $tc('groups_list_empty') }}
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
import { GroupInterface, Groups } from '@/api/Groups'

export default Vue.extend({
  data () {
    return {
      groups: [] as GroupInterface[],
      groupsProcessLoading: false
    }
  },

  created () {
    this.groupsProcessLoading = true
    new Groups()
      .find()
      .then((groups: any) => {
        this.groups = groups
      }).finally(() => {
        this.groupsProcessLoading = false
      })
  },

  methods: {
    onDeleteItem (id: number) {
      this.$dialog.confirm({
        text: this.$tc('confirm_group_deletion'),
        title: this.$tc('confirmation_request'),
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            text: this.$tc('yes'),
            handle: () => {
              return new Promise((resolve) => {
                new Groups()
                  .delete(id)
                  .then(() => {
                    this.groups = this.groups.filter((e: GroupInterface) => e.id !== id)
                    this.$toast.success(this.$t('group_delete_successfully'), { icon: true })
                  }).catch((e: any) => {
                    const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                    this.$toast.error(this.$t('group_delete_error', { cause }), { icon: true })
                  }).finally()

                resolve()
              })
            }
          }
        }
      })
    }
  }
})
</script>

<style scoped>

</style>
