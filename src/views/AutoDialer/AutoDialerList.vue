<template>
  <div class="autodial">
    <div class="autodial__tools">
      <div class="buttons">
        <auto-dialer-create-dialog @click:create="onAutoDialerCreateDialogCreate">
          <template #activator="{ on }">
            <v-btn
              :disabled="autoDialerItemsFetching"
              :color="$vuetify.theme.currentTheme.primary"
              icon
              v-on="on"
            >
              <app-tooltip>
                <template #activator="{ on }">
                  <v-icon v-on="on">
                    mdi-plus
                  </v-icon>
                </template>
                <span>
                  {{ $tc('Click to create a new entry') }}
                </span>
              </app-tooltip>
            </v-btn>
          </template>
        </auto-dialer-create-dialog>
        <v-btn
          :disabled="autoDialerItemsFetching"
          :color="$vuetify.theme.currentTheme.primary"
          icon
          @click="onBtnRefreshClick"
        >
          <v-icon>
            mdi-refresh
          </v-icon>
        </v-btn>
      </div>
      <div>
        <v-text-field
          v-model="filterQ"
          :placeholder="$tc('Search')"
          :append-icon="!filterQ ? 'mdi-magnify' : ''"
          style="max-width: 350px"
          clearable
          hide-details
          dense
          outlined
          @input="onFilterChange"
        />
      </div>
    </div>

    <app-divider class="mb-1" />

    <div class="autodial__list">
      <template v-if="autoDialerItemsFetching && autoDialerItems.length === 0">
        <div
          class="d-flex align-center justify-center"
          style="height: 500px"
        >
          <div class="pa-16 grey--text">
            <app-loading />
          </div>
        </div>
      </template>
      <template v-else-if="autoDialerItems.length === 0">
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
        <v-list dense>
          <template v-for="item in autoDialerItems">
            <v-list-item
              :key="'v-list-item-' + item.id"
              link
              dense
              @click="$router.push({ name: 'auto_dialer_view', params: { id: item.id }})"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item.name }} <span style="color: #3a70d4; margin-left: 5px">[ {{ item.project.name }} ]</span></v-list-item-title>
                <v-list-item-subtitle class="subtitle1">
                  <div class="d-flex">
                    <div>
                      {{ $t('mode_', { mode: $t(`mode.${item.mode}`).toString().toLowerCase() }) }}
                    </div>
                    <!--                    <div>-->
                    <!--                      1 / 3-->
                    <!--                    </div>-->
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn
                  v-if="item.status === 'ready'"
                  :loading="processItemAction.includes(item.id)"
                  color="primary"
                  icon
                  small
                  @click.native.stop="onBtnItemPlayOrStopClick(item, 'start')"
                >
                  <v-icon small>
                    mdi-play
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else-if="item.status === 'process'"
                  :loading="processItemAction.includes(item.id)"
                  color="red"
                  icon
                  small
                  @click.native.stop="onBtnItemPlayOrStopClick(item, 'stop')"
                >
                  <v-icon small>
                    mdi-pause
                  </v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-divider :key="'v-divider-' + item.id" />
          </template>
        </v-list>
        <div class="d-flex justify-center grey--text text-caption">
          <div>
            {{ autoDialerItems.length }} / {{ autoDialerItemsTotal }}
          </div>
        </div>
        <div
          v-if="autoDialerItemsTotal >= 30"
          v-intersect="onIntersect"
          class="d-flex align-center justify-center"
          style="min-height: 200px"
        >
          <app-loading v-if="isIntersecting && autoDialerItemsFetching" />
          <v-btn
            v-else
            small
            tile
            text
            @click="loadMore"
          >
            {{ $tc('Load more') }} ...
          </v-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError';
import Autodialer from '@/api/interfaces/Autodialer';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import AppPagination from '@/components/AppPagination/AppPaginator.vue';
import AppTextField from '@/components/AppTextField/AppTextField.vue';
import $store from '@/store';
import debounce from '@/utils/debounce';
import { AxiosResponse } from 'axios';
import Vue from 'vue';
import Component from 'vue-class-component';

