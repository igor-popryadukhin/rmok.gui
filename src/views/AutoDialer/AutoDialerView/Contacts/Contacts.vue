<template>
  <div class="fill-height">
    <div>
      <div class="py-2">
        <h3 class="grey--text">
          Совершают вызов
        </h3>
      </div>
      <v-divider />
      <v-data-table
        v-model="itemsSelected"
        item-key="id"
        selectable-key="id"
        :height="200"
        :headers="callsHeaders"
        :items="itemsCallers"
        hide-default-footer
        fixed-header
        show-select
        dense
      >
        <template #no-data>
          <div
            class="d-flex align-center justify-center grey--text"
            style="height: 165px"
          >
            Отсутствуют данные
          </div>
        </template>
        <template #[`item.progress`]="{ value }">
          <v-chip
            v-if="value === 'init'"
            color="#ffc107"
            label
            x-small
          >
            {{ $tc('Init') }}
          </v-chip>
          <v-chip
            v-if="value === 'process'"
            color="blue"
            text-color="white"
            label
            x-small
          >
            {{ $tc('In progress') }}
          </v-chip>
          <v-chip
            v-if="value === 'complete'"
            color="green"
            text-color="white"
            label
            x-small
          >
            {{ $tc('Complete') }}
          </v-chip>
        </template>
        <template #[`item.contact`]="{ item }">
          <router-link :to="{ name: 'contacts_view', params: { id: item.contact.id }}">
            {{ item.contact.name }}
          </router-link>
        </template>
        <template #[`item.external_status`]="{ value }">
          <v-chip
            label
            x-small
            outlined
          >
            {{ value }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
    <v-divider />
    <div>
      <div class="py-2">
        <h3 class="grey--text">
          Ожидают вызова / завершённые
        </h3>
      </div>
      <v-divider />
      <!-- Tools -->
      <div class="py-2">
        <div class="d-flex">
          <v-btn
            v-if="itemsSelected.length === 0"
            :loading="btnRefreshLoading"
            tile
            text
            small
            @click="onBtnRefreshClick"
          >
            {{ $tc('Refresh') }}
          </v-btn>
          <app-confirm-dialog
            text="Вы действительно хотите удалить?"
            @click:confirm="onBtnDeleteClick"
          >
            <template #activator="{ on }">
              <v-btn
                v-if="itemsSelected.length > 0"
                :loading="removalProcess"
                tile
                text
                small
                v-on="on"
              >
                {{ $tc('Delete') }}
              </v-btn>
            </template>
          </app-confirm-dialog>
          <v-spacer />
          <app-paginator
            v-model="filterOffset"
            :per-page="itemsPerPage"
            :count="itemsTotal"
            :disabled="itemsFetching"
            @click:btn:left="onAppPaginationChange"
            @click:btn:right="onAppPaginationChange"
          />
        </div>
      </div>
      <v-divider />
      <!-- Tools -->
      <v-data-table
        v-model="itemsSelected"
        item-key="id"
        selectable-key="id"
        height="calc(100vh - 490px)"
        :headers="callsHeaders"
        :items="items"
        :loading="itemsFetching && items.length === 0"
        :server-items-length="itemsTotal"
        :items-per-page="itemsPerPage"
        fixed-header
        hide-default-footer
        show-select
        dense
      >
        <template #no-data>
          <div
            class="d-flex align-center justify-center grey--text"
            style="height: calc(100vh - 550px)"
          >
            Отсутствуют данные
          </div>
        </template>
        <template #progress>
          {{ '' }}
        </template>
        <template #loading>
          <div
            class="d-flex align-center justify-center grey--text"
            style="height: calc(100vh - 550px)"
          >
            <app-loading />
          </div>
        </template>
        <template #[`item.progress`]="{ value }">
          <v-chip
            v-if="value === 'init'"
            color="#ffc107"
            label
            x-small
          >
            {{ $tc('New') }}
          </v-chip>
          <v-chip
            v-if="value === 'process'"
            color="blue"
            text-color="white"
            label
            x-small
          >
            {{ $tc('In progress') }}
          </v-chip>
          <v-chip
            v-if="value === 'complete'"
            color="green"
            text-color="white"
            label
            x-small
          >
            {{ $tc('Complete') }}
          </v-chip>
        </template>
        <template #[`item.contact`]="{ item }">
          <router-link :to="{ name: 'contacts_view', params: { id: item.contact.id }}">
            {{ item.contact.name }}
          </router-link>
        </template>
        <template #[`item.external_status`]="{ value }">
          <v-chip
            label
            x-small
            outlined
          >
            {{ value }}
          </v-chip>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script lang="ts">
import APIError from '@/api/classes/APIError';
import AutodialerCall from '@/api/interfaces/AutodialerCall';
import AppConfirmDialog from '@/components/AppConfirmDialog/AppConfirmDialog.vue';
import Component from 'vue-class-component';
import AppBase from '@/AppBase';
import AppLoading from '@/components/AppLoading/AppLoading.vue';
import AppPaginator from '@/components/AppPagination/AppPaginator.vue';

// eslint-disable-next-line no-use-before-define
@Component<Contacts>({
  components: { AppConfirmDialog, AppPaginator, AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.itemsFetching = true;
      vm.$store.dispatch('autodialer/view/calls/fetch', to.params.id).finally(() => (vm.itemsFetching = false));
    });
  }
})
export default class Contacts extends AppBase {
  timerIds = []
  removalProcess = false
  loading = true
  btnRefreshLoading = false
  itemsFetching = false

