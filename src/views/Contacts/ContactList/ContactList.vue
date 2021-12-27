<template>
  <v-sheet class="mx-auto">
    <template v-if="loading">
      <div
        class="d-flex align-center justify-center"
        style="height: 500px"
      >
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="items.length === 0">
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
        v-bind="vSimpleTableAttrs"
        class="table-contact-list"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th
                class="ma-0"
                style="padding: 0 0 0 5px"
              >
                <v-checkbox
                  v-model="itemsSelectedAllInPage"
                  :ripple="false"
                  :indeterminate="itemsSelectedIndeterminate"
                  dense
                  hide-details
                  @click="onTableHeadCheckboxClick"
                />
              </th>
              <th class="text-left">
                {{ $tc('Name') }}
              </th>
              <th
                class="text-left"
              >
                {{ $tc('Responsible') }}
              </th>
              <th class="text-left">
                {{ $tc('Result') }}
              </th>
              <th
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
            <template v-for="(item, key) in items">
              <tr
                :key="key"
              >
                <td
                  class="px-0"
                  style="width: 25px"
                >
                  <v-checkbox
                    v-model="itemsSelected"
                    class="ma-0 pa-0"
                    :value="item.id"
                    :ripple="false"
                    multiple
                    dense
                    hide-details
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
                <td v-if="item.owner">
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
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </template>

    <!-- Информационный Снэк-бар -->
    <v-snackbar
      v-if="itemsSelected.length > 1"
      :timeout="-1"
      :value="true"
      class="mt-12"
      color="primary"
      elevation="10"
      min-width="450"
      top
      centered
      absolute
      tile
      transition="fab-transition"
      style="z-index: 2"
      :style="snackbarStyle"
    >
      <div
        class="d-flex align-center justify-lg-space-between"
        @mouseenter="snackbarStyle = { opacity: 1 }"
        @mouseleave="snackbarStyle = { opacity: 0.6 }"
      >
        <div class="mr-5">
          <span
            style="font-size: 10px; text-transform: uppercase; font-weight: 500; letter-spacing: 0.0892857143em"
          >
            {{ $tc('selected_elements', itemsSelectedCount) }}
          </span>
        </div>
        <div>
          <v-btn
            text
            x-small
            tile
            @click="onBtnSelectAllClick"
          >
            {{ $tc('Select all') }}
          </v-btn>
          <v-btn
            text
            x-small
            tile
            @click="onBtnCancelSelectionClick"
            @mouseup="snackbarStyle = { opacity: 0.8 }"
          >
            {{ $tc('Cancel selection') }}
          </v-btn>
        </div>
      </div>
    </v-snackbar>
    <!-- Информационный Снэк-бар -->
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Base from './Base'
import ContactListFilters from '@/views/Contacts/ContactList/ContactListFilters.vue'
import ContactListTools from '@/views/Contacts/ContactList/ContactListTools.vue'
import AppTable from '@/components/AppTable/AppTable.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { Prop } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<ContactList>({
  components: { AppLoading, AppTable, ContactListTools, ContactListFilters }
})
export default class ContactList extends Base {
  @Prop({ default: 0 }) readonly height: number
  @Prop({ default: false }) readonly overlay: boolean
  @Prop({ default: false }) readonly loading: boolean

  snackbarStyle = { opacity: 0.8 }

  get vSimpleTableAttrs () {
    const attrs: Record<string, any> = {}

    if (this.height) {
      attrs.height = this.height
      attrs['fixed-header'] = true
      attrs.style = {
        'overflow-y': 'auto'
      }
    }

    return attrs
  }

  get items () {
    return this.$store.getters['contacts/list/items']
  }

  /** Выбранные элементы */
  get itemsSelected (): number[] {
    return this.$store.getters['contacts/list/items_selected']
  }

  set itemsSelected (val: number[]) {
    this.$store.commit('contacts/list/items_selected', val)
  }

  get itemsSelectedAll (): boolean {
    return this.$store.getters['contacts/list/selected_all']
  }

  set itemsSelectedAll (val: boolean) {
    this.$store.commit('contacts/list/selected_all', val)
  }

  get itemsSelectedAllInPage (): boolean {
    return this.$store.getters['contacts/list/selected_all_in_page']
  }

  set itemsSelectedAllInPage (val: boolean) {
    // no set
  }

  get itemsSelectedIndeterminate (): boolean {
    return this.$store.getters['contacts/list/selected_indeterminate']
  }

  get itemsSelectedCount (): number {
    return this.$store.getters['contacts/list/selected_count']
  }

  private onTableHeadCheckboxClick () {
    if (!this.itemsSelectedAllInPage) {
      this.$store.dispatch('contacts/list/selected_all_in_page')
    } else {
      this.$store.dispatch('contacts/list/unselect_all_in_page')
    }
  }

  private onBtnSelectAllClick () {
    this.$store.dispatch('contacts/list/selected_all')
  }

  private onBtnCancelSelectionClick () {
    this.$store.dispatch('contacts/list/unselect_all')
  }
}

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
      line-height: 12px !important;
      white-space: nowrap;
      color: #5f6060;
      cursor: pointer;
      user-select: none;

      td {
        height: 25px !important;
        padding: 0 5px !important;
        font-size: 0.775rem !important;
      }

      td:not(:first-child) {
        padding: 0 10px 0 10px!important;
      }

      td:nth-child(2) {
        width: 100%;
        padding-left: 0px !important;
      }

      td:last-child {
        width: 100px;
      }
    }

    & tr:nth-child(odd) {
      background-color: #607d8b17; /* фон нечетных строк */
    }

    & tr:nth-child(even) {
      background-color: inherit; /* фон нечетных строк */
    }
  }
}

</style>

<i18n>
{
  "ru": {
    "delete_confirmation_1": "<b>Удалить {n} контакт?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_2": "<b>Удалить {n} контакта?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation_3": "<b>Удалить {n} контактов?</b>&nbsp;Удалённые контакты можно восстановить течение 31 дня.",
    "delete_confirmation": "NaN | @:delete_confirmation_1 | @:delete_confirmation_2 | @:delete_confirmation_3",
    "selected_elements": " | Выбран {n} контакт |  Выбрано {n} контакта | Выбрано {n} контактов"
  }
}
</i18n>
