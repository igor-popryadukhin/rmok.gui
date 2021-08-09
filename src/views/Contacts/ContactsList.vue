<template>
  <v-sheet>
    <div>
      <slot name="head" />
      <v-divider />
    </div>
    <div>
      <template v-if="contactsProcessLoading">
        <div
          class="d-flex align-center justify-center"
          style="height: 500px"
        >
          <div class="pa-16 grey--text">
            <app-loading />
          </div>
        </div>
      </template>
      <template v-else-if="contactsItems.length === 0">
        <div
          class="d-flex align-center justify-center"
          style="min-height: 500px"
        >
          <div class="pa-16 grey--text">
            {{ $tc('Empty') }}
          </div>
        </div>
      </template>
      <template v-else>
        <v-list>
          <v-list-item-group
            v-model="contactsSelected"
            multiple
          >
            <template v-for="item in contactsItems">
              <v-list-item
                :key="'v-list-item-' + item.id"
                :input-value="item.id"
                :value="item.id"
                :ripple="false"
                dense
              >
                <template #default="{ active }">
                  <v-list-item-action class="my-0 mr-1">
                    <v-checkbox
                      :input-value="active"
                      :ripple="false"
                      color="primary"
                      dense
                      hide-details
                    />
                  </v-list-item-action>

                  <v-list-item-content class="py-0">
                    <v-list-item-title>
                      <router-link :to="{ name: 'contacts_view', params: { contact_id: item.id } }">
                        {{ item.contact_name }}
                      </router-link>
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-spacer />

                  <v-list-item-content
                    v-if="item.owner && $isGranted('contact.view_outside_project')"
                    class="py-0"
                  >
                    <v-list-item-title>
                      {{ item.owner.full_name }}
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content
                    class="py-0 align-content-end"
                  >
                    <v-list-item-title v-if="item.last_status">
                      <v-chip
                        :color="item.last_status.color"
                        x-small
                        label
                        outlined
                      >
                        {{ item.last_status.name }}
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-title v-else>
                      —
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content
                    v-if="$isGranted('contact.view_outside_project')"
                    class="py-0"
                  >
                    <v-list-item-title>
                      <template v-if="item.project">
                        {{ item.project.name }}
                      </template>
                      <template v-else>
                        —
                      </template>
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-list-item-content
                    class="py-0"
                  >
                    <v-list-item-title>
                      <template v-if="item.last_call_at">
                        {{ $moment.unix(item.last_call_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                      </template>
                      <template v-else>
                        —
                      </template>
                    </v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>

              <v-divider :key="'v-divider-' + item.id" />
            </template>
          </v-list-item-group>
        </v-list>
      </template>
    </div>
  </v-sheet>
</template>

<script lang="ts">

import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { mapGetters } from 'vuex'

interface Data {
  [keys: string]: any;
}

interface Methods {
  [keys: string]: any;
}

interface Computed {
  [keys: string]: any;
}

interface Props {
  [keys: string]: any;
}

export default Vue.extend<Data, Methods, Computed, Props>({
  name: 'ContactsList',
  components: { AppLoading },
  props: {
    height: {
      type: Number,
      required: false,
      default: () => 400
    }
  },

  data (): Data {
    return {
    }
  },

  computed: {
    ...mapGetters({
      contactsProcessLoading: 'contacts/process_loading',
      contactsItems: 'contacts/items'
    }),

    contactsSelected: {
      get () {
        return this.$store.getters['contacts/selected']
      },
      set (val: number[]) {
        this.$store.commit('contacts/selected', val)
      }
    },

    listItemsHeight () {
      return {
        height: `${this.height}px`
      }
    }
  }
})
</script>

<style scoped>

</style>
