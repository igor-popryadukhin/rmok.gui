<template>
  <v-sheet height="100%">
    <div class="scenarios-page__tools">
      <div
        class="d-flex flex-row grow align-center mb-1"
        style="height: 28px"
      >
        <v-btn
          small
          tile
          text
          @click="onBtnCreateClick"
        >
          {{ $tc('Create') }}
        </v-btn>
      </div>
      <v-divider />
      <div
        class="d-flex flex-row grow align-center"
        style="height: 68px"
      >
        <v-text-field
          :label="$t('Search')"
          prepend-inner-icon="mdi-magnify"
          style="max-width: 250px"
          clearable
          outlined
          dense
          hide-details
        />
      </div>
    </div>

    <app-divider />

    <div
      v-if="processLoading && items.length === 0"
      class="d-flex align-center justify-center fill-height"
    >
      <app-loading />
    </div>
    <div
      v-else-if="items.length === 0"
      class="d-flex align-center justify-center fill-height"
    >
      {{ $tc('Empty') }}
    </div>
    <div
      v-else
      class="scenarios-page__list"
    >
      <v-list dense>
        <template v-for="(item, itemKey) in items">
          <v-list-item
            :key="`v-list-item-${itemKey}`"
            link
            dense
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                :to="{ name: 'scenarios_view', params: { id: item.id } }"
                icon
                tile
                ripple
                small
              >
                <v-icon>mdi-file-document-edit-outline</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`v-divider-${itemKey}`" />
        </template>
      </v-list>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError';
import Scenario from '@/api/interfaces/Scenario';
import { AxiosResponse } from 'axios';
import Vue from 'vue';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import debounce from '@/utils/debounce';
import Component from 'vue-class-component';
import AppPaginator from '@/components/AppPagination/AppPaginator.vue';

@Component({
  components: {
    AppLoading,
    AppPaginator
  }
})
export default class ScenariosList extends Vue {
  processLoading = false

  get items (): Scenario[] { return this.$store.getters['scenarios/list/items']; }
  get scenariosTotal () { return this.$store.getters['scenarios/list/total']; }
  get scenariosPerPage () { return this.$store.getters['scenarios/list/per_page']; }

  // Фильтры
  get offset (): number { return this.$store.getters['scenarios/list/filter_offset']; }
  set offset (val: string|number) { this.$store.commit('scenarios/list/filter_offset', +val); }

  get requestParameters () {
    return {
      count: this.scenariosPerPage,
      offset: this.offset
    };
  }

  mounted () {
    this.fetch = debounce(this.fetch, 500);
    this.fetch();
  }

  fetch () {
    this.processLoading = true;
    this.$store
      .dispatch('scenarios/list/fetch', this.requestParameters)
      .finally(() => (this.processLoading = false));
  }

  onBtnRefreshClick () {
    this.fetch();
  }

  onBtnCreateClick () {
    this.$dialog.prompt({
      title: this.$tc('Creating a new scenario'),
      text: this.$tc('Name scenario'),
      actions: {
        false: this.$tc('Cancel'),
        true: this.$tc('Create')
      }
    }).then((value?: string) => {
      if (value) {
        this.$axios.post('/scenarios', {
          name: value
        }).then((response: AxiosResponse) => {
          if (response.status !== 201) {
            throw new APIError(response.data);
          }
          this.$toast.success('Scenario created');
          this.$router.push({
            name: 'scenarios_view',
            params: {
              id: String(response.data?.id)
            }
          });
        }).catch((reason) => {
          if (reason instanceof APIError) {
            reason.errors.forEach((e) => {
              this.$toast.error(e.message);
            });
          } else {
            this.$toast.error(reason.message);
          }
        });
      }
    });
  }

  private onAppPaginationChange () {
    this.fetch();
  }
}
</script>

<style lang="scss" scoped>
.scenarios-page {
  height: 100%;
}

.scenarios-page__tools {
  height: 100px;
}

.scenarios-page__list {
  height: calc(100% - 100px);
  height: -moz-calc(100% - 100px);
  height: -webkit-calc(100% - 100px);

  overflow: auto;
}
</style>

<i18n>
{
  "ru" :{
    "Creating a new scenario": "Создание нового сценария",
    "Name scenario": "Название сценария",
    "Scenario created": "Сценарий создан"
  }
}
</i18n>
