<template>
  <v-sheet
    height="100%"
    class="pl-3 pt-3 pb-3"
  >
    <div class="mb-3">
      <v-text-field
        v-model="q"
        :label="$t('Search')"
        prepend-inner-icon="mdi-magnify"
        clearable
        outlined
        dense
        hide-details
        @input="onFilterChange"
      />
    </div>
    <div class="mb-3">
      <app-autocomplete
        v-model="statusId"
        :options="statuses"
        :label="$tc('Result')"
        :loading="statusesFetching"
        :disabled="itemsFetching"
        item-text="name"
        item-value="id"
        item-color="color"
        clearable
        hide-details
        @search="onAppAutocompleteStatusesSearch"
        @focus="onAppAutocompleteStatusesFocus"
        @change="onFilterChange"
      />
    </div>
    <div
      v-if="isDatePickerVisible"
      class="mb-3"
    >
      <v-date-picker
        v-model="filterCustomPlannedFor"
        :disabled="itemsFetching"
        range
        no-title
        full-width
        @change="onFilterChange"
      />
    </div>
    <div
      class="py-3"
    >
      <v-btn
        color="primary"
        height="35"
        :loading="itemsFetching && items.length > 0"
        :disabled="itemsFetching && items.length === 0"
        outlined
        block
        text
        tile
        @click="onBtnRefresh"
      >
        {{ $tc('Refresh') }}
      </v-btn>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import Status from '@/api/interfaces/Status'
import Task from '@/api/interfaces/Task'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import statuses from '@/store/statuses'
import debounce from '@/utils/debounce'
import TasksBase from '@/views/Tasks/TasksBase'
import Component from 'vue-class-component'

// eslint-disable-next-line no-use-before-define
@Component<TasksFilters>({
  components: { AppMenuDatePicker, AppAutocomplete }
})
export default class TasksFilters extends TasksBase {
  get isDatePickerVisible (): boolean {
    return this.$route.params.id === 'custom'
  }

  /**
   * Процесс получения задач
   */
  get itemsFetching (): boolean {
    return this.$store.getters[this.vuexModuleNamespace + '/list/items_fetching']
  }

  /**
   * Задачи
   */
  get items (): Task[] {
    return this.$store.getters[this.vuexModuleNamespace + '/list/items']
  }

  get filterCustomPlannedFor (): string[] {
    const arr = String(this.$store.getters['tasks/custom/list/filter/filter_planned_for'] || '').split('|')
    if (arr.length === 1) {
      if (this.$dayjs(arr[0], 'YYYY-MM-DDTHH:mm').isValid()) {
        return [this.$dayjs(arr[0], 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD')]
      }

      return []
    } else if (arr.length === 2) {
      const d1 = this.$dayjs(arr[0], 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD')
      const d2 = this.$dayjs(arr[1], 'YYYY-MM-DDTHH:mm').format('YYYY-MM-DD')

      return [d1, d2]
    }
  }

  set filterCustomPlannedFor (val: string[]) {
    if (val.length === 1) {
      this.$store.commit('tasks/custom/list/filter/filter_planned_for', `${val[0]}`)
    } else if (val.length === 2) {
      const d1 = this.$dayjs(val[0], 'YYYY-MM-DD')
      const d2 = this.$dayjs(val[1], 'YYYY-MM-DD')
      if (d1.diff(d2, 'day') >= 0) {
        this.$store.commit('tasks/custom/list/filter/filter_planned_for', `${val[1]}|${val[0]}`)
      } else {
        this.$store.commit('tasks/custom/list/filter/filter_planned_for', `${val[0]}|${val[1]}`)
      }
    }
  }

  get q (): string|null { return this.$store.getters[this.vuexModuleNamespace + '/list/filter/filter_q'] }

  set q (val: string|null) { this.$store.commit(this.vuexModuleNamespace + '/list/filter/filter_q', val) }

  get statusId (): number {
    return this.$store.getters[this.vuexModuleNamespace + '/list/filter/filter_status_id']
  }

  set statusId (val: number) {
    this.$store.commit(this.vuexModuleNamespace + '/list/filter/filter_status_id', val)
  }

  /** Статусы */
  get statuses (): Status[] {
    return this.$store.getters['tasks/statuses/items']
  }

  get statusesFetching (): boolean {
    return this.$store.getters['tasks/statuses/items_fetching']
  }

  public created () {
    this.onFilterChange = debounce(this.onFilterChange, 500)
    this.onAppAutocompleteStatusesSearch = debounce(this.onAppAutocompleteStatusesSearch, 350)
    const statusesModule = ['tasks', 'statuses']
    if (!this.$store.hasModule(statusesModule)) {
      this.$store.registerModule(statusesModule, statuses)
    }
  }

  private onAppAutocompleteStatusesSearch (q?: string) {
    if (typeof q === 'string') {
      const params: Record<string, unknown> = { q }

      if (this.$store.getters['profile/current_project/id']) {
        params.project_id = this.$store.getters['profile/current_project/id']
      }

      if (this.statuses.findIndex((e) => e.name?.toLowerCase().indexOf(q?.toLowerCase()) > -1) === -1) {
        this.$store.dispatch('tasks/statuses/fetch', params)
      }
    }
  }

  /**
   * @private
   */
  private onAppAutocompleteStatusesFocus () {
    const params: Record<string, unknown> = {}

    if (this.$store.getters['profile/current_project/id']) {
      params.project_id = this.$store.getters['profile/current_project/id']
    }

    if (this.statuses.length === 0) {
      this.$store.dispatch('tasks/statuses/fetch', params)
    }
  }

  /**
   * @private
   */
  private onFilterChange () {
    this.fetchTasks()
  }

  /**
   * @private
   */
  private onBtnRefresh () {
    this.fetchTasks()
  }
}
</script>

<style scoped>
.extra-small-chip >>> span > button {
  font-size: 13px !important;
}
</style>
