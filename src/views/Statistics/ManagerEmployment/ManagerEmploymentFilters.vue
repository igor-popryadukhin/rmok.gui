<template>
  <div class="filters">
    <div class="filters__box">
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
    </div>
    <div
      class="filters__refresh"
    >
      <v-divider class="mb-1" />
      <v-btn
        :loading="itemsFetching"
        block
        text
        tile
        @click="fetchStatistic"
      >
        {{ $tc('Refresh') }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Project from '@/api/interfaces/Project';
import AppBase from '@/AppBase';
import AppAutocomplete from '@/components/AppAutocomplete/AppAutocomplete.vue';
import AppMenuDatePicker from '@/components/AppMenuDatePicker/AppMenuDatePicker.vue';
import SmartAutocomplete from '@/smart-components/SmartAutocomplete/SmartAutocomplete.vue';
import Component from 'vue-class-component';
import { Emit } from 'vue-property-decorator';

// eslint-disable-next-line no-use-before-define
@Component<ManagerEmploymentFilters>({
  components: { SmartAutocomplete, AppMenuDatePicker, AppAutocomplete }
})
export default class ManagerEmploymentFilters extends AppBase {
  @Emit('click:btn:refresh')
  private clickBtnRefresh () {
    return undefined;
  }

  @Emit('filter:change')
  private filterChangeEmit () {
    return undefined;
  }

  get itemsFetching (): boolean { return this.$store.getters['statistics/manager_employment/items_fetching']; }

  // region Параметры фильтров
  get filterProject (): Project|null {
    return this.$store.getters['statistics/manager_employment/filter/project'];
  }
  set filterProject (val: Project|null) {
    this.$store.commit('statistics/manager_employment/filter/project', val);
  }
  // endregion

  private fetchStatistic () {
    this.$store.dispatch('statistics/manager_employment/fetch');
  }

}
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.filters__box {
  padding-top: 5px;
  padding-bottom: 5px;
  padding-right: 5px;
  overflow-y: auto;
}

.filters__refresh {
  margin-top: auto;
}
</style>
