<template>
  <v-sheet>
    <div class="d-flex justify-space-between">
      <div>
        <v-btn
          :disabled="processLoading"
          small
          tile
          text
          @click="onBtnAddClick"
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
      </div>
      <div>
        <app-pagination
          :per-page="50"
          :count="autoDialerTotal"
        />
      </div>
    </div>

    <v-divider class="my-2" />

    <template v-if="processLoading && autoDialerParams.length === 0">
      <div
        class="d-flex align-center justify-center"
        style="height: 500px"
      >
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else-if="autoDialerParams.length === 0">
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
                class="text-left"
              >
                {{ $tc('Mode') }}
              </th>
              <th
                class="text-left"
              >
                {{ $tc('Количество контактов') }}
              </th>
              <th
                class="text-left"
                style="width: 68%;"
              >
                {{ $tc('Процент завершённых') }}
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in autoDialerParams"
              :key="'tr-' + item.id"
            >
              <!-- Имя контакта -->
              <td style="white-space: nowrap">
                <router-link :to="{ name: 'auto_dialer_tab_main', params: { id: item.id } }">
                  {{ item.name }}
                </router-link>
              </td>
              <!-- Имя контакта -->

              <!-- Режим -->
              <td>
                <v-chip
                  v-if="item.mode === 'predictive'"
                  color="primary"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Предиктивный') }}
                </v-chip>
                <v-chip
                  v-else-if="item.mode === 'progressive'"
                  color="primary"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Прогрессивный') }}
                </v-chip>
              </td>
              <!-- Режим -->
              <!-- Количество контактов -->
              <td>
                {{ item.contacts_count }}
              </td>
              <!-- Количество контактов -->
              <!-- Процент завершённых -->
              <td>
                {{ item.percentage_completed_calls }}
              </td>
              <!-- Процент завершённых -->
              <!-- Действия -->
              <td>
                <v-btn
                  v-if="item.status === 'ready'"
                  :loading="processItemAction.includes(item.id)"
                  icon
                  x-small
                  @click="onBtnItemPlayClick(item)"
                >
                  <v-icon>
                    mdi-play
                  </v-icon>
                </v-btn>
                <v-btn
                  v-else-if="item.status === 'process'"
                  :loading="processItemAction.includes(item.id)"
                  color="red"
                  icon
                  x-small
                  @click="onBtnItemStopClick(item)"
                >
                  <v-icon>
                    mdi-stop
                  </v-icon>
                </v-btn>
              </td>
              <!-- Действия -->
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppPagination from '@/components/AppPagination/AppPaginator.vue'
import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Autodialer from '@/api/interfaces/Autodialer'
import AppDialogAutocomplete from '@/components/AppDialogAutocomplete/AppDialogAutocomplete.vue'
import { $axios } from '@/plugins/axios'
import debounce from '@/utils/debounce'
import AutodialerParams from '@/api/AutodialerParams'
import Component from 'vue-class-component'

@Component({
  components: {
    AppLoading,
    AppPagination
  }
})
export default class AutoDialerList extends Vue {
  // This is data
  processLoading = false
  processItemAction = []

  get autoDialerParams () { return this.$store.getters['autodialer/list/items'] }
  get autoDialerTotal () { return this.$store.getters['autodialer/list/total'] }

  // Фильтры
  get filterOffset (): number { return Number(this.$routerQuery.getQuery('offset')) || 0 }
  set filterOffset (val: number) { this.$routerQuery.setQuery({ offset: val }) }

  get requestParameters () {
    return {
      offset: this.filterOffset
    }
  }

  mounted () {
    this.fetch = debounce(this.fetch, 500)
    this.fetch()
  }

  fetch () {
    this.processLoading = true
    this.$store
      .dispatch('autodialer/list/fetch', this.requestParameters)
      .finally(() => (this.processLoading = false))
  }

  onBtnItemPlayClick (item: Autodialer) {
    this.processItemAction.push(item.id)
    new AutodialerParams()
      .start(item.id)
      .then(() => {
        this.$toast.success(this.$tc('Autodial is starting'))
        this.fetch()
      })
      .catch((e: Error) => {
        this.$toast.error(this.$tc(e.message))
      }).finally(() => {
        const index = this.processItemAction.findIndex(value => value === item.id)
        if (index > -1) {
          this.processItemAction.splice(index, 1)
        }
      })
  }

  onBtnItemStopClick (item: Autodialer) {
    this.processItemAction.push(item.id)
    new AutodialerParams()
      .stop(item.id)
      .then(() => {
        this.$toast.success(this.$tc('Autodial is stopping'))
        this.fetch()
      })
      .catch((e: Error) => {
        this.$toast.error(this.$tc(e.message))
      }).finally(() => {
        const index = this.processItemAction.findIndex(value => value === item.id)
        if (index > -1) {
          this.processItemAction.splice(index, 1)
        }
      })
  }

  async onBtnAddClick () {
    const searchProjects = debounce((q: string, ready: CallableFunction) => {
      $axios.get('/projects', { params: { q } })
        .then((response) => {
          ready(response.data.data)
        })
    }, 500)

    let projectId = 0
    const instance = await this.$dialog.show(AppDialogAutocomplete, {
      waitForResult: false,
      showClose: false,
      persistent: true,
      //= ===============================
      title: 'Создание нового "автообзвона"',
      itemText: 'name',
      itemValue: 'id',

      onSearch: searchProjects,
      onSelect: (id: number) => {
        projectId = id
      }
    })

    // @ts-expect-error: Vue $on
    instance.vmd.$on('ok', () => {
      instance.close()
      new AutodialerParams()
        .create({ project_id: projectId })
        .then((id: number) => {
          this.$toast.success(this.$tc('Autodial has been successfully created'))
          this.$router.push({
            name: 'auto_dialer_tab_params',
            params: {
              id: String(id)
            }
          })
        })
        .catch((e: Error) => {
          this.$toast.error(this.$tc(e.message))
        })
    })
    // @ts-expect-error: Vue $on
    instance.vmd.$on('cancel', () => (instance.close()))
  }

  onBtnRefreshClick () {
    this.fetch()
  }
}
</script>

<style scoped>

</style>
