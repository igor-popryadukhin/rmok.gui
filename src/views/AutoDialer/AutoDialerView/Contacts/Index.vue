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
          tile
          text
          small
        >
          {{ $tc('Add') }}
        </v-btn>
        <v-btn
          :loading="btnRefreshLoading"
          tile
          text
          small
          @click="onBtnRefreshClick"
        >
          {{ $tc('Refresh') }}
        </v-btn>
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

// eslint-disable-next-line no-use-before-define
@Component<Index>({
  components: { AppLoading, List }
})
export default class Index extends AppBase {
  @Ref() readonly tools!: Element

  loading = true
  btnRefreshLoading = false

  // Увеличивает значение при изменении размера компонента.
  tick = 0

  get listHeight () {
    const tick = this.tick
    return this.$el.clientHeight - this.tools.clientHeight
  }

  created () {
    this.onThisResizable = debounce(this.onThisResizable, 350)
  }

  mounted () {
    this.$store.dispatch('autodialer/view/calls/fetch', +this.$route.params.id)
      .finally(() => (this.loading = false))
  }

  private onThisResizable () {
    this.tick++
  }

  private onBtnRefreshClick () {
    this.btnRefreshLoading = true
    this.$store.dispatch('autodialer/view/calls/fetch', +this.$route.params.id)
      .finally(() => (this.btnRefreshLoading = false))
  }
}
</script>

<style lang="scss" scoped>

</style>
