<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <v-btn
          to="create"
          :disabled="processLoading"
          small
          tile
          text
        >
          {{ $tc('Create') }}
        </v-btn>
        <v-btn
          :disabled="processLoading"
          small
          tile
          text
          @click="onBtnRefreshClick"
        >
          {{ $tc('Refresh') }}
        </v-btn>
      </template>
      <template #right>
        <app-paginator
          v-model="offset"
          :per-page="scenariosPerPage"
          :count="scenariosTotal"
          @change="onAppPaginationChange"
        />
      </template>
    </app-tools>
    <template v-if="processLoading">
      <div
        class="d-flex align-center justify-center"
        style="height: 500px"
      >
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="scenariosItems.length === 0">
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
      <v-simple-table dense>
        <template #default>
          <thead>
            <tr>
              <th
                class="text-left"
              >
                {{ $tc('Name') }}
              </th>
              <th
                class="text-right"
              >
                {{ $tc('Created at') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in scenariosItems"
              :key="'tr-' + item.id"
            >
              <!-- Имя сценария -->
              <td style="white-space: nowrap">
                <router-link :to="{ name: 'scenarios_edit', params: { id: item.id } }">
                  {{ item.name }}
                </router-link>
              </td>
              <!-- Имя сценария -->

              <!-- Дата создания -->
              <td class="text-right">
                {{ $dayjs(item.created_at).format('DD.MM.YYYY HH:mm') }}
              </td>
              <!-- Дата создания -->
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import debounce from '@/utils/debounce'
import Component from 'vue-class-component'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'

@Component({
  components: {
    AppLoading,
    AppPaginator
  }
})
export default class ScenariosList extends Vue {
  processLoading = false

  get scenariosItems () { return this.$store.getters['scenarios/list/items'] }
  get scenariosTotal () { return this.$store.getters['scenarios/list/total'] }
  get scenariosPerPage () { return this.$store.getters['scenarios/list/per_page'] }

  // Фильтры
  get offset (): number { return this.$store.getters['scenarios/list/filter_offset'] }
  set offset (val: string|number) { this.$store.commit('scenarios/list/filter_offset', +val) }

  get requestParameters () {
    return {
      count: this.scenariosPerPage,
      offset: this.offset
    }
  }

  mounted () {
    this.fetch = debounce(this.fetch, 500)
    this.fetch()
  }

  fetch () {
    this.processLoading = true
    this.$store
      .dispatch('scenarios/list/fetch', this.requestParameters)
      .finally(() => (this.processLoading = false))
  }

  onBtnRefreshClick () {
    this.fetch()
  }

  private onAppPaginationChange () {
    this.fetch()
  }
}
</script>

<style scoped>

</style>
