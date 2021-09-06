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
        <slot name="no-text">
          <div
            class="d-flex align-center justify-center"
            style="min-height: 500px"
          >
            <div class="pa-16 grey--text">
              {{ $tc('Empty') }}
            </div>
          </div>
        </slot>
      </template>
      <template v-else>
        <v-list flat>
          <v-list-item-group
            v-model="contactsSelected"
            active-class=""
            multiple
          >
            <template v-for="item in contactsItems">
              <v-list-item
                :key="'v-list-item-' + item.id"
                :input-value="item.id"
                :value="item.id"
                :ripple="false"
                :title="item.contact_name"
                active-class=""
                dense
                exact
                @mouseenter="onListItemMouseEnter(item.id, $event)"
                @mouseleave="onListItemMouseLeave(item.id)"
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

                  <v-list-item-content>
                    <v-list-item-title>
                      <router-link
                        :to="{ name: 'contacts_view', params: { contact_id: item.id } }"
                      >
                        {{ item.contact_name }}
                      </router-link>
                    </v-list-item-title>
                  </v-list-item-content>

                  <v-spacer />

                  <!-- Владелец -->
                  <v-list-item-content
                    v-if="item.owner && $isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])"
                    class="py-0"
                  >
                    <v-list-item-title>
                      {{ item.owner.full_name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <!-- Владелец -->

                  <!-- Статус/Результат -->
                  <v-list-item-content
                    class="py-0 align-content-end"
                  >
                    <v-list-item-title v-if="item.last_status">
                      <v-chip
                        :color="item.last_status.color"
                        x-small
                        label
                        outlined
                        @click.stop="$emit('click:item:status', item.last_status.id)"
                      >
                        {{ item.last_status.name }}
                      </v-chip>
                    </v-list-item-title>
                    <v-list-item-title v-else>
                      —
                    </v-list-item-title>
                  </v-list-item-content>
                  <!-- Статус/Результат -->

                  <!-- Проект -->
                  <v-list-item-content
                    v-if="$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])"
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
                  <!-- Проект -->

                  <v-list-item-content
                    class="py-0"
                  >
                    <v-list-item-title>
                      <template v-if="item.last_call_at">
                        {{ $dayjs(item.last_call_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                      </template>
                      <template v-else>
                        —
                      </template>
                    </v-list-item-title>
                  </v-list-item-content>

                  <!--                  <v-list-item-action-->
                  <!--                    class="py-0"-->
                  <!--                  >-->
                  <!--                    <v-list-item-action-text>-->
                  <!--                      {{ $moment.unix(item.created_at).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}-->
                  <!--                    </v-list-item-action-text>-->
                  <!--                  </v-list-item-action>-->
                </template>
              </v-list-item>

              <v-divider :key="'v-divider-' + item.id" />
            </template>
          </v-list-item-group>
        </v-list>
      </template>
    </div>

    <v-menu
      v-if="dialogContactInfo"
      v-model="dialogContactInfoShowing"
      :position-x="dialogContactInfoX"
      :position-y="dialogContactInfoY"
      max-width="450"
      absolute
    >
      <v-card
        tile
        flat
      >
        <v-card-text>
          <v-list two-line>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Имя</v-list-item-title>
                <v-list-item-subtitle>{{ dialogContactInfo.contact_name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-if="dialogContactInfo.owner">
              <v-list-item-content>
                <v-list-item-title>Ответственный</v-list-item-title>
                <v-list-item-subtitle>{{ dialogContactInfo.owner.full_name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Дата создания</v-list-item-title>
                <v-list-item-subtitle>{{ $dayjs(dialogContactInfo.created_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-sheet>
</template>

<script lang="ts">

import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { mapGetters } from 'vuex'
import Contact from '@/api/interfaces/Contact'

interface Data {
  dialogContactInfo?: Contact
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
      timerId: 0,
      dialogContactInfoX: 0,
      dialogContactInfoY: 0,
      dialogContactInfoShowing: false,
      dialogContactInfo: null
    }
  },

  computed: {
    ...mapGetters({
      contactsProcessLoading: 'contacts/process_loading',
      contactsItems: 'contacts/items',
      contactsItemsParamsFilterStatusIds: 'contacts/params/filter_status_ids'
    }),

    contactsSelected: {
      get () {
        return this.$store.getters['contacts/selected']
      },
      set (val: number[]) {
        this.$store.commit('contacts/selected', val)
      }
    }
  },

  methods: {
    onListItemMouseEnter (contact_id: number, event: MouseEvent) {
      this.timerId = setTimeout(() => {
        this.dialogContactInfo = this.contactsItems.find((e) => e.id === contact_id)

        this.dialogContactInfoX = event.x
        this.dialogContactInfoY = event.y

        this.dialogContactInfoShowing = true
      }, 2000)
    },

    onListItemMouseLeave (contact_id: number) {
      clearInterval(this.timerId)
      this.dialogContactInfoShowing = false
    }
  }
})
</script>

<style scoped>

</style>
