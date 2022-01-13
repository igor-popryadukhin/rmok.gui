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
          v-if="callsSelected.length === 0"
          :loading="btnRefreshLoading"
          tile
          text
          small
          @click="onBtnRefreshClick"
        >
          {{ $tc('Refresh') }}
        </v-btn>
        <v-btn
          v-if="callsSelected.length > 0"
          :loading="removalProcess"
          tile
          text
          small
          @click="onBtnDeleteClick"
        >
          {{ $tc('Delete') }}
        </v-btn>
        <v-btn
          v-if="callsSelected.length > 0"
          tile
          text
          small
          @click="onBtnDeleteClick"
        >
          {{ $tc('Repeat') }}
        </v-btn>
        <v-spacer />
        <app-paginator
          v-model="offset"
          :per-page="callsPerPage"
          :count="callsTotal"
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

  removalProcess = false
  loading = true
  btnRefreshLoading = false

  // Увеличивает значение при изменении размера компонента.
  tick = 0

  get callsSelected (): number[] { return this.$store.getters['autodialer/view/calls/items_selected'] }

  get callsTotal () { return this.$store.getters['autodialer/view/calls/total'] }
  get callsPerPage () { return this.$store.getters['autodialer/view/calls/per_page'] }

  get offset (): number { return this.$store.getters['autodialer/view/calls/filter_offset'] }
  set offset (val: string|number) { this.$store.commit('autodialer/view/calls/filter_offset', +val) }

  get requestParameters () {
    return {
      count: this.callsPerPage,
      offset: this.offset
    }
  }

  get listHeight () {
    const tick = this.tick
    return this.$el.clientHeight - this.tools.clientHeight
  }

  created () {
    this.onThisResizable = debounce(this.onThisResizable, 350)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/calls/fetch', this.requestParameters)
      .finally(() => (this.loading = false))
  }

  private onThisResizable () {
    this.tick++
  }

  private onBtnRefreshClick () {
    this.btnRefreshLoading = true
    this.$store.dispatch('autodialer/view/calls/fetch', this.requestParameters)
      .finally(() => (this.btnRefreshLoading = false))
  }

  private onAppPaginationChange () {
    this.loading = true
    this.$store.dispatch('autodialer/view/calls/fetch', this.requestParameters)
      .finally(() => (this.loading = false))
  }

  private onBtnDeleteClick () {
    this.removalProcess = true
    this.$store
      .dispatch('autodialer/view/calls/delete_selected')
      .then(() => {
        this.$store.dispatch('autodialer/view/calls/fetch', this.requestParameters)
      })
      .finally(() => (this.removalProcess = false))
  }
}
</script>

<style lang="scss" scoped>

</style>
