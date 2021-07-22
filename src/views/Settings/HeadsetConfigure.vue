<template>
  <div
    class="d-flex flex-column align-center justify-center"
    style="height: 300px"
  >
    <div class="mb-5">
      <v-icon size="100">
        {{ $route.meta.icon || 'mdi-cube-outline' }}
      </v-icon>
    </div>
    <div class="mb-5">
      <span class="grey--text">Страница для настройки гарнитуры, ещё не реализована.</span>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style scoped>

</style>
