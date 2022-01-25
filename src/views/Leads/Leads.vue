<template>
  <v-sheet height="100%">
    <!-- Лиды и задачи -->
    <div class="leads-page__tools">
      <v-btn
        :disabled="itemsFetching"
        small
        tile
        text
        @click="onBtnRefreshClick"
      >
        {{ $tc('Refresh') }}
      </v-btn>
    </div>

    <v-progress-linear
      v-if="itemsFetching"
      height="4"
      indeterminate
    />
    <app-divider
      v-else
    />

    <template v-if="itemsFetching && items.length === 0">
      <div class="d-flex align-center justify-center fill-height">
        <app-loading />
      </div>
    </template>
    <template v-else-if="items.length === 0">
      <div class="d-flex align-center justify-center fill-height">
        {{ $tc('Empty') }}
      </div>
    </template>
    <div
      v-else
      class="leads-page__items"
    >
      <v-list>
        <template
          v-for="(item, itemIndex) in items"
        >
          <v-divider
            v-if="itemIndex > 0"
            :key="`divider-${item.id}`"
          />

          <v-list-item
            :key="`list-item-${item.id}`"
            ripple
            selectable
            :to="{ name: 'contacts_view', params: { id: item.id } }"
            style="min-height: 35px"
          >
            <v-list-item-content class="pa-0">
              <v-list-item-title>
                {{ item.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </div>
  </v-sheet>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Component from 'vue-class-component'
@Component({
  components: { AppLoading },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.$store.dispatch('leads/fetch')
    })
  }
})
export default class Leads extends AppBase {
  get items () { return this.$store.getters['leads/items'] }
  get itemsTotal () { return this.$store.getters['leads/items_total'] }
  get itemsFetching () { return this.$store.getters['leads/items_fetching'] }

  private onBtnRefreshClick () {
    this.$store.dispatch('leads/fetch')
  }
}
</script>

<style lang="scss" scoped>
.leads-page__tools {
  height: 35px;
}
.leads-page__items {
  height: calc(100% - 35px);
  height: -moz-calc(100% - 35px);
  height: -webkit-calc(100% - 35px);

  overflow: auto;
}
</style>
