<template>
  <div>
    <v-row class="ma-0">
      <v-toolbar
        flat
        class="pl-3"
      >
        <v-spacer />
        <v-tooltip bottom max-width="400">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              icon
              :to="{ name: 'administrator_organizations_new' }"
              v-on="on"
              v-bind="attrs"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>{{ $tc('create_organization') }}</span>
        </v-tooltip>
      </v-toolbar>
    </v-row>
    <v-row class="ma-0">
      <v-col
        cols="12"
      >
        <template v-if="organizations.length > 0">
          <v-list>
            <template
              v-for="item in organizations"
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
                  <v-list-item-subtitle>
                    {{ item.sphere_activity }}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-spacer />
                <v-list-item-group>
                  <v-list-item-subtitle v-if="item.responsible">
                    {{ item.responsible.first_name }} {{ item.responsible.last_name }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    {{ $tc('feckless') }}
                  </v-list-item-subtitle>
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
                        :to="{ name: 'administrator_organizations_edit', params: { id: item.id } }"
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
          </v-list>
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
                {{ $tc('organizations_list_empty') }}
              </span>
            <v-spacer />
          </v-list-item>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { OrganizationInterface, Organizations } from '@/api/Organizations'

export default Vue.extend({
  data () {
    return {
      organizationsCount: 0,
      organizations: [] as OrganizationInterface[],
      organizationsProcessLoading: false
    }
  },

  created () {
    this.organizationsProcessLoading = true
    new Organizations()
      .find()
      .then(({ count, items }) => {
        this.organizationsCount = count
        this.organizations = items
      }).finally(() => {
        this.organizationsProcessLoading = false
      })
  },

  methods: {
    onDeleteItem (id: number) {
      this.$dialog.confirm({
        text: this.$tc('organization_delete_selected_confirm'),
        title: this.$tc('confirmation_request'),
        actions: {
          false: this.$tc('no'),
          true: {
            color: 'red',
            text: this.$tc('yes'),
            handle: () => {
              return new Promise((resolve) => {
                new Organizations()
                  .delete(id)
                  .then(() => {
                    this.organizations = this.organizations.filter((e: OrganizationInterface) => e.id !== id)
                    this.$toast.success(this.$t('organization_delete_successfully'), { icon: true })
                  }).catch((e) => {
                    const cause: string = e.data ? e.data.error_message : e.error_message || e.statusText || 'undefined'
                    this.$toast.error(this.$t('organization_delete_error', { cause }), { icon: true })
                  }).finally()

                resolve()
                this.checkboxSelectedAll.checked = false
                this.checkboxSelectedAll.indeterminate = false
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
