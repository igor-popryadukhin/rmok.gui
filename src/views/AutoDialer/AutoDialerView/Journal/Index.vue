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
          :per-page="perPage"
          :count="total"
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
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: { AppPaginator, AppLoading, List }
})
export default class Index extends AppBase {
  @Ref() readonly tools!: Element

  loading = true
  btnRefreshLoading = false

  // Увеличивает значение при изменении размера компонента.
  tick = 0

  get total () { return this.$store.getters['autodialer/view/journal/items_count'] }
  get perPage () { return this.$store.getters['autodialer/view/journal/items_per_page'] }

  get offset (): number { return this.$store.getters['autodialer/view/journal/filter_offset'] }
  set offset (val: string|number) { this.$store.commit('autodialer/view/journal/filter_offset', +val) }

  get listHeight () {
    const tick = this.tick
    return this.$el.clientHeight - this.tools.clientHeight
  }

  created () {
    this.onAppPaginationChange = debounce(this.onAppPaginationChange, 450)
    this.onThisResizable = debounce(this.onThisResizable, 350)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/journal/fetch')
      .finally(() => (this.loading = false))
  }

  private onThisResizable () {
    this.tick++
  }

  private onBtnRefreshClick () {
    this.btnRefreshLoading = true
    this.$store.dispatch('autodialer/view/journal/fetch')
      .finally(() => (this.btnRefreshLoading = false))
  }

  private onAppPaginationChange () {
    this.$store.dispatch('autodialer/view/journal/fetch')
  }
}
</script>

<style lang="scss" scoped>

</style>
