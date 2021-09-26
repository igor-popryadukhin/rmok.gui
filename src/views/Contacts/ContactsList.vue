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
        <v-simple-table
          class="table-contact-list"
          dense
        >
          <template #default>
            <thead>
              <tr>
                <th
                  v-if="tableCheckBoxVisible"
                  class="px-0"
                >
                  <v-checkbox
                    v-model="tableSelectedAll"
                    :indeterminate="tableIndeterminateSelected"
                    :ripple="false"
                    dense
                    hide-details
                    @change="onTableCheckBoxChange"
                  />
                </th>
                <th class="text-left">
                  {{ $tc('Name') }}
                </th>
                <th
                  v-if="tableColumnOwnerVisible"
                  class="text-left"
                >
                  {{ $tc('Responsible') }}
                </th>
                <th class="text-left">
                  {{ $tc('Result') }}
                </th>
                <th
                  v-if="tableColumnProjectVisible"
                  class="text-left"
                >
                  {{ $tc('Project') }}
                </th>
                <th class="text-left">
                  {{ $tc('Date/Time') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in contactsItems"
                :key="'tr-' + item.id"
              >
                <td
                  v-if="tableCheckBoxVisible"
                  class="px-0"
                  style="width: 25px"
                >
                  <v-checkbox
                    v-model="contactsSelected"
                    class="ma-0"
                    :value="item.id"
                    :ripple="false"
                    multiple
                    dense
                    hide-details
                    @change="onTableItemCheckBoxChange"
                  />
                </td>

                <!-- Имя контакта -->
                <td>
                  <router-link :to="{ name: 'contacts_view', params: { contact_id: item.id } }">
                    {{ item.name }}
                  </router-link>
                </td>
                <!-- Имя контакта -->

                <!-- Владелец -->
                <td
                  v-if="item.owner && tableColumnOwnerVisible"
                >
                  {{ item.owner.full_name }}
                </td>
                <!-- Владелец -->

                <!-- Статус/Результат -->
                <td>
                  <template v-if="item.last_status">
                    <v-chip
                      :color="item.last_status.color"
                      x-small
                      label
                      outlined
                      @click.stop="$emit('click:item:status', item.last_status.id)"
                    >
                      {{ item.last_status.name }}
                    </v-chip>
                  </template>
                  <template v-else>
                    —
                  </template>
                </td>
                <!-- Статус/Результат -->

                <!-- Проект -->
                <td
                  v-if="tableColumnProjectVisible"
                  class="py-0"
                >
                  <template v-if="item.project">
                    {{ item.project.name }}
                  </template>
                  <template v-else>
                    —
                  </template>
                </td>
                <!-- Проект -->

                <td>
                  <template v-if="item.last_call_at">
                    {{ $dayjs(item.last_call_at * 1000).format(`${date_time_format.short_date} ${date_time_format.short_time}`) }}
                  </template>
                  <template v-else>
                    —
                  </template>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </template>
    </div>
  </v-sheet>
</template>

<script lang="ts">

import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { mapGetters } from 'vuex'
import Contact from '@/api/interfaces/Contact'

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
      tableSelectedAll: false,
      timerId: 0,
      dialogContactInfoX: 0,
      dialogContactInfoY: 0,
      dialogContactInfoShowing: false
    }
  },

  computed: {
    ...mapGetters({
      contactsTotal: 'contacts/total',
      contactsSelectedAll: 'contacts/selected_all',
      contactsProcessLoading: 'contacts/process_loading',
      contactsItems: 'contacts/items',
      contactsItemsParamsFilterStatusIds: 'contacts/params/filter_status_ids'
    }),

    // Массив идентификаторов контактов.
    contactsSelected: {
      get () {
        return this.$store.getters['contacts/selected']
      },
      set (val: number[]) {
        this.$store.commit('contacts/selected', val)
      }
    },

    /**
     * Состояние неопределённости выделенных элементов таблицы.
     * Это когда выбраны не все элементы таблицы.
     */
    tableIndeterminateSelected () {
      if (this.contactsSelected.length === 0) {
        return false
      }

      let indeterminate = false
      this.contactsItems.forEach((e: Contact) => {
        if (!this.contactsSelected.includes(e.id)) {
          indeterminate = true
        }
      })

      return indeterminate
    },

    tableCheckBoxVisible () {
      return this.$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])
    },

    tableColumnProjectVisible () {
      return this.$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])
    },

    tableColumnOwnerVisible () {
      return this.$isGranted(['ROLE_ADMIN', 'ROLE_RCC', 'ROLE_TEAM_LEADER'])
    }
  },

  watch: {
    /**
     * Выбранные элементы
     * @param items идентификаторы выбранных элементов.
     */
    contactsSelected (items: string[]) {
      const itemsA: number[] = this.contactsItems.map((e: Contact) => e.id)
      const itemsB: number[] = items.map((id: string) => +id)

      let found = true

      for (const a of itemsA) {
        if (itemsB.indexOf(a) === -1) {
          found = false
          break
        }
      }

      this.tableSelectedAll = found
    }
  },

  methods: {
    onTableItemCheckBoxChange (ids: number[]) {
      if (this.contactsSelectedAll) {
        this.$store.commit('contacts/selected_all', false)
        this.$store.commit('contacts/selected', ids)
      }
    },

    onTableCheckBoxChange (val: boolean) {
      const selected: number[] = this.contactsSelected.map((e: number) => e)

      if (val) {
        this.contactsItems.forEach((e: Contact) => {
          if (!selected.includes(e.id)) {
            selected.push(e.id)
          }
        })
      } else {
        this.contactsItems.forEach((e: Contact) => {
          const index = selected.indexOf(e.id)
          if (index > -1) {
            selected.splice(index, 1)
          }
        })
      }

      this.contactsSelected = selected
    }
  }
})
</script>

<style lang="scss" scoped>

.table-contact-list {
  thead {
    th:not(:first-child) {
      white-space: nowrap;
      padding: 0 10px 0 10px!important;
    }
  }
  tbody {
    tr {
      white-space: nowrap;
      td:not(:first-child) {
        padding: 0 10px 0 10px!important;
      }

      td:nth-child(2) {
        width: 100%;
      }

      td:last-child {
        width: 100px;
      }
    }

  }
}

</style>
