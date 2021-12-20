<template>
  <v-sheet
    v-resize="onThisResizable"
    class="fill-height"
  >
    <!-- Tools -->
    <div
      ref="tools"
    >
      <div class="d-flex mb-1">
        <v-menu
          :close-on-content-click="false"
          bottom
          tile
        >
          <template #activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              tile
              text
              small
              v-on="on"
              @click="findUsers()"
            >
              {{ $tc('Add') }}
            </v-btn>
          </template>
          <v-card
            width="400"
            tile
          >
            <v-card-text>
              <v-text-field
                :label="$t('Search')"
                prepend-inner-icon="mdi-magnify"
                outlined
                dense
                hide-details
                @focus="findUsers()"
                @input="findUsers"
              />
            </v-card-text>
            <v-card-text>
              <div
                class="overflow-y-auto"
                style="height: 300px"
              >
                <div
                  v-if="usersLoading && avUsersFiltered.length === 0"
                  class="d-flex fill-height align-center justify-center"
                >
                  <app-loading :message="$t('Search') + '...'" />
                </div>
                <v-list v-else>
                  <template v-for="item in avUsersFiltered">
                    <v-list-item
                      v-if="!usersIdAdded.includes(item.id)"
                      :key="`v-list-item-${item.id}`"
                      dense
                    >
                      <v-list-item-avatar
                        color="primary"
                        class="white--text"
                        size="32"
                      >
                        {{ item.abbreviation }}
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ item.full_name }}
                        </v-list-item-title>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn
                          tile
                          text
                          x-small
                          @click.once="onItemAddUserClick(item.id)"
                        >
                          {{ $tc('Add') }}
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider
                      v-if="!usersIdAdded.includes(item.id)"
                      :key="`v-divider-${item.id}`"
                    />
                  </template>
                </v-list>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                tile
                text
                small
              >
                {{ $tc('Add') }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn
          :loading="btnRefreshLoading"
          tile
          text
          small
          @click="onBtnRefreshClick"
        >
          {{ $tc('Refresh') }}
        </v-btn>
        <v-spacer />
        <app-paginator
          v-model="offset"
          :per-page="operatorsPerPage"
          :count="operatorsTotal"
          @change="onAppPaginationChange"
        />
      </div>

      <v-divider />
    </div>
    <!-- Tools -->

    <div
      v-if="loading"
      class="d-flex align-center justify-center"
      style="height: inherit"
    >
      <app-loading />
    </div>
    <template v-else>
      <!-- Список -->
      <list
        :key="`list-${tick}`"
        :height="listHeight"
      />
      <!-- Список -->
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import List from './List.vue'
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import debounce from '@/utils/debounce'
import { Ref } from 'vue-property-decorator'
import { $axios } from '@/plugins/axios'
import { AxiosResponse } from 'axios'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: { AppPaginator, AppLoading, List }
})
export default class Index extends AppBase {
  @Ref() readonly tools!: Element

  loading = true
  btnRefreshLoading = false
  usersLoading = false
  usersIdAdded = []
  usersIdsForAdd = []
  avUsersCached = [] // Кешированный результат последнего поиска (результаты загрузок объединяются)
  avUsersFiltered = [] // Отфильтрованные пользователи

  // Увеличивает значение при изменении размера компонента.
  tick = 0

  get operatorsTotal () { return this.$store.getters['autodialer/view/operators/total'] }
  get operatorsPerPage () { return this.$store.getters['autodialer/view/operators/per_page'] }

  get offset (): number { return this.$store.getters['autodialer/view/operators/filter_offset'] }
  set offset (val: string|number) { this.$store.commit('autodialer/view/operators/filter_offset', +val) }

  get requestParameters () {
    return {
      count: this.operatorsPerPage,
      offset: this.offset
    }
  }

  get listHeight () {
    const tick = this.tick
    return this.$el.clientHeight - this.tools.clientHeight
  }

  created () {
    this.addUsers = debounce(this.addUsers, 3000)
    this.onThisResizable = debounce(this.onThisResizable, 350)
    this.findUsers = debounce(this.findUsers, 500)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/operators/fetch', this.requestParameters)
      .finally(() => (this.loading = false))
  }

  private onThisResizable () {
    this.tick++
  }

  private findUsers (q = '') {
    const filterItems = (q = '') => {
      console.log(q)
      this.avUsersFiltered = this
        .avUsersCached
        .filter((e) => (e.full_name || '')
          .toLowerCase()
          .indexOf((q || '')
            .toLowerCase()) > -1)

      return this.avUsersFiltered.length > 0
    }

    this.usersLoading = true
    if (!filterItems(q)) {
      $axios.get('/users', {
        params: {
          q
        }
      }).then((response: AxiosResponse) => {
        if (response.status === 200) {
          if (this.avUsersCached.length === 0) {
            // Сработает один раз!
            this.avUsersCached = (response.data.data || []).map(value => value)
            filterItems(q)
          } else {
            for (const item of (response.data.data || [])) {
              if (this.avUsersCached.findIndex(value => value.id === item.id) === -1) {
                this.avUsersCached.push(Object.assign({}, item))
              }
            }
          }
        }
      }).finally(() => (this.usersLoading = false))
    }
  }

  private onBtnRefreshClick () {
    this.btnRefreshLoading = true
    this.$store.dispatch('autodialer/view/operators/fetch', this.requestParameters)
      .finally(() => (this.btnRefreshLoading = false))
  }

  private onItemAddUserClick (userId: number) {
    this.usersIdsForAdd.push(userId)
    this.usersIdAdded.push(userId)
    this.addUsers(this.usersIdsForAdd)
  }

  private addUsers (userIds: number[]) {
    this.usersIdsForAdd = []
    this.$axios.post(`/autodialer/${this.$route.params.id}/operators`, {
      user_ids: userIds
    }).then((response: AxiosResponse) => {
      if (![200, 204].includes(response.status)) {
        throw new Error(response.data?.error_message || response.statusText)
      }
      this.$toast.success('Success')
      this.$store.dispatch('autodialer/view/operators/fetch', this.requestParameters)
    }).catch((reason: Error) => {
      this.$toast.error(reason.message)
    })
  }

  private onAppPaginationChange () {
    this.loading = true
    this.$store.dispatch('autodialer/view/operators/fetch', this.requestParameters)
      .finally(() => (this.loading = false))
  }
}
</script>

<style lang="scss" scoped>

</style>
