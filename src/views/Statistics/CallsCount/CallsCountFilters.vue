<template>
  <div>
    <div class="py-2">
      <!-- Проект -->
      <smart-autocomplete
        v-model="filterProject"
        :label="$tc('Project')"
        :api-query="(q) => { return { q } }"
        :disabled="itemsFetching"
        :items="filterProject ? [filterProject] : []"
        api-end-point="/projects"
        item-text="name"
        item-value="id"
        response-property="data"
        store-module-name="projects"
        clearable
        @change="filterChangeEmit"
      />
      <!-- Проект -->

      <!-- Группа -->
      <smart-autocomplete
        v-model="filterGroup"
        :label="$tc('Group')"
        :api-query="(q) => { return { q } }"
        :disabled="itemsFetching"
        :items="filterGroup ? [filterGroup] : []"
        item-text="name"
        item-value="id"
        api-end-point="/groups"
        response-property="data"
        store-module-name="groups"
        clearable
        @change="filterChangeEmit"
      />
      <!-- Группа -->

      <!-- Ответственный -->
      <smart-autocomplete
        v-model="filterUsers"
        :label="$tc('Responsible')"
        :api-query="(q) => { return { q } }"
        :disabled="itemsFetching"
        :items="filterUsers"
        api-end-point="/users"
        item-text="full_name"
        item-value="id"
        response-property="data"
        store-module-name="users"
        multiple
        clearable
        @change="filterChangeEmit"
      >
        <template #selection="{ item, index }">
          <v-chip
            close
            outlined
            label
            small
            @click:close="filterUsers.splice(index, 1)"
          >
            {{ item.full_name }}
          </v-chip>
        </template>
      </smart-autocomplete>
      <!-- Ответственный -->

      <!-- Типы вызовов -->
      <v-select
        v-model="callTypes"
        :items="callTypeOptions"
        :label="$tc('Call types')"
        disabled
        item-text="title"
        item-value="value"
        multiple
        outlined
        dense
        @change="filterChangeEmit"
      />
      <!-- Типы вызовов -->
    </div>
    <v-divider />
    <div class="py-2">
      <v-btn
        :loading="itemsFetching"
        block
        text
        tile
        @click="clickBtnRefresh"
      >
        {{ $tc('Refresh') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Project from '@/api/interfaces/Project';
import User from '@/api/interfaces/User';
import UserGroup from '@/api/interfaces/UserGroup';
import AppBase from '@/AppBase';
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue';
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue';
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue';
import debounce from '@/utils/debounce';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

// eslint-disable-next-line no-use-before-define
@Component<CallsCountFilters>({
  components: { SmartAutocomplete, AppMenuDatePicker, AppAutocomplete }
})
export default class CallsCountFilters extends AppBase {
  @Emit('click:btn:refresh')
  public clickBtnRefresh () {
    return;
  }

  @Emit('filter:change')
  public filterChangeEmit () {
    return undefined;
  }

  get itemsFetching (): boolean { return this.$store.getters['statistics/calls_count/items_fetching']; }

  // region Параметры фильтров

  get filterProject (): Project|null {
    return this.$store.getters['statistics/calls_count/filter/project'];
  }
  set filterProject (val: Project|null) {
    this.$store.commit('statistics/calls_count/filter/project', val);
  }

  get filterUsers (): User[] { return this.$store.getters['statistics/calls_count/filter/users']; }
  set filterUsers (val: User[]) {
    this.$store.commit('statistics/calls_count/filter/users', val);
  }

  get filterGroup (): UserGroup|null { return this.$store.getters['statistics/calls_count/filter/user_group']; }
  set filterGroup (val: UserGroup|null) {
    this.$store.commit('statistics/calls_count/filter/user_group', val);
  }

  get callTypes (): string[] { return this.$store.getters['statistics/calls_count/filter/call_types']; }
  set callTypes (val: string[]) { this.$store.commit('statistics/calls_count/filter/call_types', val); }

  // endregion

  get callTypeOptions () {
    return [
      // {
      //   title: 'All',
      //   value: 'all'
      // },
      {
        title: 'Outgoing calls',
        value: 'outgoing'
      },
      {
        title: 'Incoming calls',
        value: 'incoming'
      },
      {
        title: 'Missed calls',
        value: 'missed'
      }
    ].map((e) => {
      return {
        title: this.$tc(e.title),
        value: e.value
      };
    });
  }

  public created () {
    this.filterChangeEmit = debounce(this.filterChangeEmit, 450);
  }

}
</script>

<style scoped>
.extra-small-chip >>> span > button {
  font-size: 13px !important;
}
</style>
