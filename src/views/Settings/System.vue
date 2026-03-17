<template>
  <v-sheet>
    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('System settings') }}
        </h3>
      </template>
    </app-tools>
    <v-divider class="mb-2" />

    <v-row class="mb-2">
      <v-col>
        <v-btn
          text
          small
          tile
          outlined
          @click="clearLocalStorage"
        >
          {{ $tc('Clear local storage') }}
        </v-btn>
      </v-col>
    </v-row>

    <app-tools>
      <template #left>
        <h3 class="grey--text">
          {{ $tc('Caching') }}
        </h3>
      </template>
    </app-tools>
    <v-divider class="mb-2" />
    <v-row class="mb-2">
      <v-col class="d-flex d-inline-flex">
        <v-switch
          v-model="settingsVueKeepAlive"
          :label="$tc('Keep-alive')"
          :true-value="true"
          :false-value="false"
          :messages="keepAliveHelp"
        />
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  computed: {
    settingsVueKeepAlive: {
      set (value: boolean) {
        this.$store.commit('settings/vue_keep_alive', value);
      },
      get () {
        return this.$store.getters['settings/vue_keep_alive'];
      }
    },

    keepAliveHelp () {
      return 'Позволяет сохранять состояние ранее посещённых страниц.';
    }
  },

  methods: {
    clearLocalStorage () {
      localStorage.clear();
      window.location.reload();
    }
  }
});
</script>

<style scoped>

</style>