@Component({
  components: {
    AppTextField,
    AutoDialerCreateDialog: () => import(
      /* webpackChunkName: "auto-dialer-create-dialog" */
      '@/views/AutoDialer/AutoDialerCreateDialog.vue'
      ),
    AppLoading,
    AppPagination
  },
  beforeRouteEnter (to, from, next) {
    $store
      .dispatch('autodialer/list/fetch')
      .finally(() => (next()));
  }
})
export default class AutoDialerList extends Vue {
  isIntersecting = false
  processItemAction = []

  get autoDialerItems () {
    return this.$store.getters['autodialer/list/items'];
  }

  get autoDialerItemsTotal () {
    return this.$store.getters['autodialer/list/total'];
  }
  get autoDialerItemsFetching () {
    return this.$store.getters['autodialer/list/items_fetching'];
  }

  // Фильтры
  get filterQ (): string {
    return this.$store.getters['autodialer/list/filter/filter_q'];
  }

  set filterQ (val: string) {
    this.$store.commit('autodialer/list/filter/filter_q', val);
  }

  get filterOffset (): number {
    return Number(this.$routerQuery.getQuery('offset')) || 0;
  }

  set filterOffset (val: number) {
    this.$routerQuery.setQuery({ offset: val });
  }

  get requestParameters () {
    return {
      offset: this.filterOffset
    };
  }

  created () {
    this.onFilterChange = debounce(this.onFilterChange, 350);
  }

  onBtnItemPlayOrStopClick (item: Autodialer, status: 'start'|'stop') {
    this.processItemAction.push(item.id);

    this.$axios.get(`/auto-dialers/${item.id}/${status}`)
      .then((response: AxiosResponse) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }

        const items = JSON.parse(JSON.stringify(this.autoDialerItems)) as Array<any>;
        const index = items.findIndex((e) => e.id === item.id);
        if (index > -1) {
          items[index].status = status === 'start' ? 'process' : 'ready';
          this.$store.commit('autodialer/list/items', items);
        }

        if (status === 'start') {
          this.$toast.success(this.$tc('Autodial is started'));
        } else if (status === 'stop') {
          this.$toast.success(this.$tc('Autodial is stopped'));
        }

      }).finally(() => {
      const index = this.processItemAction.findIndex((value) => value === item.id);
      if (index > -1) {
        this.processItemAction.splice(index, 1);
      }
    });
  }

  async onAutoDialerCreateDialogCreate (data: any) {
    this.$axios.post('/auto-dialers', data)
      .then((response: AxiosResponse) => {
        if (response.status !== 201) {
          throw new APIError(response.data);
        }

        this.$store.dispatch('autodialer/list/fetch');
        this.$toast.success('Autodial created successfully');
      });
  }

  private onBtnRefreshClick () {
    this.$store.dispatch('autodialer/list/fetch');
  }

  private loadMore () {
    this.$store.dispatch('autodialer/list/fetch', { append: true });
  }

  private onFilterChange () {
    this.$store.dispatch('autodialer/list/fetch');
  }

  private onIntersect (entries) {
    this.isIntersecting = entries[0].isIntersecting;
    if (this.isIntersecting) {
      this.loadMore();
    }
  }
}
</script>

<style lang="scss" scoped>
.autodial {
  display: flex;
  flex-direction: column;
  height: var(--page-calculated-height2);
  overflow: auto;
}

.autodial__tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0 5px 0;
}

.autodial__tools .buttons {
  display: flex;
  flex-direction: row;
}

//.autodial__tools .buttons:not(:last-child) {
//  margin-right: 5px;
//}

.autodial__box {
  display: flex;
  flex-direction: row;
  height: calc(var(--page-calculated-height2) - 35px);
  padding-top: 5px;
}

.autodial__filters {
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 250px;
  overflow: auto;
  border-right: #0000001f solid 1px;
  height: 100%;
  padding-right: 5px;
  margin-right: 5px;
}

.autodial__list {
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex-grow: 1;
  height: 100%;
}

.subtitle1 {
  color: #9e9e9e !important;
}

.subtitle1 div:not(:last-child) {
  margin-right: 10px;
}
</style>

<i18n>
{
  "ru": {
    "Autodial is started": "Автодозвон запущен",
    "Autodial is stopped": "Автодозвон остановлен",
    "Autodial created successfully": "Автодозвон успешно создан",
    "mode_": "Режим: {mode}",
    "mode": {
      "progressive": "Прогрессивный",
      "predictive": "Предиктивный"
    }
  }
}
</i18n>
