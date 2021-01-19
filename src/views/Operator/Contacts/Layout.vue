<template>
  <router-view />
</template>

<script lang="ts">
import Vue from 'vue'
import { loadLanguageAsync } from '@/plugins/i18n'

export default Vue.extend({
  // Загружаю дополнительно языковые пакеты
  beforeRouteEnter (to, from, next) {
    loadLanguageAsync('ru', 'contacts').then(() => next())
  }
})
</script>

<style scoped>

</style>
