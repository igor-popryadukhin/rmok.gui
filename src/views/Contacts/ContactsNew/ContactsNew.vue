<template>
  <div class="contacts-new__page">
    <div class="contacts-new__tools">
      <v-btn
        :disabled="itemsFetching"
        small
        tile
        text
        @click="onBtnRefreshClick"
      >
        {{ $tc('Refresh') }}
      </v-btn>
      <v-spacer />
      <app-count-up
        :end-val="itemsTotal"
        class="contacts-total"
      >
        <template #before>
          {{ $tc('Total') }}:
        </template>
      </app-count-up>
    </div>

    <app-divider
      :loading="itemsFetching"
    />

    <div class="contacts-new__content">
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
      <template
        v-else
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
              :to="{ name: 'contacts_view', params: { id: item.id } }"
              :disabled="item_ids_before_navigate.includes(item.id)"
              ripple
              selectable
              style="min-height: 35px"
              @click="item_ids_before_navigate.push(item.id)"
            >
              <v-list-item-content class="pa-0">
                <v-list-item-title>
                  {{ item.full_name }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import AppBase from '@/AppBase'
import AppCountUp from '@/components/AppCountup/AppCountUp.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import AppPaginator from '@/components/AppPagination/AppPaginator.vue'
import $store from '@/store'
import Component from 'vue-class-component'

@Component({
  components: { AppCountUp, AppPaginator, AppLoading },
  beforeRouteEnter (to, from, next) {
    $store.dispatch('contacts/contacts_new/fetch')
      .catch(() => (next()))
      .finally(() => (next()))
  }
})
export default class ContactsNew extends AppBase {
  item_ids_before_navigate = []

  get items () { return this.$store.getters['contacts/contacts_new/items'] }
  get itemsTotal () { return this.$store.getters['contacts/contacts_new/items_total'] }
  get itemsFetching () { return this.$store.getters['contacts/contacts_new/loading'] }

  private onBtnRefreshClick () {
    this.$store.dispatch('contacts/contacts_new/fetch')
  }

  private onAppPaginatorBtnClick () {
    this.$store.dispatch('contacts/contacts_new/fetch')
  }
}
</script>

<style lang="scss" scoped>
.contacts-new__page {
  height: calc(100% - 15px);
}

.contacts-new__content {
  height: inherit;
  overflow-y: auto;
}

.contacts-new__tools {
  display: flex;
  align-items: center;
  height: 36px;
}

.contacts-total {
  font-size: 14px;
  color: #767676;
}

</style>
