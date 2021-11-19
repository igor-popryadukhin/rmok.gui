<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <v-btn
          :disabled="autoDialerFetchProcess"
          small
          tile
          text
          @click="onBtnAddClick"
        >
          {{ $tc('Create') }}
        </v-btn>
        <v-btn
          :disabled="autoDialerFetchProcess"
          small
          tile
          text
          @click="onBtnRefreshClick"
        >
          {{ $tc('Refresh') }}
        </v-btn>
      </template>
      <template #right>
        <app-pagination
          v-model="filterOffset"
          :per-page="50"
          :count="autoDialerTotal"
        />
      </template>
    </app-tools>
    <template v-if="autoDialerFetchProcess && autoDialerParams.length === 0">
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
      <v-simple-table
        class="table-contact-list"
        dense
      >
        <template #default>
          <thead>
            <tr>
              <th
                class="text-left"
                style="width: 20px;"
              >
                {{ $tc('Name') }}
              </th>
              <th
                class="text-left"
              >
                {{ $tc('Status') }}
              </th>
              <th
                class="text-left"
                style="width: 100%;"
              >
                {{ $tc('Mode') }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in autoDialerParams"
              :key="'tr-' + item.id"
            >
              <!-- Имя контакта -->
              <td style="white-space: nowrap">
                <router-link :to="{ name: 'auto_dialer_params_view', params: { id: item.id } }">
                  {{ item.name }}
                </router-link>
              </td>
              <!-- Имя контакта -->

              <!-- Статус -->
              <td>
                <v-chip
                  v-if="item.status === 'ready'"
                  color="blue"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Не активен') }}
                </v-chip>
                <v-chip
                  v-else-if="item.status === 'process'"
                  color="green"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Активен') }}
                </v-chip>
              </td>
              <!-- Статус -->
              <!-- Режим -->
              <td>
                <v-chip
                  v-if="item.mode === 'predictive'"
                  color="green"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Предиктивный') }}
                </v-chip>
                <v-chip
                  v-else-if="item.mode === 'progressive'"
                  color="blue"
                  label
                  x-small
                  outlined
                >
                  {{ $tc('Прогрессивный') }}
                </v-chip>
              </td>
              <!-- Режим -->
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
import { mapGetters } from 'vuex'
import Autodialer from '@/api/interfaces/Autodialer'

export default Vue.extend({
  components: {
    AppLoading,
    AppPagination
  },

  data () {
    return {
      processLoading: false
    }
  },

  computed: {
    ...mapGetters({
      autoDialerFetchProcess: 'auto_dialer/fetch_process',
      autoDialerParams: 'auto_dialer/params',
      autoDialerTotal: 'auto_dialer/total'
    }),

    filterOffset: {
      get () {
        return this.$store.getters['auto_dialer/filter_offset']
      },

      set (val: number) {
        return this.$store.commit('auto_dialer/filter_offset', val)
      }
    }
  },

  mounted () {
    if (this.autoDialerParams.length === 0) {
      this.fetch()
    }

    this.$watch('filterOffset', () => (this.fetch()))
  },

  methods: {
    fetch () {
      this.$store.dispatch('auto_dialer/fetch')
    },

    onBtnItemPlayOrPauseClick (item: Autodialer) {
      // TODO: Handler
    },

    onBtnAddClick () {
      // TODO: Dialog call
    },

    onBtnRefreshClick () {
      this.fetch()
    }
  }
})
</script>

<style scoped>

</style>
