<template>
  <div class="py-2">
    <smart-autocomplete
      v-model="project"
      :label="$tc('Project')"
      :api-query="(q) => { return { q } }"
      :items="project ? [project] : []"
      api-end-point="/projects"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="projects"
      clearable
      @change="onFilterChange"
    />

    <smart-autocomplete
      v-model="statuses"
      :disabled="!project"
      :label="$tc('Result')"
      :api-query="(q) => { return { ...Object.assign(!!q ? { q } : {}, {...(!!project ? { project_id: project.id } : {})}) } }"
      :items="!!statuses ? statuses : []"
      :filter="(item) => !!item.project && !!project && item.project.id === project.id"
      api-end-point="/statuses"
      item-text="name"
      item-value="id"
      store-module-name="statuses"
      clearable
      multiple
      @change="onFilterChange"
    >
      <template
        #item="{ item, on, attrs }"
      >
        <v-list-item
          v-bind="attrs"
          :color="item.color"
          :input-value="item.id"
          v-on="on"
        >
          {{ item.name }}
        </v-list-item>
      </template>

      <template
        #selection="{ item }"
      >
        <v-chip
          class="extra-small-chip"
          :color="item.color"
          outlined
          label
          close
          x-small
          @click:close="onStatusChipClose(item.id)"
        >
          {{ item.name }}
        </v-chip>
      </template>
    </smart-autocomplete>

    <smart-autocomplete
      v-model="userGroup"
      :label="$tc('Group')"
      :api-query="(q) => { return { q } }"
      :items="userGroup ? [userGroup] : []"
      api-end-point="/groups"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="groups"
      clearable
      @change="onFilterChange"
    />

    <smart-autocomplete
      v-model="owner"
      :label="$tc('Responsible')"
      :api-query="(q) => { return { ...Object.assign(!!q ? { q } : {}, {...(!!project ? { project_id: project.id } : {})}) } }"
      :items="owner ? [owner] : []"
      api-end-point="/users"
      item-text="full_name"
      item-value="id"
      response-property="data"
      store-module-name="users"
      clearable
      @change="onFilterChange"
    />

    <smart-autocomplete
      v-model="tags"
      :label="$tc('Tags')"
      :api-query="(q) => { return { q } }"
      :items="tags ? tags : []"
      api-end-point="/contacts/tags"
      item-color="color"
      item-text="name"
      item-value="id"
      response-property="data"
      store-module-name="tags"
      clearable
      multiple
      @change="onFilterChange"
    >
      <template
        #item="{ item, on, attrs }"
      >
        <v-list-item
          v-bind="attrs"
          :color="item.color"
          :input-value="item.id"
          v-on="on"
        >
          {{ item.name }}
        </v-list-item>
      </template>

      <template
        #selection="{ item }"
      >
        <v-chip
          class="extra-small-chip"
          :color="item.color"
          outlined
          label
          close
          x-small
          @click:close="onTagsChipClose(item.id)"
        >
          {{ item.name }}
        </v-chip>
      </template>
    </smart-autocomplete>

    <smart-autocomplete
      v-model="timeZone"
      :label="$tc('Time zone')"
      api-end-point="/handbooks/timezones"
      :items="timeZone ? [timeZone] : []"
      item-text="name_local"
      item-value="id"
      store-module-name="timezones"
      clearable
      @change="onFilterChange"
    >
      <template #item="{ item, attrs, on }">
        <v-list-item
          v-bind="attrs"
          v-on="on"
        >
          <v-list-item-content>
            <v-list-item-title>{{ item.name_local }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-list-item-action-text>
              {{ item.offset_string }}
            </v-list-item-action-text>
          </v-list-item-action>
        </v-list-item>
      </template>
    </smart-autocomplete>

    <app-menu-date-picker
      v-model="contactCreatedAt"
      range
      format="YYYY-MM-DD"
      display-format="DD.MM.YYYY"
    >
      <template #activator="{ on, text }">
        <v-text-field
          :label="$tc('Date the contact was created')"
          :value="text"
          readonly
          dense
          outlined
          clearable
          v-on="on"
          @click:clear="contactCreatedAt = []"
        />
      </template>
    </app-menu-date-picker>
    <v-divider />
    <div class="py-2">
      <v-btn
        :loading="itemsFetching"
        block
        text
        tile
        @click="onBtnRefresh"
      >
        {{ $tc('Refresh') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue'
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue'
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'

// eslint-disable-next-line no-use-before-define
@Component<AllCallsFilters>({
  components: { SmartAutocomplete, AppMenuDatePicker, AppAutocomplete }
})
export default class AllCallsFilters extends AppBase {

  // region Параметры запроса
  get q () { return this.$store.getters['statistics/all_calls/filter/q'] }
  set q (val) { this.$store.commit('statistics/all_calls/filter/q', val) }

  get project () { return this.$store.getters['statistics/all_calls/filter/project'] }
  set project (val) {
    this.$store.commit('statistics/all_calls/filter/project', val)
    this.$store.commit('statistics/all_calls/filter/statuses', [])
  }

  get statuses () { return this.$store.getters['statistics/all_calls/filter/statuses'] }
  set statuses (val) { this.$store.commit('statistics/all_calls/filter/statuses', val) }

  get userGroup () { return this.$store.getters['statistics/all_calls/filter/user_group'] }
  set userGroup (val) {
    this.$store.commit('statistics/all_calls/filter/user_group', val)
    this.$store.commit('statistics/all_calls/filter/owner', null)
  }

  get owner () { return this.$store.getters['statistics/all_calls/filter/owner'] }
  set owner (val) { this.$store.commit('statistics/all_calls/filter/owner', val) }

  get tags () { return this.$store.getters['statistics/all_calls/filter/tags'] }
  set tags (val) { this.$store.commit('statistics/all_calls/filter/tags', val) }

  get timeZone () { return this.$store.getters['statistics/all_calls/filter/timezone'] }
  set timeZone (val) { this.$store.commit('statistics/all_calls/filter/timezone', val) }

  get contactCreatedAt (): string[] {
    const dates = String(this.$store.getters['statistics/all_calls/filter/contact_created_at'] || '')
      .split('|')
    if (dates.length === 2) {
      return dates
    }
    return []
  }

  set contactCreatedAt (val: string[]) {
    if (Array.isArray(val) && val.length === 2) {
      this.$store.commit('statistics/all_calls/filter/contact_created_at', val.join('|'))
    } else if (Array.isArray(val) && val.length === 0) {
      this.$store.commit('statistics/all_calls/filter/contact_created_at', null)
    }
  }

  get itemsFetching (): boolean { return this.$store.getters['statistics/all_calls/items_fetching'] }

  @Watch('contactCreatedAt')
  contactCreatedAtWatch() {
    this.onFilterChange()
  }

  public created () {
    this.onFilterChange = debounce(this.onFilterChange, 350)
  }

  /**
   * Срабатывает при изменении значений одного из фильтров
   * @private
   */
  private onFilterChange () {
    this.$store.dispatch('statistics/all_calls/fetch')
    this.$store.commit('statistics/all_calls/filter/offset', 0)
  }

  private onBtnRefresh () {
    this.$store.dispatch('statistics/all_calls/fetch')
  }

  /**
   * @param id
   * @private
   */
  private onTagsChipClose (id: number) {
    this.tags = this.tags.filter((value) => {
      return value.id !== id
    })
  }

  /**
   * @param id
   * @private
   */
  private onStatusChipClose (id: number) {
    this.statuses = this.statuses.filter((value) => {
      return value.id !== id
    })
  }
}
</script>

<style scoped>
.extra-small-chip >>> span > button {
  font-size: 13px !important;
}
</style>
