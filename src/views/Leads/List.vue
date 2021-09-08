<template>
  <v-sheet class="mb-16">
    <!-- Лиды и задачи -->
    <app-tools>
      <template #left>
        <div class="d-flex flex-column">
          <h3 class="grey--text">
            {{ $tc('Новые') }}
          </h3>
          <small
            class="grey--text"
            style="line-height: 3px;"
          >
            {{ $tc('Quantity') }}:
            <app-count-up :end-val="contactsTotal" />
          </small>
        </div>
      </template>
      <template #right>
        <div class="align-self-end">
          <v-btn
            :loading="contactsProcessLoading"
            small
            tile
            text
            @click="onBtnRefreshClick"
          >
            {{ $tc('Refresh') }}
          </v-btn>
        </div>
      </template>
    </app-tools>
    <v-divider class="mb-2" />

    <template v-if="contactsItems.length > 0">
      <v-list>
        <template
          v-for="(item, itemIndex) in contactsItems"
        >
          <v-divider
            v-if="itemIndex > 0"
            :key="`divider-${item.id}`"
          />

          <v-list-item
            :key="`list-item-${item.id}`"
            ripple
            selectable
            :to="{ name: 'contacts_view', params: { contact_id: item.id } }"
            style="min-height: 35px"
          >
            <v-list-item-content class="pa-0">
              <v-list-item-title>
                {{ item.contact_name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-btn
        v-if="contactsMoreAvailable"
        :loading="contactsProcessLoading"
        block
        text
        tile
        @click="onBtnLoadMoreClick"
      >
        {{ $tc('Load more') }}
      </v-btn>
    </template>
    <template v-else-if="contactsProcessLoading && contactsItems.length === 0">
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          <app-loading />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="d-flex justify-center">
        <div class="pa-16 grey--text">
          {{ $tc('Empty') }}
        </div>
      </div>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import AppCountUp from '@/components/AppCountup/AppCountup.vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'

interface Data {
  [key: string]: any
}

interface Methods {
  [key: string]: any
}

interface Computed {
  [key: string]: any
}

export default Vue.extend<Data, Methods, Computed>({
  components: { AppLoading, AppCountUp },

  data (): Data {
    return {
      leadsPerPage: 50,
      leadsCount: 0,
      loadMoreOffset: 0,
      loadMoreProcess: false,
      loadMoreVisible: false
    }
  },

  computed: {
    ...mapGetters({
      contactsProcessLoading: 'contacts_new/process_loading',
      contactsOffset: 'contacts_new/offset',
      contactsMoreAvailable: 'contacts_new/more_available',
      contactsTotal: 'contacts_new/total',
      contactsItems: 'contacts_new/items'
    })
  },

  async mounted () {
    if (this.contactsItems.length === 0) {
      this.loadContacts()
    }
  },

  methods: {
    ...mapActions({
      fetchContacts: 'contacts_new/items',
      fetchMore: 'contacts_new/items_more'
    }),

    loadContacts () {
      this.$store.dispatch('contacts_new/items')
    },

    onBtnRefreshClick () {
      this.loadContacts()
    },

    onBtnLoadMoreClick () {
      this.fetchMore()
    }
  }
})
</script>

<style lang="scss" scoped>
.border {
  border-left: 2px #3A70D4 solid;
  margin-left: 5px;
}

.toolbar {
  &-subtitle {
    display: flex;
    flex-flow: column;
  }

  &-subtitle small {
    font-size: 12px;
    color: #848484;
  }
}

.v-card {
  display: flex !important;
  flex-direction: column;
}

.v-card__text {
  flex-grow: 1;
  overflow: auto;
}
</style>
