<template>
  <v-card
    class="ml-1"
    tile
    flat
  >
    <v-row>
      <v-col>
        <v-btn
          text
          @click="clearLocalStorage"
        >
          {{ $tc('Clear local storage') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  methods: {
    clearLocalStorage () {
      localStorage.clear()
      window.location.reload()
    }
  }
})
</script>

<style scoped>

</style>