  get callsHeaders () {
    return [
      {
        text: 'Контакт',
        align: 'start',
        sortable: false,
        value: 'contact'
      },
      {
        text: 'Прогресс',
        align: 'start',
        sortable: false,
        value: 'progress'
      },
      {
        text: 'Статус',
        align: 'start',
        sortable: false,
        value: 'external_status'
      },
      {
        text: 'Попытки',
        align: 'center',
        sortable: false,
        value: 'attempts_left'
      },
      {
        text: 'Последний вызов',
        align: 'start',
        sortable: false,
        value: 'last_call_at'
      },
      {
        text: 'Следующий вызов',
        align: 'start',
        sortable: false,
        value: 'next_call_at'
      },
      {
        text: 'Можно звонить',
        align: 'center',
        sortable: false,
        value: 'you_can_call'
      }
    ];
  }

  // В данный момент совершают вызовы
  get itemsCallers () {
    return (this.$store.getters['autodialer/view/calls/items_callers'] as AutodialerCall[])
      .map(this.callItemNormalize);
  }

  // Остальные
  get items () {
    return (this.$store.getters['autodialer/view/calls/items'] as AutodialerCall[])
      .map(this.callItemNormalize);
  }

  get itemsTotal () { return this.$store.getters['autodialer/view/calls/items_total']; }
  get itemsPerPage () { return this.$store.getters['autodialer/view/calls/items_per_page']; }

  get itemsSelected () {
    return this.$store.getters['autodialer/view/calls/items_selected'] || [];
  }

  set itemsSelected (val) {
    this.$store.commit('autodialer/view/calls/items_selected', val);
  }

  get filterOffset (): number { return this.$store.getters['autodialer/view/calls/filter_offset']; }
  set filterOffset (val: string|number) { this.$store.commit('autodialer/view/calls/filter_offset', +val); }

  public mounted () {
    // Каждые 5 секунд обновляем список звонящих
    this.timerIds.push(setInterval(() => {
      if (this.$route.name === 'auto_dialer_view_tab_contacts' && this.itemsSelected.length === 0) {
        this.$store.dispatch('autodialer/view/calls/fetch_callers', this.$route.params.id);
      }
    }, 5000));

    // Каждые 10 секунд обновляем общий список
    this.timerIds.push(setInterval(() => {
      if (this.$route.name === 'auto_dialer_view_tab_contacts' && this.itemsSelected.length === 0) {
        this.$store.dispatch('autodialer/view/calls/fetch', this.$route.params.id);
      }
    }, 10000));
  }

  public beforeDestroy () {
    this.timerIds.map(clearInterval);
  }

  private onBtnRefreshClick () {
    this.fetchCalls();
  }

  private onAppPaginationChange () {
    this.itemsFetching = true;
    this.$store.dispatch('autodialer/view/calls/fetch', this.$route.params.id)
      .finally(() => (this.itemsFetching = false));
  }

  private onBtnDeleteClick () {
    this.removalProcess = true;
    const ids = this.itemsSelected.map((e) => e.id);
    this.$axios.delete(`/auto-dialers/${this.$route.params.id}/contacts`, { params: { ids } })
      .then((response) => {
        if (response.status !== 200) {
          throw new APIError(response.data);
        }
        this.$toast.success('Deleted');
        this.itemsSelected = [];
        this.fetchCalls();
      }).catch((reason) => {
        if (reason instanceof APIError) {
          reason.errors.forEach((e) => {
            this.$toast.error(e.message);
          });
        } else {
          this.$toast.error(reason.message);
        }
      }).finally(() => (this.removalProcess = false));
  }

  private fetchCalls () {
    this.btnRefreshLoading = true;
    this.$store
      .dispatch('autodialer/view/calls/fetch', this.$route.params.id)
      .finally(() => (this.btnRefreshLoading = false));
  }

  private callItemNormalize (item: AutodialerCall) {
    return {
      ...item,
      you_can_call: item.you_can_call ? 'Да' : 'Нет',
      last_call_at: item.last_call_at ? this.$dayjs(item.last_call_at).format('DD.MM.YYYY HH:mm') : '—',
      next_call_at: item.next_call_at ? this.$dayjs(item.next_call_at).format('DD.MM.YYYY HH:mm') : '—'
    };
  }
}
</script>

<style lang="scss" scoped>

</style>

<i18n>
{
  "ru": {
    "In progress": "В процессе",
    "Complete": "Завершено"
  }
}
</i18n>
