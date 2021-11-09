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
          {{ $tc('Add') }}
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
                style="width: 10px;"
              >
                {{ $tc('Name') }}
              </th>
              <th
                class="text-left"
              >
                {{ $tc('State') }}
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
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue'
import AppLoading from '@/components/AppLoading/AppLoading.vue'
import { mapGetters } from 'vuex'
import Autodialer from '@/api/interfaces/Autodialer'

export default Vue.extend({
  components: { AppLoading },
  data () {
    return {
      processLoading: false
    }
  },

  computed: {
    ...mapGetters({
      autoDialerFetchProcess: 'auto_dialer/fetch_process',
      autoDialerParams: 'auto_dialer/params'
    })
  },

  mounted () {
    if (this.autoDialerParams.length === 0) {
      this.fetch()
    }
  },

  methods: {
    fetch () {
      this.$store.dispatch('auto_dialer/fetch')
    },

    onBtnItemPlayOrPauseClick (item: Autodialer) {
      // TODO: Handler
    },

    onBtnAddClick () {
      // TODO: Handler
    },

    onBtnRefreshClick () {
      this.fetch()
    }
  }
})
</script>

<style scoped>

</style>
